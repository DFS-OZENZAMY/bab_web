// Page /mentions-legales : identité de l'éditeur, hébergeur, propriété intellectuelle,
// données personnelles (loi 09-08, ancre #donnees-personnelles) et cookies.
// Les informations variables (nom, adresse, durée de conservation…) sont dans site.json → mentionsLegales.
import { tete } from './tete.js';
import { esc, lienWhatsApp } from '../lib/texte.js';
import { navigation } from '../sections/navigation.js';
import { piedDePage } from '../sections/pied-de-page.js';

const dateLisible = iso => new Date(`${iso}T12:00:00Z`)
  .toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// Affiche une ligne « Libellé : valeur » seulement si la valeur est renseignée.
const ligne = (libelle, valeur) => (valeur ? `<li><strong>${libelle} :</strong> ${valeur}</li>` : '');

export function mentionsLegales(site, { css }) {
  const m = site.mentionsLegales;
  const nom = esc(site.site.nom);
  const email = `<a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a>`;
  const responsable = m.responsable ? `${esc(m.responsable)}, ${nom}` : nom;

  return `<!DOCTYPE html>
<html lang="${site.site.langue}">
${tete(site, {
  titre: `Mentions légales et données personnelles | ${site.site.nom}`,
  description: `Mentions légales du site ${site.site.nom} et informations sur le traitement de vos données personnelles (loi 09-08).`,
  chemin: '/mentions-legales',
  indexer: false,
  css,
})}
<body>
${navigation(site, { racine: '/' })}

<main class="page-texte">
  <div class="wrap">
    <p class="fil"><a href="/">Accueil</a> <span aria-hidden="true">›</span> Mentions légales</p>
    <h1>Mentions légales et données personnelles</h1>
    <p class="maj">Dernière mise à jour : ${dateLisible(m.derniereMiseAJour)}</p>

    <nav class="sommaire" aria-label="Sommaire">
      <a href="#editeur">Éditeur</a>
      <a href="#hebergement">Hébergement</a>
      <a href="#propriete">Propriété intellectuelle</a>
      <a href="#donnees-personnelles">Données personnelles</a>
      <a href="#cookies">Cookies</a>
    </nav>

    <section id="editeur">
      <h2>Éditeur du site</h2>
      <ul>
        ${ligne('Nom commercial', nom)}
        ${ligne('Exploitant', esc(m.responsable))}
        ${ligne('Statut', `${esc(site.site.statut)} au Maroc`)}
        ${ligne('Identifiant', esc(m.identifiant))}
        ${ligne('Adresse', esc(m.adresse))}
        ${ligne('Email', email)}
        ${ligne('WhatsApp', `<a href="${lienWhatsApp(site)}" target="_blank" rel="noopener">${esc(site.contact.whatsappAffiche)}</a>`)}
        ${ligne('Responsable de la publication', esc(m.responsable || site.site.nom))}
      </ul>
    </section>

    <section id="hebergement">
      <h2>Hébergement</h2>
      <p>Le site est hébergé par <strong>${esc(m.hebergeur.nom)}</strong>, ${esc(m.hebergeur.adresse)} (<a href="${esc(m.hebergeur.site)}" target="_blank" rel="noopener">${esc(m.hebergeur.site.replace(/^https:\/\//, ''))}</a>).</p>
    </section>

    <section id="propriete">
      <h2>Propriété intellectuelle</h2>
      <p>Les textes, illustrations, le logo et la mise en page de ce site sont la propriété de ${nom}. Toute reproduction, même partielle, nécessite une autorisation écrite préalable.</p>
      <p>Les polices de caractères Bricolage Grotesque, Readex Pro et Instrument Serif sont utilisées sous licence libre SIL Open Font License.</p>
      <p>Les noms d'entreprises présentés dans la démonstration de la page d'accueil (riad, restaurant, cabinet) sont des exemples fictifs.</p>
    </section>

    <section id="donnees-personnelles">
      <h2>Données personnelles (loi 09-08)</h2>
      <p>Les informations envoyées par le formulaire de devis sont traitées conformément à la loi n° 09-08 du 18 février 2009 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel.</p>

      <h3>Responsable du traitement</h3>
      <p>${responsable}, joignable à ${email}.</p>

      <h3>Données collectées</h3>
      <p>Votre nom et votre numéro de téléphone (obligatoires), et si vous les indiquez : votre email, votre ville, la formule qui vous intéresse et la description de votre activité. Aucune autre donnée n'est collectée par le site.</p>

      <h3>Pourquoi</h3>
      <p>Uniquement pour répondre à votre demande de devis : vous recontacter, préparer une proposition et en assurer le suivi. Si vous indiquez votre email et cochez la case de consentement, un email de réponse vous est envoyé automatiquement ; son texte peut être rédigé avec l'aide d'un outil d'intelligence artificielle à partir des informations de votre demande. Vos données ne sont ni vendues, ni louées, ni utilisées pour une autre finalité.</p>

      <h3>Base du traitement</h3>
      <p>Votre consentement, donné en cochant la case du formulaire. Vous pouvez le retirer à tout moment par simple email.</p>

      <h3>Qui reçoit vos données</h3>
      <p>Seul ${nom} a accès à vos demandes. Pour fonctionner, le site s'appuie sur des prestataires techniques qui traitent les données uniquement pour notre compte :</p>
      <ul>
        <li><strong>Cloudflare</strong> : hébergement du site, réception du formulaire et rédaction assistée de l'email de réponse ;</li>
        <li><strong>Resend</strong> : envoi des emails ;</li>
        <li><strong>Telegram</strong> : notification de la nouvelle demande sur le téléphone de ${nom}.</li>
      </ul>
      <p>Ces prestataires peuvent traiter les données sur des serveurs situés hors du Maroc, notamment aux États-Unis et dans l'Union européenne.</p>
      <p>Si l'envoi du formulaire échoue, votre demande s'ouvre dans WhatsApp, afin que vous puissiez l'envoyer vous-même. Le message est alors soumis aux conditions de WhatsApp.</p>

      <h3>Durée de conservation</h3>
      <p>${esc(m.conservation)}.</p>

      <h3>Vos droits</h3>
      <p>Conformément aux articles 7, 8 et 9 de la loi 09-08, vous disposez d'un droit d'accès, de rectification et d'opposition, pour des motifs légitimes, au traitement de vos données. Pour l'exercer, écrivez à ${email} : une réponse vous sera apportée dans les meilleurs délais.</p>
      <p>Vous pouvez également adresser une réclamation à la Commission nationale de contrôle de la protection des données à caractère personnel (CNDP) : <a href="https://www.cndp.ma" target="_blank" rel="noopener">www.cndp.ma</a>.</p>
      ${m.declarationCndp ? `<p>Ce traitement a fait l'objet d'une déclaration auprès de la CNDP sous le numéro ${esc(m.declarationCndp)}.</p>` : ''}
    </section>

    <section id="cookies">
      <h2>Cookies et mesure d'audience</h2>
      <p>Ce site n'utilise aucun cookie, aucun outil de mesure d'audience et aucun service publicitaire. Les polices de caractères sont hébergées sur le site lui-même : votre navigation n'est transmise à aucun tiers.</p>
    </section>

    <p class="retour"><a class="btn ghost" href="/">Retour à l'accueil</a></p>
  </div>
</main>
${piedDePage(site)}
</body>
</html>
`;
}
