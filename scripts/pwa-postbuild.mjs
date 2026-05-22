// Post-Build-Schritt für die Web-/PWA-Veröffentlichung.
// Fügt Manifest, Theme-Farbe und Service-Worker in dist/index.html ein,
// erzeugt den SPA-Fallback (404.html) und schaltet Jekyll ab (.nojekyll).
// Aufruf: node scripts/pwa-postbuild.mjs   (nach `expo export`)

import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const indexPath = join(dist, 'index.html');

const HEAD_TAGS = `  <link rel="manifest" href="/dogai/manifest.json" />
  <meta name="theme-color" content="#E8743B" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="DogAI" />
  <link rel="apple-touch-icon" href="/dogai/icon-192.png" />
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/dogai/sw.js').catch(function () {});
      });
    }
  </script>
`;

let html = readFileSync(indexPath, 'utf8');
if (!html.includes('rel="manifest"')) {
  html = html.replace('</head>', HEAD_TAGS + '</head>');
  writeFileSync(indexPath, html, 'utf8');
}

// SPA-Fallback: GitHub Pages liefert 404.html für unbekannte Tiefen-Links.
copyFileSync(indexPath, join(dist, '404.html'));
// Ohne .nojekyll ignoriert GitHub Pages den _expo-Ordner (führender Unterstrich).
writeFileSync(join(dist, '.nojekyll'), '', 'utf8');

console.log('PWA-Postbuild fertig: Manifest, Service Worker, 404.html, .nojekyll.');
