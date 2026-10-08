import { esc, html, lienWhatsApp } from '../lib/texte.js';
import { tuileWhatsapp, tuileEmail } from '../illustrations/icones.js';
import { medina } from '../illustrations/medina.js';

// Le formulaire est envoyé à /api/lead (functions/api/lead.js) par src/scripts/devis.js.
// Les noms des champs (name="…") sont lus par la fonction : les changer des deux côtés.
export function contact(site) {
  const c = site.contactSection;
  const formules = site.offres.formules.map(f => `<option>${esc(f.nom)}</option>`).join('');
  return `
<section class="contact" id="contact">
  <div class="wrap">
    <div>
      <h2>${html(c.titre, site)}</h2>
      <p class="intro">${html(c.intro, site)}</p>
      <div class="direct">
        <a href="${lienWhatsApp(site)}" target="_blank" rel="noopener">
          ${tuileWhatsapp()}
          <div><b>${esc(site.contact.whatsappAffiche)}</b><span>WhatsApp, réponse dans la journée</span></div>
        </a>
        <a href="mailto:${esc(site.contact.email)}">
          ${tuileEmail()}
          <div><b>${esc(site.contact.email)}</b><span>Email</span></div>
        </a>
      </div>
    </div>

    <form id="devis" novalidate>
      <h3 class="full">${esc(c.formulaireTitre)}</h3>
      <label>Votre nom<input name="nom" required autocomplete="name"></label>
      <label>Téléphone ou WhatsApp<input name="telephone" type="tel" required autocomplete="tel" placeholder="06 00 00 00 00"></label>
      <label>Email (pour recevoir notre proposition)<input name="email" type="email" autocomplete="email" placeholder="vous@exemple.ma"></label>
      <label>Ville<input name="ville" autocomplete="address-level2" placeholder="Ex. : Marrakech"></label>
      <label class="full">Formule souhaitée
        <select name="formule"><option>Je ne sais pas encore</option>${formules}</select>
      </label>
      <label class="full">Votre activité<textarea name="message" placeholder="Ex. : restaurant de cuisine marocaine, je veux afficher mon menu et recevoir des réservations."></textarea></label>
      <label class="hp" aria-hidden="true">Ne pas remplir<input name="site_web_hp" tabindex="-1" autocomplete="off"></label>
      <label class="check full"><input type="checkbox" name="consentement" value="oui"> <span>${html(c.consentement, site, { nouvelOnglet: true })}</span></label>
      <button class="btn full" type="submit">${esc(c.bouton)}</button>
      <p class="form-note full" role="status"></p>
    </form>
  </div>
  ${medina()}
</section>`;
}
