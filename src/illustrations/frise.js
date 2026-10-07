// Frise zellige qui sépare l'en-tête des tarifs. Motif répété sur toute la largeur.
import { etoile } from '../lib/svg.js';

export const frise = () => `<svg class="frise" aria-hidden="true" preserveAspectRatio="none">
  <defs>
    <pattern id="zellige-frise" width="48" height="56" patternUnits="userSpaceOnUse">
      <path d="${etoile(0, 28, 16, 10)}" fill="none" stroke="#F2B33D" stroke-width="1.5"/>
      <path d="${etoile(48, 28, 16, 10)}" fill="none" stroke="#F2B33D" stroke-width="1.5"/>
      <path d="M24 18L34 28L24 38L14 28Z" fill="#2438A6" fill-opacity=".55"/>
      <circle cx="0" cy="28" r="3" fill="#C8643B"/>
      <circle cx="48" cy="28" r="3" fill="#C8643B"/>
    </pattern>
  </defs>
  <rect width="100%" height="56" fill="url(#zellige-frise)"/>
</svg>`;
