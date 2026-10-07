// Lanterne de la section FAQ (masquée sur mobile).
import { etoile } from '../lib/svg.js';

export const lanterne = () => `<svg class="lamp" viewBox="0 0 280 330" fill="none" aria-hidden="true">
  <circle cx="140" cy="220" r="120" fill="#F7D58A" fill-opacity=".45"/>
  <g class="lantern">
    <path d="M140 0V70" stroke="currentColor" stroke-opacity=".4" stroke-width="2"/>
    <circle cx="140" cy="74" r="6" stroke="currentColor" stroke-opacity=".4" stroke-width="2"/>
    <path d="M118 80H162L172 100H108Z" fill="#F2B33D"/>
    <path d="M108 100H172L190 200Q140 260 90 200Z" fill="#2438A6"/>
    <path d="M118 112L110 196M140 108V226M162 112L170 196" stroke="#F2B33D" stroke-width="2"/>
    <path d="${etoile(140, 160, 22, 14)}" fill="#F7D58A"/>
    <path d="${etoile(140, 160, 10, 6)}" fill="#F2B33D"/>
    <path d="M86 200H194" stroke="#F2B33D" stroke-width="5" stroke-linecap="round"/>
    <path d="M124 236H156L140 270Z" fill="#F2B33D"/>
    <path d="M140 270V300" stroke="#F2B33D" stroke-width="2"/>
    <circle cx="140" cy="306" r="5" fill="#C8643B"/>
  </g>
  <path d="M40 120l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill="#F2B33D"/>
  <path d="M236 80l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#2438A6"/>
</svg>`;
