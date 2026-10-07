// Point d'entrée : lit la configuration injectée par le build, puis lance chaque module.
// Les fichiers de ce dossier sont concaténés dans l'ordre alphabétique, main.js doit donc rester le dernier.
(() => {
  const config = JSON.parse(document.getElementById('config-site').textContent);
  document.querySelectorAll('[data-annee]').forEach(el => { el.textContent = new Date().getFullYear(); });
  initialiserDemo(config);
  initialiserDevis(config);
})();
