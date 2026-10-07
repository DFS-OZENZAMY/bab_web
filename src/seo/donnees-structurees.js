// Données structurées Schema.org (lues par Google) : entreprise, offres avec prix, site et FAQ.
// Tout est généré depuis site.json : un prix modifié là-bas est mis à jour ici automatiquement.
import { brut } from '../lib/texte.js';

export function donneesStructurees(site) {
  const url = `${site.site.url}/`;
  const id = suffixe => `${url}#${suffixe}`;
  const prix = site.offres.formules.map(f => f.prix);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': id('entreprise'),
        name: site.site.nom,
        description: brut(site.seo.resume, site),
        url,
        logo: `${site.site.url}/apple-touch-icon.png`,
        image: `${site.site.url}/og-image.png`,
        telephone: `+${site.contact.whatsapp}`,
        email: site.contact.email,
        priceRange: `${Math.min(...prix)} - ${Math.max(...prix)} ${site.offres.deviseIso}`,
        currenciesAccepted: site.offres.deviseIso,
        paymentAccepted: site.seo.paiementsAcceptes,
        address: { '@type': 'PostalAddress', addressCountry: 'MA' },
        areaServed: { '@type': 'Country', name: 'Maroc' },
        availableLanguage: ['fr', 'ar', 'en'],
        knowsAbout: site.seo.competences,
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Formules de création de site vitrine',
          itemListElement: site.offres.formules.map(f => ({
            '@type': 'Offer',
            name: f.nom,
            description: brut(f.resume, site),
            price: String(f.prix),
            priceCurrency: site.offres.deviseIso,
          })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': id('site'),
        url,
        name: site.site.nom,
        inLanguage: 'fr-MA',
        publisher: { '@id': id('entreprise') },
      },
      {
        '@type': 'FAQPage',
        mainEntity: site.faq.questions.map(q => ({
          '@type': 'Question',
          name: brut(q.question, site),
          acceptedAnswer: { '@type': 'Answer', text: brut(q.reponse, site) },
        })),
      },
    ],
  };
}
