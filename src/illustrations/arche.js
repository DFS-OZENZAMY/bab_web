// Illustration principale de l'en-tête : l'arche « bab » en zellige, la lanterne et le palmier.
// L'écran de démo est posé par-dessus en HTML (voir sections/hero.js), dans l'ouverture de l'arche.
import { etoile } from '../lib/svg.js';

const motif = (x, y) =>
  `<path d="${etoile(x, y, 11)}" stroke="#F2B33D" stroke-opacity=".4" stroke-width="1.4"/>` +
  `<circle cx="${x}" cy="${y}" r="2" fill="#F2B33D" fill-opacity=".5"/>`;

export const arche = () => `<svg viewBox="0 0 560 620" fill="none" aria-hidden="true">
  <defs>
    <pattern id="zellige-arche" width="44" height="88" patternUnits="userSpaceOnUse" x="12" y="0">
      ${motif(22, 22)}${motif(0, 66)}${motif(44, 66)}
    </pattern>
  </defs>
  <!-- Soleil -->
  <circle cx="420" cy="150" r="118" fill="#F7D58A" fill-opacity=".55"/>
  <circle cx="420" cy="150" r="84" fill="#F2B33D" fill-opacity=".35"/>
  <path d="M60 600H510" stroke="currentColor" stroke-opacity=".14" stroke-width="2"/>
  <!-- Arche en fer à cheval -->
  <path d="M98 600V330A192 192 0 1 1 462 330V600Z" fill="#EFE6D4"/>
  <path d="M112 600V330A178 178 0 1 1 448 330V600Z" fill="#2438A6"/>
  <path d="M136 600V330A154 154 0 1 1 424 330V600Z" fill="url(#zellige-arche)"/>
  <path d="M124 600V330A166 166 0 1 1 436 330V600" stroke="#F2B33D" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round"/>
  <path d="M168 600V352A112 112 0 1 1 392 352V600Z" fill="#16226B"/>
  <path d="M280 70L288 84L304 86L292 96L296 112L280 104L264 112L268 96L256 86L272 84Z" fill="#F2B33D"/>
  <!-- Lanterne (animée en CSS : .lantern) -->
  <g class="lantern">
    <path d="M72 0V96" stroke="currentColor" stroke-opacity=".35" stroke-width="1.5"/>
    <path d="M60 96H84L90 108H54Z" fill="#F2B33D"/>
    <path d="M54 108H90L96 150Q72 176 48 150Z" fill="#C8643B"/>
    <path d="M60 116V150M72 114V158M84 116V150" stroke="#F7D58A" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M50 150H94" stroke="#F2B33D" stroke-width="3" stroke-linecap="round"/>
    <path d="M64 164H80L72 182Z" fill="#F2B33D"/>
  </g>
  <!-- Palmier -->
  <path d="M500 600C498 520 488 470 470 430" stroke="#1F5545" stroke-width="5" stroke-linecap="round"/>
  <path d="M470 430C440 410 410 418 392 440C420 432 446 436 470 430Z" fill="#1F5545"/>
  <path d="M470 430C452 396 420 386 396 392C424 402 448 414 470 430Z" fill="#2E7A62"/>
  <path d="M470 430C476 392 500 372 528 368C510 384 492 406 470 430Z" fill="#1F5545"/>
  <path d="M470 430C500 414 532 418 552 438C522 434 496 432 470 430Z" fill="#2E7A62"/>
  <path d="M470 430C468 398 456 374 438 360C452 384 462 406 470 430Z" fill="#3B8F74"/>
  <!-- Scintillements -->
  <path d="M520 250l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill="#F2B33D"/>
  <path d="M36 300l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#2438A6"/>
</svg>`;
