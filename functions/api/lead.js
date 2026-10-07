// Bab Web – réception des demandes de devis (Cloudflare Pages Functions)
//
// 1. Reçoit le formulaire du site
// 2. Te notifie sur Telegram et/ou par email
// 3. Envoie au prospect un email personnalisé rédigé par l'IA (Workers AI)
//
// Variables à configurer dans Cloudflare (Settings → Variables and Secrets) :
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID   → notification instantanée sur ton téléphone
//   RESEND_API_KEY                          → envoi des emails (resend.com, gratuit)
//   FROM_EMAIL     ex. "Bab Web <contact@babweb.ma>" (adresse de ton domaine vérifié)
//   OWNER_EMAIL    ton email : reçoit chaque lead + une copie de l'email envoyé au prospect
//   WHATSAPP       ton numéro au format international, ex. 212612345678
// Liaisons (Settings → Bindings) :
//   AI    → Workers AI (rédaction personnalisée, offre gratuite quotidienne)
//   LEADS → KV namespace (optionnel : garde un historique des leads)

const MODELE_IA = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

const FORMULES = {
  Essentiel: "1 500 DH : site d'une page adapté au mobile, bouton WhatsApp, formulaire, Google Maps, en ligne en 7 jours",
  Business: '3 500 DH : jusqu\'à 6 pages en français et en arabe, référencement Google de base, fiche Google Business optimisée, email professionnel, 1re année d\'hébergement offerte',
  Premium: '6 500 DH : design sur mesure en français, arabe et anglais, rédaction des textes, galerie et blog, 3 mois de maintenance offerts',
};

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    const type = request.headers.get('content-type') || '';
    data = type.includes('application/json')
      ? await request.json()
      : Object.fromEntries(await request.formData());
  } catch {
    return json({ ok: false, error: 'Formulaire illisible.' }, 400);
  }

  // Anti-spam : champ invisible rempli uniquement par les robots
  if (data.site_web_hp) return json({ ok: true });

  const lead = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    nom: clean(data.nom, 80),
    telephone: clean(data.telephone, 30),
    email: clean(data.email, 120).toLowerCase(),
    ville: clean(data.ville, 60),
    formule: clean(data.formule, 30) || 'Je ne sais pas encore',
    message: clean(data.message, 1500),
    consentement: data.consentement === 'oui' || data.consentement === 'on',
  };

  if (!lead.nom || !lead.telephone) {
    return json({ ok: false, error: 'Indiquez votre nom et votre numéro.' }, 400);
  }
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) {
    return json({ ok: false, error: 'Adresse email invalide.' }, 400);
  }

  // Le traitement continue après la réponse : le visiteur n'attend pas l'IA
  context.waitUntil(traiter(lead, env));
  return json({ ok: true });
}

export function onRequest() {
  return json({ ok: false, error: 'Méthode non autorisée.' }, 405);
}

async function traiter(lead, env) {
  const taches = [notifierTelegram(lead, env), notifierEmail(lead, env)];
  if (env.LEADS) {
    taches.push(env.LEADS.put(`lead:${lead.date}:${lead.id}`, JSON.stringify(lead)).catch(e => console.error('KV', e)));
  }
  await Promise.all(taches);

  if (lead.email && lead.consentement && env.RESEND_API_KEY && env.FROM_EMAIL) {
    try {
      const mail = await redigerEmail(lead, env);
      await envoyerEmail(env, {
        to: [lead.email],
        bcc: env.OWNER_EMAIL ? [env.OWNER_EMAIL] : undefined,
        reply_to: env.OWNER_EMAIL || undefined,
        subject: mail.objet,
        text: mail.texte,
        html: texteEnHtml(mail.texte),
      });
    } catch (e) {
      console.error('Email prospect', e);
    }
  }
}

// ---------- Notifications pour toi ----------

async function notifierTelegram(lead, env) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  const wa = numeroWhatsApp(lead.telephone);
  const lignes = [
    '🔔 <b>Nouvelle demande de devis</b>',
    '',
    `👤 ${esc(lead.nom)}`,
    `📞 ${esc(lead.telephone)}`,
    lead.email ? `✉️ ${esc(lead.email)}` : '✉️ pas d\'email',
    lead.ville ? `📍 ${esc(lead.ville)}` : null,
    `📦 Formule : ${esc(lead.formule)}`,
    lead.message ? `\n💬 ${esc(lead.message)}` : null,
    '',
    lead.email && lead.consentement ? '✅ Email de présentation envoyé automatiquement' : '⚠️ Pas d\'email automatique (email absent ou pas de consentement)',
    wa ? `\n<a href="https://wa.me/${wa}">Répondre sur WhatsApp</a>` : null,
  ].filter(l => l !== null);
  try {
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: lignes.join('\n'), parse_mode: 'HTML', disable_web_page_preview: true }),
    });
  } catch (e) {
    console.error('Telegram', e);
  }
}

async function notifierEmail(lead, env) {
  if (!env.RESEND_API_KEY || !env.FROM_EMAIL || !env.OWNER_EMAIL) return;
  const texte = [
    `Nom : ${lead.nom}`,
    `Téléphone : ${lead.telephone}`,
    `Email : ${lead.email || '—'}`,
    `Ville : ${lead.ville || '—'}`,
    `Formule : ${lead.formule}`,
    '',
    lead.message || '(pas de message)',
  ].join('\n');
  try {
    await envoyerEmail(env, {
      to: [env.OWNER_EMAIL],
      reply_to: lead.email || undefined,
      subject: `Nouveau lead : ${lead.nom}${lead.ville ? ' (' + lead.ville + ')' : ''}`,
      text: texte,
      html: texteEnHtml(texte),
    });
  } catch (e) {
    console.error('Email notification', e);
  }
}

// ---------- Email personnalisé pour le prospect ----------

async function redigerEmail(lead, env) {
  const secours = emailModele(lead, env);
  if (!env.AI) return secours;

  const systeme = `Tu es le freelance derrière Bab Web, qui crée des sites vitrines pour les entreprises au Maroc.
Tu écris un email de réponse à un prospect qui vient de demander un devis sur ton site.

Règles strictes :
- Écris en français, vouvoiement, ton chaleureux et professionnel, phrases simples. 150 à 220 mots.
- Base-toi UNIQUEMENT sur ce que le prospect a écrit. N'invente aucun fait sur son entreprise (pas de chiffres, pas d'avis, pas de problème que tu ne connais pas). Si une information manque, reste général ou pose une question.
- Explique concrètement, pour son type d'activité, ce qu'un site lui apporterait (être trouvé sur Google et Google Maps, rassurer les clients, recevoir des demandes sur WhatsApp, etc.).
- Recommande UNE formule adaptée parmi celles-ci, avec son prix exact, sans en inventer d'autres :
  Essentiel – ${FORMULES.Essentiel}
  Business – ${FORMULES.Business}
  Premium – ${FORMULES.Premium}
- Termine par une prochaine étape claire : un appel ou un message WhatsApp pour préparer le devis sous 24 heures.
- Pas de promesse de résultat garanti (ex. « première place sur Google »).
- Signe « L'équipe Bab Web ».

Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour : {"objet": "...", "texte": "..."}`;

  const utilisateur = `Demande reçue :
Nom : ${lead.nom}
Ville : ${lead.ville || 'non précisée'}
Formule choisie : ${lead.formule}
Description de son activité : ${lead.message || 'non précisée'}`;

  try {
    const r = await env.AI.run(MODELE_IA, {
      messages: [{ role: 'system', content: systeme }, { role: 'user', content: utilisateur }],
      max_tokens: 900,
      temperature: 0.6,
    });
    const brut = typeof r?.response === 'string' ? r.response : JSON.stringify(r?.response ?? '');
    const m = brut.match(/\{[\s\S]*\}/);
    const obj = JSON.parse(m ? m[0] : brut);
    const objet = clean(obj.objet, 120);
    const texte = String(obj.texte || '').trim();
    if (objet && texte.length > 200) return { objet, texte: texte + piedEmail(env) };
  } catch (e) {
    console.error('IA', e);
  }
  return secours;
}

// Utilisé si l'IA n'est pas configurée ou échoue
function emailModele(lead, env) {
  const prenom = lead.nom.split(' ')[0];
  const formule = FORMULES[lead.formule]
    ? `Vous vous intéressez à la formule ${lead.formule} (${FORMULES[lead.formule]}).`
    : 'Nos formules vont de 1 500 DH pour un site d\'une page à 6 500 DH pour un site sur mesure en trois langues.';
  const texte = `Bonjour ${prenom},

Merci pour votre demande. Je l'ai bien reçue et je vous prépare une proposition sous 24 heures.

Aujourd'hui, la plupart de vos futurs clients cherchent d'abord sur Google ou Google Maps avant de se déplacer ou d'appeler. Un site clair, rapide et adapté au mobile vous permet d'être trouvé, de rassurer avant le premier contact, et de recevoir les demandes directement sur WhatsApp.

${formule}

Pour vous proposer la solution la plus adaptée, j'aimerais échanger quelques minutes avec vous sur votre activité et vos objectifs. Vous pouvez simplement répondre à cet email ou m'écrire sur WhatsApp.

À très vite,
L'équipe Bab Web`;
  return { objet: `${prenom}, votre demande de site internet est bien reçue`, texte: texte + piedEmail(env) };
}

function piedEmail(env) {
  const wa = env.WHATSAPP ? `\nWhatsApp : https://wa.me/${env.WHATSAPP}` : '';
  return `\n\n—\nBab Web · Création de sites vitrines au Maroc\nhttps://bab-web.pages.dev${wa}\nVous recevez cet email car vous avez demandé un devis sur notre site.`;
}

// ---------- Outils ----------

async function envoyerEmail(env, payload) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.FROM_EMAIL, ...payload }),
  });
  if (!r.ok) throw new Error(`Resend ${r.status} ${await r.text()}`);
}

function numeroWhatsApp(tel) {
  let n = String(tel).replace(/[^\d+]/g, '').replace(/^\+/, '').replace(/^00/, '');
  if (/^0[5-7]\d{8}$/.test(n)) n = '212' + n.slice(1);
  return /^\d{10,15}$/.test(n) ? n : '';
}

function texteEnHtml(t) {
  const corps = esc(t)
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>')
    .split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  return `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#1d2240;max-width:560px">${corps}</div>`;
}

function clean(v, max) {
  return String(v ?? '').replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '').trim().slice(0, max);
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}
