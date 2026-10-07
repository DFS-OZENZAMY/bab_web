# Bab Web – Site vitrine

📄 Documentation complète : [docs/FICHE-TECHNIQUE.md](docs/FICHE-TECHNIQUE.md)

Site statique (un seul fichier `index.html`), prêt pour Cloudflare Pages.

## À personnaliser avant la mise en ligne
1. Numéro WhatsApp : +33 7 58 98 43 18 (déjà configuré).
2. Remplacer `contact@babweb.ma` par ton email.
3. Créer une clé gratuite sur https://web3forms.com et remplacer `VOTRE_CLE_WEB3FORMS`.
   (Sans clé, le formulaire ouvre WhatsApp avec le message prérempli.)

## Déploiement
GitHub → Cloudflare Pages → Connect to Git → choisir le dépôt
Framework preset : None · Build command : (vide) · Output directory : /

## SEO
- Si l'adresse Cloudflare n'est pas `bab-web.pages.dev` (ou quand tu auras ton domaine), remplace
  `https://bab-web.pages.dev` partout dans `index.html`, `robots.txt` et `sitemap.xml`.
- Remplace aussi le téléphone et l'email dans le bloc `application/ld+json` de `index.html`.
- Après la mise en ligne : ajoute le site dans Google Search Console et envoie `sitemap.xml`.

## Système de leads (functions/api/lead.js)
Chaque demande du formulaire : notification Telegram + email pour toi, email personnalisé (IA) pour le prospect.
À configurer dans Cloudflare → Workers & Pages → bab-web → Settings :
- Variables and Secrets : TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, RESEND_API_KEY, FROM_EMAIL, OWNER_EMAIL, WHATSAPP
- Bindings : Workers AI → nom `AI` ; KV namespace (optionnel) → nom `LEADS`
Puis redéployer (Deployments → Retry deployment).
