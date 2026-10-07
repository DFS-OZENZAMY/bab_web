// Démo interactive de l'en-tête : les onglets Riad / Restaurant / Cabinet changent l'écran dans l'arche.
// Les données viennent de site.json (demos), injectées dans la page par le build (#config-site).
function initialiserDemo(config) {
  const onglets = document.querySelectorAll('[data-demo-id]');
  if (!onglets.length) return;
  const zone = nom => document.querySelector(`[data-demo="${nom}"]`);

  function afficher(id) {
    const demo = config.demos.find(d => d.id === id);
    if (!demo) return;
    zone('haut').style.background = demo.fond;
    zone('lieu').textContent = demo.lieu;
    zone('nom').textContent = demo.nom;
    zone('message').textContent = demo.message;

    const lignes = zone('lignes');
    lignes.replaceChildren();
    for (const [libelle, valeur] of demo.lignes) {
      const ligne = document.createElement('div');
      ligne.className = 'row';
      ligne.append(Object.assign(document.createElement('span'), { textContent: libelle }));
      ligne.append(Object.assign(document.createElement('strong'), { textContent: valeur }));
      lignes.append(ligne);
    }
    lignes.append(Object.assign(document.createElement('div'), { className: 'wa', textContent: demo.bouton }));

    onglets.forEach(o => o.setAttribute('aria-selected', String(o.dataset.demoId === id)));
  }

  onglets.forEach(o => o.addEventListener('click', () => afficher(o.dataset.demoId)));
}
