// Formulaire de devis : envoi à /api/lead (functions/api/lead.js).
// Si l'envoi échoue (notifications non configurées, réseau…), la demande s'ouvre dans WhatsApp : aucun prospect perdu.
function initialiserDevis(config) {
  const form = document.getElementById('devis');
  if (!form) return;
  const note = form.querySelector('.form-note');
  const bouton = form.querySelector('button[type=submit]');

  // Les boutons « Choisir Essentiel… » préremplissent la formule
  document.querySelectorAll('[data-formule]').forEach(lien =>
    lien.addEventListener('click', () => { form.formule.value = lien.dataset.formule; }));

  function ouvrirWhatsApp() {
    const ville = form.ville.value ? ` (${form.ville.value})` : '';
    const texte = `Bonjour, je suis ${form.nom.value}${ville}. Formule : ${form.formule.value}. ${form.message.value}`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(texte)}`, '_blank');
  }

  form.addEventListener('submit', async evenement => {
    evenement.preventDefault();
    if (!form.nom.value.trim() || !form.telephone.value.trim()) {
      note.textContent = 'Indiquez votre nom et votre numéro pour que je puisse vous répondre.';
      return;
    }
    if (form.email.value && !form.email.checkValidity()) {
      note.textContent = 'Vérifiez votre adresse email.';
      return;
    }

    bouton.disabled = true;
    note.textContent = 'Envoi en cours…';
    try {
      const reponse = await fetch('/api/lead', { method: 'POST', body: new FormData(form) });
      const resultat = await reponse.json();
      if (!resultat.ok) throw new Error(resultat.error || 'erreur');
      note.textContent = form.email.value && form.consentement.checked
        ? 'Demande envoyée. Vous allez recevoir un email de notre part, et je vous recontacte sous 24 heures.'
        : 'Demande envoyée. Je vous recontacte sous 24 heures.';
      form.reset();
    } catch {
      note.textContent = "L'envoi n'a pas fonctionné : votre demande s'ouvre dans WhatsApp.";
      ouvrirWhatsApp();
    } finally {
      bouton.disabled = false;
    }
  });
}
