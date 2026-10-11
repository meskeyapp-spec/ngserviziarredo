/* ==========================================================================
   NG Servizi Arredo — generatore sito statico (GitHub Pages)
   Uso:
     node build.mjs            → costruisce HTML + CSS + immagini + file extra
     node build.mjs --no-img   → salta l'ottimizzazione immagini (piu' veloce)
   Richiede 'sharp' solo per le immagini. Se non e' installato:
     npm i sharp           (dentro questa cartella)
     oppure:  NODE_PATH=<percorso>/node_modules node build.mjs
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT   = __dirname;                       // www/  (= radice del repo GitHub Pages)
const MEDIA  = path.join(ROOT, '..', 'media');  // libreria immagini WordPress (non versionata)
const IMGDIR = path.join(ROOT, 'assets', 'img');
const NOIMG  = process.argv.includes('--no-img');

/* ---------- dati sito ---------- */
const SITE   = 'https://ngserviziarredo.it';
const DOMAIN = 'ngserviziarredo.it';
const EMAIL  = 'info@ngserviziarredo.it';
const TEL    = '+39 366 431 8553';
const TEL_HREF = '+393664318553';
const PIVA   = '04845940271';
const IUB_PRIVACY = 'https://www.iubenda.com/privacy-policy/76628430';
const IUB_COOKIE  = 'https://www.iubenda.com/privacy-policy/76628430/cookie-policy';
const WEB3FORMS_KEY = 'INSERISCI_LA_TUA_ACCESS_KEY_WEB3FORMS';

const SOCIAL = {
  facebook:  'https://www.facebook.com/profile.php?id=61557172911297',
  instagram: 'https://www.instagram.com/ngserviziarredo/',
  whatsapp:  'https://wa.me/message/DVNVOHJJVB34A1',
  linkedin:  'https://www.linkedin.com/company/ngserviziarredo/',
};

const SLUG = {
  home:         'index.html',
  rilievo:      'rilievo-misure.html',
  consulenza:   'consulenza-dinterni-e-analisi-del-budget.html',
  montaggio:    'assistenza-al-montaggio-e-installazione.html',
  assemblaggio: 'assemblaggio-di-piccoli-mobili-e-falegnameria.html',
  postvendita:  'assistenza-post-vendita-e-rapporti-con-il-mobilificio.html',
  contatti:     'contatti.html',
};
const SERVICES = [
  [SLUG.rilievo,      'Rilievo misure'],
  [SLUG.consulenza,   "Consulenza d'interni"],
  [SLUG.montaggio,    'Assistenza al montaggio'],
  [SLUG.assemblaggio, 'Assemblaggio e falegnameria'],
  [SLUG.postvendita,  'Assistenza post-vendita'],
];

/* ---------- immagini: chiave -> file sorgente in ../media ---------- */
const IMAGES = {
  logo:              { src: '2024/03/copia-di-logo-rosso-vert.png', w: 460, alpha: true },
  'footer-logo':     { src: '2024/03/biglietto-da-visita.png',      w: 680, alpha: true },
  avatar:            { src: '2024/04/white-circle-profile-photo-instagram-post3.png', w: 460, alpha: true },

  'home-rilievo':      { src: '2024/03/1.png', w: 900 },
  'home-consulenza':   { src: '2024/03/2.png', w: 900 },
  'home-montaggio':    { src: '2024/03/3.png', w: 900 },
  'home-assemblaggio': { src: '2024/03/4.png', w: 900 },
  'home-postvendita':  { src: '2024/03/5.png', w: 900 },
  azienda:             { src: '2024/03/1-1.png', w: 1000 },
  missione:            { src: '2024/03/2-1-edited.png', w: 1000 },

  'rilievo-intro': { src: '2024/04/misure1.png', w: 1000 },
  'rilievo-1':     { src: '2024/04/3.png', w: 820 },
  'rilievo-2':     { src: '2024/04/4.png', w: 820 },
  'rilievo-3':     { src: '2024/04/5.png', w: 820 },

  'consulenza-intro': { src: '2024/04/interior6.png', w: 1000 },
  'consulenza-1':     { src: '2024/04/interior7.png', w: 820 },
  'consulenza-2':     { src: '2024/04/interior8.png', w: 820 },
  'consulenza-3':     { src: '2024/04/interior9.png', w: 820 },

  'montaggio-intro': { src: '2024/04/assist10.png', w: 1000 },
  'montaggio-1':     { src: '2024/04/assist11.png', w: 820 },
  'montaggio-2':     { src: '2024/04/assist12.png', w: 820 },

  'assemblaggio-intro': { src: '2024/04/ass13.png', w: 1000 },
  'assemblaggio-1':     { src: '2024/04/ass14.png', w: 820 },
  'assemblaggio-2':     { src: '2024/04/ass15.png', w: 820 },
  'assemblaggio-3':     { src: '2024/04/ass16.png', w: 820 },

  'postvendita-intro': { src: '2024/04/post17.png', w: 1000 },
  'postvendita-1':     { src: '2024/04/post18.png', w: 820 },
  'postvendita-2':     { src: '2024/04/post19.png', w: 820 },
};
const IMG = (key) => `assets/img/${key}.webp`;

/* ==========================================================================
   HELPER HTML
   ========================================================================== */
const esc = (s) => String(s).replace(/&(?![a-z#0-9]+;)/gi, '&amp;');

function icon(name) {
  const p = {
    facebook:  'M13 22v-8h2.7l.4-3H13V9c0-.9.3-1.5 1.6-1.5H16V4.8C15.7 4.8 14.7 4.7 13.6 4.7 11.2 4.7 9.6 6.1 9.6 8.7V11H7v3h2.6v8z',
    instagram: 'M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1C2.6 9.5 2.6 9.9 2.6 12s0 2.5.1 3.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-3.7s0-2.5-.1-3.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.1a4.9 4.9 0 110 9.8 4.9 4.9 0 010-9.8zm0 8a3.1 3.1 0 100-6.2 3.1 3.1 0 000 6.2zm6.2-8.2a1.15 1.15 0 11-2.3 0 1.15 1.15 0 012.3 0z',
    linkedin:  'M6.94 5A1.94 1.94 0 113 5a1.94 1.94 0 013.94 0zM3.2 8.5h3.5V21H3.2zM9.5 8.5H13v1.7h.05c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.4 4.4 5.6V21h-3.5v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9.5z',
    whatsapp:  'M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1112 20zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8.9-.1.2-.3.2-.5.1a6.5 6.5 0 01-1.9-1.2 7.3 7.3 0 01-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4c.1-.2.2-.3.2-.5s0-.4-.1-.5c-.1-.1-.5-1.3-.7-1.8-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1z',
  }[name];
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${p}"/></svg>`;
}

const socialRow = (cls = 'social') => `<div class="${cls}">
  <a href="${SOCIAL.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon('facebook')}</a>
  <a href="${SOCIAL.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a>
  <a href="${SOCIAL.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon('whatsapp')}</a>
  <a href="${SOCIAL.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon('linkedin')}</a>
</div>`;

const btn = (text, href, { block = false, sm = false } = {}) =>
  `<a class="btn${block ? ' btn--block' : ''}${sm ? ' btn--sm' : ''}" href="${href}">${text}</a>`;

const eyebrow = (t) => `<p class="eyebrow">${t}</p>`;

/* ---------- header / footer ---------- */
function header(active) {
  const sub = SERVICES.map(([f, l]) =>
    `<li><a href="${f}"${active === f ? ' aria-current="page"' : ''}>${l}</a></li>`).join('');
  const isSvc = SERVICES.some(([f]) => f === active);
  return `<a id="top" tabindex="-1"></a>
<header class="site-header">
  <div class="wrap site-header__in">
    <a class="brand" href="index.html" aria-label="NG Servizi Arredo — home">NG&nbsp;SERVIZI&nbsp;ARREDO</a>
    <input type="checkbox" id="navtoggle" class="navtoggle" hidden>
    <label for="navtoggle" class="navbtn" aria-label="Apri il menu"><span></span></label>
    <nav class="mainnav" aria-label="Principale">
      <ul>
        <li><a href="index.html"${active === SLUG.home ? ' aria-current="page"' : ''}>Home</a></li>
        <li class="has-sub">
          <a href="index.html#servizi"${isSvc ? ' aria-current="page"' : ''}>Servizi</a>
          <ul class="submenu">${sub}</ul>
        </li>
        <li><a href="contatti.html"${active === SLUG.contatti ? ' aria-current="page"' : ''}>Contatti</a></li>
        <li><a href="${IUB_PRIVACY}" target="_blank" rel="noopener">Privacy&nbsp;Policy</a></li>
      </ul>
    </nav>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="wrap site-footer__in">
    <p class="site-footer__top">${btn('&uarr; Torna su', '#top', { sm: true })}</p>
    <img class="site-footer__logo" src="${IMG('footer-logo')}" width="340" alt="NG Servizi Arredo"
         loading="lazy" decoding="async">
    <p class="site-footer__name"><strong>NG SERVIZI ARREDO</strong></p>
    <p class="site-footer__meta">
      di Nuncibello Giuseppe<br>
      30035 Mirano (VE)<br>
      <a href="mailto:${EMAIL}">${EMAIL}</a><br>
      P.IVA ${PIVA}<br>
      <strong><a href="tel:${TEL_HREF}">${TEL}</a></strong>
    </p>
    ${socialRow('social social--footer')}
    <p class="site-footer__legal">
      <a href="${IUB_PRIVACY}" target="_blank" rel="noopener">Privacy Policy</a>
      <span aria-hidden="true">&middot;</span>
      <a href="${IUB_COOKIE}" target="_blank" rel="noopener">Cookie Policy</a>
    </p>
  </div>
</footer>`;
}

/* ---------- shell pagina ---------- */
function page({ title, description, canonical, body, active = '', ogImage = 'assets/img/og.png' }) {
  const fullTitle = title === 'Home'
    ? 'NG Servizi Arredo — servizi di arredo a Mirano (VE)'
    : `${title} — NG Servizi Arredo`;
  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${fullTitle}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE}/${canonical}">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="NG Servizi Arredo">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${SITE}/${canonical}">
<meta property="og:image" content="${SITE}/${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="preload" href="assets/fonts/cardo-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
${header(active)}
<main id="content">
${body}
</main>
${footer()}
</body>
</html>`;
}

/* ---------- blocchi riutilizzabili ---------- */
const band = (inner, { variant = '', id = '', pad = '' } = {}) =>
  `<section class="band${variant ? ' band--' + variant : ''}${pad ? ' band--' + pad : ''}"${id ? ` id="${id}"` : ''}>
  <div class="wrap">
${inner}
  </div>
</section>`;

function serviceCard(key, href, title, text) {
  return `<article class="card card--link">
  <a class="card__media" href="${href}"><img src="${IMG(key)}" alt="" width="820" loading="lazy" decoding="async"></a>
  <h3 class="card__title">${title}</h3>
  <p>${text}</p>
  <a class="card__cta" href="${href}">Scopri di pi&ugrave; &rarr;</a>
</article>`;
}

function miniCard(m) {
  const price = m.price
    ? `<p class="mini__meta"><span class="mini__kicker">${m.kicker || 'Extra'}</span> <span class="price">${m.price}</span></p>`
    : (m.kicker ? `<p class="mini__meta"><span class="mini__kicker">${m.kicker}</span></p>` : '');
  return `<article class="card mini">
  <div class="mini__media"><img src="${IMG(m.key)}" alt="" width="820" loading="lazy" decoding="async"></div>
  ${price}
  <h3 class="mini__title">${m.h}</h3>
  <p class="mini__text">${m.p}</p>
</article>`;
}

/* ==========================================================================
   HOME
   ========================================================================== */
function buildHome() {
  const hero = `<section class="hero">
  <div class="wrap hero__in">
    <img class="hero__logo" src="${IMG('logo')}" width="240" alt="NG Servizi Arredo"
         fetchpriority="high" decoding="async">
    <p class="hero__tag">Servizi di arredo a Mirano (VE) &mdash; misure, consulenza, montaggio. Non vendo mobili.</p>
    ${btn('Chiedi una consulenza GRATUITA', 'contatti.html')}
  </div>
</section>`;

  const serviziInner = `    ${eyebrow('I servizi')}
    <h2 class="band__title">Come posso aiutarti</h2>
    <div class="grid grid--3 grid--top">
      ${serviceCard('home-rilievo', SLUG.rilievo, 'Rilievo misure e verifica del progetto',
        'Rilevo le misure con precisione: &egrave; il presupposto per un arredo perfettamente integrato. Verifico anche che il progetto sia coerente con le misure reali, per prevenire errori e costi aggiuntivi.')}
      ${serviceCard('home-consulenza', SLUG.consulenza, "Consulenza d'interni e analisi del budget",
        'Ti aiuto a unire funzionalit&agrave; ed estetica evitando scelte costose e poco mirate, con un&rsquo;analisi del budget che trasforma le idee in realt&agrave; senza superare i limiti stabiliti.')}
      ${serviceCard('home-montaggio', SLUG.montaggio, 'Assistenza al montaggio e installazione',
        'Un montaggio accurato &egrave; un risparmio nel lungo periodo. Seguo l&rsquo;installazione perch&eacute; sia fatta bene: preservo l&rsquo;estetica e l&rsquo;integrit&agrave; dei mobili e ne allungo la durata.')}
      ${serviceCard('home-assemblaggio', SLUG.assemblaggio, 'Assemblaggio di piccoli mobili e falegnameria',
        'Quei piccoli interventi che il falegname di fiducia spesso non ha il tempo di fare: assemblaggio, regolazione della ferramenta, adattamenti dopo un trasloco.')}
      ${serviceCard('home-postvendita', SLUG.postvendita, 'Assistenza post-vendita e rapporti con il mobilificio',
        'Ti seguo anche dopo il montaggio: gestisco i rapporti con il mobilificio, monitoro le tempistiche dell&rsquo;assistenza e cerco i ricambi quando il negozio non riesce pi&ugrave; a fornirli.')}
    </div>`;

  const azienda = `    <div class="split">
      <div class="split__media"><img class="avatar" src="${IMG('avatar')}" width="220" alt="Giuseppe Nuncibello"
           loading="lazy" decoding="async"></div>
      <div class="split__text">
        ${eyebrow('Chi sono')}
        <h2 class="band__title">Giuseppe Nuncibello</h2>
        <p>Con oltre 20 anni di esperienza nel settore dell&rsquo;arredamento, metto la mia competenza al servizio dei clienti offrendo un supporto completo: dal rilievo delle misure alla realizzazione di soluzioni d&rsquo;arredo chiavi in mano.</p>
        <p>La lunga esperienza mi permette di interpretare al meglio le esigenze di ogni persona, creando ambienti unici e funzionali che coniugano estetica e praticit&agrave;.</p>
      </div>
    </div>`;

  const missione = `    <div class="split split--reverse">
      <div class="split__media"><img src="${IMG('missione')}" width="1000" alt="" loading="lazy" decoding="async"></div>
      <div class="split__text">
        ${eyebrow('La missione')}
        <h2 class="band__title">Consulenza indipendente, non vendita</h2>
        <p>L&rsquo;obiettivo della mia attivit&agrave; &egrave; offrire consulenza esperta e soluzioni progettuali su misura, senza la fornitura diretta di mobili.</p>
        <p>Comprendo a fondo le esigenze e lo stile di ogni cliente e lo guido passo dopo passo, con consigli mirati per creare ambienti unici, funzionali e in linea con il budget disponibile. Il focus esclusivo sui servizi garantisce un supporto professionale e indipendente.</p>
      </div>
    </div>`;

  const contattiTeaser = `    ${eyebrow('Parliamone')}
    <h2 class="band__title">Raccontami il tuo progetto</h2>
    <p class="band__lead">Prima consulenza e preventivo gratuiti. Rispondo di persona, di solito in giornata.</p>
    ${btn('Vai ai contatti', 'contatti.html')}`;

  return page({
    title: 'Home',
    description: 'NG Servizi Arredo di Nuncibello Giuseppe — servizi di arredo a Mirano (VE): rilievo misure, consulenza d’interni e analisi del budget, assistenza al montaggio, assemblaggio, assistenza post-vendita. Non vendo mobili.',
    canonical: 'index.html',
    active: SLUG.home,
    body: [
      hero,
      band(serviziInner, { id: 'servizi', variant: 'tint' }),
      band(azienda),
      band(missione, { variant: 'tint' }),
      band(contattiTeaser, { variant: 'red', pad: 'lg' }),
    ].join('\n'),
  });
}

/* ==========================================================================
   PAGINE SERVIZIO
   ========================================================================== */
function buildService(s) {
  const lead = band(
    `    ${eyebrow('Servizio')}\n    <p class="band__lead">${s.lead}</p>`,
    { pad: 'sm' }
  );

  const intro = band(`    <div class="split split--intro">
      <div class="split__media"><img src="${IMG(s.introKey)}" alt="" width="1000" loading="lazy" decoding="async"></div>
      <div class="split__text">
        <h2 class="band__title band__title--sm">${s.intro.h}</h2>
        <p>${s.intro.p}</p>
        ${s.intro.price ? `<p class="mini__meta"><span class="mini__kicker">Tariffa</span> <span class="price">${s.intro.price}</span></p>` : ''}
        ${btn(s.cta, 'contatti.html')}
      </div>
    </div>`);

  const gridClass = s.mini.length === 2 ? 'grid--2' : 'grid--3';
  const sezione = band(`    ${eyebrow(s.sectionKicker)}
    <h2 class="band__title band__title--center">${s.sectionTitle}</h2>
    <div class="grid ${gridClass} grid--top">
      ${s.mini.map(miniCard).join('\n      ')}
    </div>
    ${s.extra || ''}
    <p class="band__cta">${btn(s.cta, 'contatti.html')}</p>`, { variant: 'tint' });

  const cta = band(`    ${eyebrow(s.ctaHeadline.kicker)}
    <h2 class="band__title band__title--center">${s.ctaHeadline.title}</h2>
    <p class="band__cta">${btn(s.cta, 'contatti.html')}</p>`, { variant: 'red', pad: 'lg' });

  const pager = `<nav class="pager" aria-label="Altri servizi">
  <div class="wrap pager__in">
    <a class="pager__prev" href="${s.prev[0]}"><span>&laquo; Precedente</span><b>${s.prev[1]}</b></a>
    <a class="pager__next" href="${s.next[0]}"><span>Successivo &raquo;</span><b>${s.next[1]}</b></a>
  </div>
</nav>`;

  return page({
    title: s.title,
    description: s.description,
    canonical: s.slug,
    active: s.slug,
    body: [
      `<section class="page-head"><div class="wrap"><h1>${s.title}</h1></div></section>`,
      lead, intro, sezione, cta, pager,
    ].join('\n'),
  });
}

const kmExtra = `
    <hr class="rule">
    <h3 class="band__title band__title--sm band__title--center">Oltre i 40 km da Mirano</h3>
    <div class="split split--intro">
      <div class="split__text">
        <p>Per gli ambienti fuori zona applico una maggiorazione chilometrica lineare, calcolata sulla sola andata. Oltre i 150 km, o per casi particolari, si concorda prima.</p>
      </div>
      <div class="split__media">
        <table class="ratecard">
          <tbody>
            <tr><th scope="row">Base &middot; entro 40 km</th><td>incluso</td></tr>
            <tr><th scope="row">Ogni km oltre i 40</th><td>+ 1&nbsp;&euro;</td></tr>
            <tr><th scope="row">Conteggio</th><td>sola andata</td></tr>
            <tr><th scope="row">Oltre 150 km</th><td>da concordare</td></tr>
          </tbody>
        </table>
      </div>
    </div>`;

const SERVICE_DATA = [
  {
    slug: SLUG.rilievo,
    title: 'Rilievo misure e verifica del progetto',
    description: 'Rilievo misure con strumenti professionali a Mirano (VE): goniometro digitale, estensimetro e misuratore laser. Verifica del progetto e report per il mobilificio.',
    lead: 'Misure prese con precisione strumentale, prima che l&rsquo;arredo arrivi in casa. &Egrave; il presupposto per un progetto che torna al centimetro.',
    introKey: 'rilievo-intro',
    intro: {
      h: 'Rilievo misure, 1 ambiente',
      p: 'Rilevo le misure con strumenti professionali &mdash; goniometro digitale, estensimetro e misuratore laser &mdash; e consegno un quadro esatto dell&rsquo;ambiente, pronto per il mobilificio.',
      price: '<s>60&nbsp;&euro;</s> <strong>40&nbsp;&euro;</strong> &middot; entro 40 km da Mirano',
    },
    cta: 'Richiedi il servizio',
    sectionKicker: 'Su richiesta',
    sectionTitle: 'Servizi aggiuntivi',
    ctaHeadline: { kicker: 'Un ambiente da misurare?', title: 'Partiamo dalle misure giuste' },
    mini: [
      { key: 'rilievo-1', h: 'Rilievo ambienti extra', kicker: 'cad.', price: '<s>20&nbsp;&euro;</s> <strong>10&nbsp;&euro;</strong>',
        p: 'Se serve, verifico altri ambienti &mdash; per acquisti gi&agrave; fatti o per valutare nuovi arredi &mdash; a un prezzo contenuto.' },
      { key: 'rilievo-2', h: 'Verifica del progetto', kicker: 'verifica', price: '<s>40&nbsp;&euro;</s> <strong>20&nbsp;&euro;</strong>',
        p: 'Controllo che il progetto acquistato sia compatibile con le misure. In alternativa lo abbozziamo insieme, tenendo conto di spazi e vincoli costruttivi.' },
      { key: 'rilievo-3', h: 'Report digitale e fotografico', kicker: 'su richiesta', price: '<s>10&nbsp;&euro;</s> <strong>Gratuito</strong>',
        p: 'Dopo il rilievo invio misure e fotografie al mobilificio di fiducia del Cliente, mettendolo in copia e conservando un backup.' },
    ],
    extra: kmExtra,
    prev: [SLUG.postvendita, 'Assistenza post-vendita'],
    next: [SLUG.consulenza, "Consulenza d'interni"],
  },
  {
    slug: SLUG.consulenza,
    title: "Consulenza d'interni e analisi del budget",
    description: "Consulenza d'interni indipendente e analisi del budget a Mirano (VE): estetica, funzionalità e spesa reale, senza vendere mobili.",
    lead: 'Un progetto d&rsquo;arredo che unisce estetica, funzionalit&agrave; e budget reale &mdash; senza vendere mobili, solo consulenza indipendente.',
    introKey: 'consulenza-intro',
    intro: {
      h: 'Analisi della spesa e del budget',
      p: 'Insieme al Cliente analizzo l&rsquo;idea di spesa e di investimento da dedicare all&rsquo;arredo, tenendo conto dell&rsquo;andamento del mercato, delle promozioni in corso e del risultato che si vuole ottenere.',
    },
    cta: 'Richiedi un preventivo GRATUITO',
    sectionKicker: 'Cosa comprende',
    sectionTitle: 'Servizi aggiuntivi',
    ctaHeadline: { kicker: 'Hai un ambiente da progettare?', title: 'Parliamo del tuo progetto' },
    mini: [
      { key: 'consulenza-1', h: 'Assistenza alla progettazione', kicker: 'appuntamento',
        p: 'Posso fissare un appuntamento e recarmi al mobilificio con il Cliente o per suo conto. Il fornitore di arredi pu&ograve; essere scelto dal Cliente o valutato insieme.' },
      { key: 'consulenza-2', h: 'Indicazione delle promozioni in corso', kicker: 'mercato',
        p: 'Fornisco aggiornamenti sulle campagne promozionali in corso e ne valuto l&rsquo;effettivo vantaggio ai fini del risparmio sulla spesa finale.' },
      { key: 'consulenza-3', h: 'Risparmia con gli acquisti online', kicker: 'e-commerce',
        p: 'Per gli arredi eseguo una ricerca mirata in base a stile e budget. Soprattutto per la cucina si possono risparmiare centinaia o migliaia di euro sugli elettrodomestici da incasso.' },
    ],
    prev: [SLUG.rilievo, 'Rilievo misure'],
    next: [SLUG.montaggio, 'Assistenza al montaggio'],
  },
  {
    slug: SLUG.montaggio,
    title: 'Assistenza al montaggio e installazione',
    description: 'Assistenza al montaggio e installazione dell’arredamento a Mirano (VE): controllo componenti, supporto ai montatori, rapporti con il negozio.',
    lead: 'Un montaggio accurato dell&rsquo;arredamento &egrave; un risparmio nel lungo periodo: seguo l&rsquo;installazione perch&eacute; sia fatta bene.',
    introKey: 'montaggio-intro',
    intro: {
      h: 'Assistenza al montaggio dell&rsquo;arredo',
      p: 'Fornisco assistenza durante il montaggio dell&rsquo;arredamento: seguo le operazioni di scarico, tutelo la propriet&agrave; del Cliente e mi assicuro che il lavoro sia portato a termine correttamente.',
    },
    cta: 'Richiedi un preventivo GRATUITO',
    sectionKicker: 'Cosa comprende',
    sectionTitle: 'Servizi inclusi',
    ctaHeadline: { kicker: 'Arredo in arrivo?', title: 'Fissiamo l&rsquo;assistenza al montaggio' },
    mini: [
      { key: 'montaggio-1', h: 'Supporto in fase di installazione', kicker: 'controllo',
        p: 'Controllo il progetto e i componenti ricevuti, cos&igrave; da avviare un montaggio corretto e senza intoppi. Se serve, do supporto per la posizione dell&rsquo;arredo o per integrare la ferramenta mancante.' },
      { key: 'montaggio-2', h: 'Comunicazione con il negozio', kicker: 'difetti',
        p: 'Nell&rsquo;arredo l&rsquo;errore umano &egrave; quasi sempre in agguato: risolvo il problema o so cosa comunicare al mobilificio, cos&igrave; da completare l&rsquo;installazione in fretta e con il minor disagio per il Cliente.' },
    ],
    prev: [SLUG.consulenza, "Consulenza d'interni"],
    next: [SLUG.assemblaggio, 'Assemblaggio e falegnameria'],
  },
  {
    slug: SLUG.assemblaggio,
    title: 'Assemblaggio di piccoli mobili e falegnameria',
    description: 'Assemblaggio di piccoli mobili, regolazione ferramenta, piccoli interventi di falegnameria e adattamenti dopo un trasloco, a Mirano (VE).',
    lead: 'Quei lavori che il falegname di fiducia spesso non ha il tempo di fare: li faccio io, con cura e in tempi brevi.',
    introKey: 'assemblaggio-intro',
    intro: {
      h: 'Montaggio in loco e riposizionamento',
      p: 'Monto piccoli mobili gi&agrave; ritirati o consegnati che il Cliente non riesce ad assemblare in autonomia o per cui non ha gli strumenti adatti. Mi occupo anche di riposizionare un mobile in casa o di installare semplici mensole e complementi.',
    },
    cta: 'Richiedi un preventivo GRATUITO',
    sectionKicker: 'Cosa comprende',
    sectionTitle: 'Altri servizi',
    ctaHeadline: { kicker: 'Un mobile da montare o sistemare?', title: 'Scrivimi cosa ti serve' },
    mini: [
      { key: 'assemblaggio-1', h: 'Manutenzione dell&rsquo;arredo esistente', kicker: 'ferramenta',
        p: 'Per chi vuole mantenere l&rsquo;arredo su cui ha gi&agrave; investito: regolo o sostituisco cerniere e ferramenta che con il tempo si sono assestate o usurate.' },
      { key: 'assemblaggio-2', h: 'Piccoli interventi e falegnameria', kicker: 'casa',
        p: 'Svolgo tutti quei piccoli lavori che il falegname di fiducia spesso non ha il tempo o la convenienza di fare, e per cui il Cliente rischia di aspettare mesi.' },
      { key: 'assemblaggio-3', h: 'Adattamenti dopo un trasloco', kicker: 'trasloco',
        p: 'Dopo un trasloco l&rsquo;arredo non sempre si adatta alle nuove misure. Con un occhio esperto aiuto a integrare o sostituire alcuni elementi &mdash; per esempio il top della cucina &mdash; o a riadattare le armadiature.' },
    ],
    prev: [SLUG.montaggio, 'Assistenza al montaggio'],
    next: [SLUG.postvendita, 'Assistenza post-vendita'],
  },
  {
    slug: SLUG.postvendita,
    title: 'Assistenza post-vendita e rapporti con il mobilificio',
    description: 'Assistenza post-vendita: gestione dei rapporti con il mobilificio dopo il montaggio, monitoraggio delle tempistiche e ricerca dei ricambi, anche a distanza di tempo.',
    lead: 'Il servizio non finisce con il montaggio: seguo il Cliente anche dopo, nei rapporti con il mobilificio e nella ricerca dei ricambi.',
    introKey: 'postvendita-intro',
    intro: {
      h: 'Rapporti con il mobilificio dopo il montaggio',
      p: 'A montaggio concluso possono emergere problemi: pezzi mancanti, articoli rotti o danneggiati. Mi assicuro che gli ordini di ricambio siano corretti e faccio in modo che l&rsquo;arredo consegnato sia il pi&ugrave; possibile utilizzabile, evitando al Cliente il disagio di mobili montati a met&agrave;.',
    },
    cta: 'Richiedi un preventivo GRATUITO',
    sectionKicker: 'Cosa comprende',
    sectionTitle: 'Servizi inclusi',
    ctaHeadline: { kicker: 'Un&rsquo;assistenza che si trascina?', title: 'Me ne occupo io' },
    mini: [
      { key: 'postvendita-1', h: 'Monitoraggio delle tempistiche', kicker: 'follow-up',
        p: 'Comunico direttamente e per conto del Cliente, tengo monitorata la fornitura dei pezzi mancanti e verifico la completezza del nuovo ordine.' },
      { key: 'postvendita-2', h: 'Ricerca dell&rsquo;azienda produttrice', kicker: 'ricambi',
        p: 'Quando il mobilificio non riesce pi&ugrave; a fornire un ricambio &mdash; articolo fuori produzione o fornitore cambiato &mdash; anche a distanza di tempo contatto un rivenditore o direttamente la fabbrica.' },
    ],
    prev: [SLUG.assemblaggio, 'Assemblaggio e falegnameria'],
    next: [SLUG.rilievo, 'Rilievo misure'],
  },
];

/* ==========================================================================
   CONTATTI + GRAZIE + 404
   ========================================================================== */
function buildContatti() {
  const form = `<form class="cform" action="https://api.web3forms.com/submit" method="POST">
      <input type="hidden" name="access_key" value="${WEB3FORMS_KEY}">
      <input type="hidden" name="subject" value="Nuovo messaggio dal sito ${DOMAIN}">
      <input type="hidden" name="from_name" value="Sito NG Servizi Arredo">
      <input type="hidden" name="redirect" value="${SITE}/grazie.html">
      <input type="checkbox" name="botcheck" class="cform__hp" tabindex="-1" autocomplete="off" aria-hidden="true">

      <p class="cform__row">
        <label for="f-nome">Nome e cognome <span aria-hidden="true">*</span></label>
        <input id="f-nome" type="text" name="nome" required autocomplete="name">
      </p>
      <p class="cform__row">
        <label for="f-email">Email <span aria-hidden="true">*</span></label>
        <input id="f-email" type="email" name="email" required autocomplete="email">
      </p>
      <p class="cform__row">
        <label for="f-tel">Telefono</label>
        <input id="f-tel" type="tel" name="telefono" autocomplete="tel">
      </p>
      <p class="cform__row">
        <label for="f-serv">Servizio</label>
        <select id="f-serv" name="servizio">
          <option value="">Seleziona un&rsquo;opzione</option>
          <option>Rilievo misure e verifica del progetto</option>
          <option>Consulenza d'interni e analisi del budget</option>
          <option>Assistenza al montaggio e installazione</option>
          <option>Assemblaggio di piccoli mobili e falegnameria</option>
          <option>Assistenza post-vendita</option>
          <option>Altro</option>
        </select>
      </p>
      <p class="cform__row">
        <label for="f-msg">Messaggio</label>
        <textarea id="f-msg" name="messaggio" rows="5"></textarea>
      </p>
      <p class="cform__consent">
        <label><input type="checkbox" name="consenso" required>
        <span>Ho letto e accetto la <a href="${IUB_PRIVACY}" target="_blank" rel="noopener">Privacy&nbsp;Policy</a> per il trattamento dei dati.&nbsp;<span aria-hidden="true">*</span></span></label>
      </p>
      <button class="btn" type="submit">Invia il messaggio</button>
      <p class="cform__status" role="status" aria-live="polite" hidden></p>
      <p class="cform__note">I dati inseriti servono solo a ricontattarti. Non sono usati per marketing e non vengono ceduti a terzi.</p>
    </form>`;

  const aside = `<div class="cinfo">
      <h2 class="band__title band__title--sm">Dove sono</h2>
      <p>
        <strong>NG Servizi Arredo</strong> di Nuncibello Giuseppe<br>
        30035 Mirano (VE)<br>
        <a href="mailto:${EMAIL}">${EMAIL}</a><br>
        <strong><a href="tel:${TEL_HREF}">${TEL}</a></strong><br>
        P.IVA ${PIVA}
      </p>
      <p><a class="btn btn--sm" href="https://www.google.com/maps/search/?api=1&query=45.49332809448242,12.109376907348633" target="_blank" rel="noopener">Apri in Google Maps</a></p>
      <h2 class="band__title band__title--sm">Orari di reperibilit&agrave;</h2>
      <p>Luned&igrave; &ndash; Sabato: 09:00 &ndash; 19:30<br>Domenica: chiuso</p>
      ${socialRow('social social--dark')}
    </div>`;

  const body = [
    `<section class="page-head"><div class="wrap"><h1>Contatti</h1></div></section>`,
    band(`    <p class="band__lead">Prima consulenza e preventivo gratuiti. Scrivimi qui sotto: rispondo di persona, di solito in giornata.</p>
    <div class="contact-grid">
      ${form}
      ${aside}
    </div>`),
  ].join('\n');

  // piccolo miglioramento progressivo: invio via fetch senza lasciare la pagina
  const enhance = `<script>
(function () {
  var f = document.querySelector('.cform');
  if (!f) return;
  var s = f.querySelector('.cform__status');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = f.querySelector('button[type=submit]');
    btn.disabled = true;
    s.hidden = false; s.textContent = 'Invio in corso…'; s.className = 'cform__status';
    fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.success) {
          f.reset();
          s.textContent = 'Messaggio inviato. Ti ricontatto al più presto.';
          s.className = 'cform__status is-ok';
        } else { throw new Error(d.message || 'errore'); }
      })
      .catch(function () {
        s.textContent = 'Invio non riuscito. Riprova o scrivimi a ${EMAIL}.';
        s.className = 'cform__status is-err';
      })
      .finally(function () { btn.disabled = false; });
  });
})();
</script>`;

  return page({
    title: 'Contatti',
    description: 'Contatta NG Servizi Arredo a Mirano (VE): modulo, email info@ngserviziarredo.it, telefono +39 366 431 8553. Prima consulenza e preventivo gratuiti.',
    canonical: SLUG.contatti,
    active: SLUG.contatti,
    body: body + '\n' + enhance,
  });
}

function buildGrazie() {
  return page({
    title: 'Messaggio inviato',
    description: 'Grazie per il messaggio: NG Servizi Arredo ti ricontatta al più presto.',
    canonical: 'grazie.html',
    body: band(`    ${eyebrow('Fatto')}
    <h1 class="band__title">Messaggio inviato</h1>
    <p class="band__lead">Grazie. Ti ricontatto al pi&ugrave; presto, di solito in giornata.</p>
    <p>${btn('Torna alla home', 'index.html')}</p>`, { pad: 'lg' }),
  });
}

function build404() {
  return page({
    title: 'Pagina non trovata',
    description: 'La pagina cercata non esiste.',
    canonical: '404.html',
    body: band(`    <h1 class="band__title">Pagina non trovata</h1>
    <p class="band__lead">L&rsquo;indirizzo non &egrave; corretto o la pagina &egrave; stata spostata.</p>
    <p>${btn('Torna alla home', 'index.html')} ${btn('Vai ai contatti', 'contatti.html')}</p>`, { pad: 'lg' }),
  });
}

/* ==========================================================================
   CSS
   ========================================================================== */
const CSS = `/* NG Servizi Arredo — foglio di stile unico. Generato da build.mjs. */
:root{
  --red:#890000; --red-ink:#6b0000;
  --gold:#cdac81; --gold-ink:#a97d40;
  --tint:#f4ede0; --line:#e6dccb;
  --surface:#ffffff; --bg:#ffffff;
  --ink:#2b2320; --muted:#6b5a52;
  --wrap:1160px; --radius:14px;
  --serif:"Cardo",Georgia,"Times New Roman",serif;
  --sans:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
@font-face{font-family:"Cardo";src:url(fonts/cardo-400.woff2) format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"Cardo";src:url(fonts/cardo-700.woff2) format("woff2");font-weight:700;font-style:normal;font-display:swap}

*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);
  font-size:1.02rem;line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:clip}
img{max-width:100%;height:auto;display:block}
a{color:var(--red)}
h1,h2,h3{font-family:var(--serif);font-weight:700;line-height:1.15;text-wrap:balance;margin:0 0 .5em}
p{margin:0 0 1rem}
hr.rule{border:0;border-top:1px solid var(--line);margin:2.5rem 0}

.wrap{max-width:var(--wrap);margin-inline:auto;padding-inline:clamp(1.1rem,4vw,2rem)}
#content{overflow-clip-margin:1rem}

/* ---------- bottoni ---------- */
.btn{display:inline-block;background:var(--gold);color:var(--red);text-decoration:none;
  font-weight:700;letter-spacing:.01em;padding:.82em 1.6em;border-radius:6px;border:1px solid #00000010;
  transition:filter .15s ease,transform .15s ease}
.btn:hover{filter:brightness(1.05)}
.btn:active{transform:translateY(1px)}
.btn--sm{padding:.55em 1.1em;font-size:.92rem}
.btn--block{display:block;text-align:center}
.btn:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,
.navbtn:focus-visible{outline:3px solid var(--red);outline-offset:2px}

/* ---------- header ---------- */
#top{position:absolute;top:0}
.site-header{position:sticky;top:0;z-index:50;background:var(--red);color:#fff}
.site-header__in{display:flex;align-items:center;justify-content:space-between;gap:1rem;
  min-height:60px;padding-block:.5rem}
.brand{color:#fff;text-decoration:none;font-weight:700;letter-spacing:.06em;font-size:1.02rem}
.mainnav>ul{list-style:none;margin:0;padding:0;display:flex;gap:1.4rem}
.mainnav a{color:#fff;text-decoration:none;font-size:.95rem;padding:.3rem 0;display:inline-block}
.mainnav a:hover,.mainnav a[aria-current=page]{text-decoration:underline;text-underline-offset:4px}
.has-sub{position:relative}
.submenu{list-style:none;margin:0;padding:.4rem 0;display:block;position:absolute;right:-.5rem;left:auto;top:100%;
  min-width:250px;background:var(--red);border-radius:0 0 8px 8px;
  box-shadow:0 12px 24px #0003;opacity:0;visibility:hidden;transform:translateY(4px);
  transition:opacity .12s ease,transform .12s ease}
.submenu li{white-space:nowrap}
.has-sub:hover .submenu,.has-sub:focus-within .submenu{opacity:1;visibility:visible;transform:none}
.submenu a{display:block;padding:.5rem 1.1rem}
.navbtn{display:none}

/* ---------- hero ---------- */
.hero{background:var(--red);color:#fff}
.hero__in{text-align:center;padding-block:clamp(2.6rem,6vw,4.4rem)}
.hero__logo{width:min(240px,62vw);margin:0 auto 1.4rem}
.hero__tag{max-width:40ch;margin:0 auto 1.7rem;color:#f3e7d9}

/* ---------- bande ---------- */
.band{padding-block:clamp(2.6rem,5.5vw,4.4rem)}
.band--tint{background:var(--tint)}
.band--red{background:var(--red);color:#fff}
.band--sm{padding-block:clamp(1.8rem,4vw,2.8rem)}
.band--lg{padding-block:clamp(3rem,7vw,5rem);text-align:center}
.band--red a{color:#fff}
.eyebrow{text-transform:uppercase;letter-spacing:.18em;font-weight:700;font-size:.76rem;
  color:var(--gold-ink);margin:0 0 .6rem}
.band--red .eyebrow{color:var(--gold)}
.band__title{font-size:clamp(1.6rem,3.4vw,2.3rem);margin:0 0 1rem}
.band__title--sm{font-size:clamp(1.3rem,2.6vw,1.6rem)}
.band__title--center{text-align:center}
.band--red .band__title{color:#fff}
.band__lead{font-size:1.12rem;max-width:60ch;color:var(--muted)}
.band--red .band__lead{color:#f3e7d9}
.band--lg .band__lead{margin-inline:auto}
.band__cta{margin-top:1.6rem;text-align:center}

/* ---------- griglie di card ---------- */
.grid{display:grid;gap:1.4rem;margin-top:1.8rem}
.grid--2{grid-template-columns:repeat(2,1fr)}
.grid--3{grid-template-columns:repeat(3,1fr)}
.grid--top{align-items:stretch}
@media (max-width:900px){.grid--3{grid-template-columns:repeat(2,1fr)}}
@media (max-width:620px){.grid--2,.grid--3{grid-template-columns:1fr}}

.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);
  padding:1.7rem;display:flex;flex-direction:column;gap:.7rem;height:100%}
.card p{margin:0;color:var(--muted);font-size:.96rem}
.card__media{display:block;border-radius:10px;overflow:hidden;margin-bottom:.3rem}
.card__media img,.mini__media img{width:100%;aspect-ratio:16/10;object-fit:cover}
.card__title,.mini__title{font-size:1.16rem;margin:0}
.card__cta{margin-top:auto;color:var(--red);font-weight:700;text-decoration:none;font-size:.95rem}
.card__cta:hover{text-decoration:underline}
.mini__media{border-radius:10px;overflow:hidden}
.mini__meta{display:flex;align-items:baseline;gap:.6rem;flex-wrap:wrap;margin:.2rem 0 0}
.mini__kicker{text-transform:uppercase;letter-spacing:.14em;font-size:.68rem;font-weight:700;color:var(--gold-ink)}
.price{color:var(--red);font-weight:700}
.price s{color:var(--muted);font-weight:400;margin-right:.15em}

/* ---------- split (immagine + testo) ---------- */
.split{display:grid;grid-template-columns:1fr 1fr;gap:clamp(1.6rem,4vw,3rem);align-items:center}
.split--reverse .split__media{order:2}
.split--intro{grid-template-columns:1fr 1fr}
.split__media img{border-radius:12px;width:100%}
.split--intro .split__media img{aspect-ratio:4/3;object-fit:cover;max-height:440px}
.avatar{border-radius:50%;width:200px;aspect-ratio:1;object-fit:cover;margin:0 auto}
.split__text .band__title{margin-top:.2rem}
@media (max-width:780px){
  .split,.split--intro{grid-template-columns:1fr}
  .split--reverse .split__media{order:0}
}

/* tabellina tariffa km */
.ratecard{width:100%;border-collapse:collapse;background:var(--surface);
  border:1px solid var(--line);border-radius:var(--radius);overflow:hidden}
.ratecard th,.ratecard td{padding:.8rem 1rem;text-align:left;border-top:1px solid var(--line);font-size:.95rem}
.ratecard tr:first-child th,.ratecard tr:first-child td{border-top:0}
.ratecard th{font-weight:400;color:var(--muted)}
.ratecard td{text-align:right;font-weight:700;color:var(--red)}

/* ---------- testata pagina ---------- */
.page-head{background:var(--red);color:#fff;text-align:center;
  padding-block:clamp(2.4rem,5vw,3.6rem)}
.page-head h1{color:#fff;margin:0;font-size:clamp(1.8rem,4vw,2.6rem)}

/* ---------- pager ---------- */
.pager{border-top:1px solid var(--line);background:var(--surface)}
.pager__in{display:flex;justify-content:space-between;gap:1rem;padding-block:1.6rem;flex-wrap:wrap}
.pager a{text-decoration:none;color:var(--ink);display:block}
.pager a:hover b{text-decoration:underline}
.pager span{display:block;font-size:.78rem;text-transform:uppercase;letter-spacing:.12em;color:var(--muted)}
.pager b{color:var(--red)}
.pager__next{text-align:right}

/* ---------- contatti ---------- */
.contact-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:clamp(1.8rem,5vw,4rem);
  align-items:start;margin-top:1.6rem}
@media (max-width:820px){.contact-grid{grid-template-columns:1fr}}
.cform__row{display:flex;flex-direction:column;gap:.35rem;margin:0 0 1rem}
.cform label{font-weight:600;font-size:.92rem}
.cform input:not([type=checkbox]),.cform select,.cform textarea{font:inherit;padding:.7rem .8rem;
  border:1px solid #cbb9a8;border-radius:8px;background:#fff;width:100%}
.cform textarea{resize:vertical}
.cform__consent{font-size:.9rem;color:var(--muted);margin:.4rem 0 1.2rem}
.cform__consent label{display:grid;grid-template-columns:auto 1fr;gap:.55rem;align-items:start;font-weight:400}
.cform__consent input{width:auto;margin:.2rem 0 0}
.cform__hp{position:absolute!important;left:-9999px;width:1px;height:1px;overflow:hidden}
.cform__status{margin:1rem 0 0;padding:.8rem 1rem;border-radius:8px;font-size:.95rem;display:none}
.cform__status:not([hidden]){display:block}
.cform__status.is-ok{background:#eef6ec;color:#1f5130;border:1px solid #bcd9bf}
.cform__status.is-err{background:#fbeceb;color:#7c1d17;border:1px solid #e7bdb9}
.cform__note{font-size:.82rem;color:var(--muted);margin-top:1rem}
.cinfo{background:var(--tint);border:1px solid var(--line);border-radius:var(--radius);padding:1.6rem}
.cinfo .band__title{margin-top:0}
.cinfo .band__title:not(:first-child){margin-top:1.6rem}

/* ---------- footer ---------- */
.site-footer{background:var(--red);color:#fff;text-align:center;padding-block:2.8rem}
.site-footer a{color:#fff}
.site-footer__top{margin:0 0 1.6rem}
.site-footer__logo{width:min(320px,70vw);margin:0 auto 1rem}
.site-footer__name{font-family:var(--serif);font-size:1.35rem;margin:.2rem 0}
.site-footer__meta{color:var(--gold);line-height:1.9;margin:.4rem 0 1rem}
.site-footer__meta a{color:var(--gold)}
.site-footer__legal{margin-top:1.4rem;font-size:.85rem;display:flex;gap:.6rem;justify-content:center}
.site-footer__legal span{color:#ffffff80}

/* ---------- social ---------- */
.social{display:flex;gap:.7rem;justify-content:center}
.social a{display:inline-flex;width:34px;height:34px;align-items:center;justify-content:center;
  border-radius:50%;background:#ffffff1a}
.social svg{width:18px;height:18px;fill:currentColor}
.social--footer{margin-top:.4rem}
.social--dark a{background:var(--red);color:#fff}

/* ---------- menu mobile ---------- */
@media (max-width:840px){
  .navbtn{display:inline-flex;width:42px;height:42px;align-items:center;justify-content:center;cursor:pointer}
  .navbtn span,.navbtn span::before,.navbtn span::after{content:"";display:block;width:22px;height:2px;
    background:#fff;position:relative;transition:transform .15s ease}
  .navbtn span::before{position:absolute;top:-7px}
  .navbtn span::after{position:absolute;top:7px}
  .mainnav{position:absolute;left:0;right:0;top:100%;background:var(--red);
    max-height:0;overflow:hidden;transition:max-height .2s ease;box-shadow:0 12px 24px #0004}
  .mainnav>ul{flex-direction:column;gap:0;padding:.4rem 0}
  .mainnav>ul>li>a{display:block;padding:.7rem clamp(1.1rem,4vw,2rem)}
  .submenu{position:static;min-width:0;opacity:1;visibility:visible;transform:none;box-shadow:none;
    background:#00000022;border-radius:0;padding:0}
  .submenu a{padding:.55rem clamp(2rem,6vw,3rem)}
  .navtoggle:checked ~ .mainnav{max-height:80vh;overflow:auto}
  .navtoggle:checked ~ .navbtn span{background:transparent}
  .navtoggle:checked ~ .navbtn span::before{transform:translateY(7px) rotate(45deg)}
  .navtoggle:checked ~ .navbtn span::after{transform:translateY(-7px) rotate(-45deg)}
}
`;

/* ==========================================================================
   IMMAGINI
   ========================================================================== */
async function buildImages() {
  if (NOIMG) { console.log('· immagini saltate (--no-img)'); return; }
  let sharp;
  try { sharp = require('sharp'); }
  catch { console.log('! sharp non disponibile: salto le immagini. Vedi README (npm i sharp).'); return; }

  fs.mkdirSync(IMGDIR, { recursive: true });
  for (const [key, cfg] of Object.entries(IMAGES)) {
    const src = path.join(MEDIA, cfg.src);
    if (!fs.existsSync(src)) { console.log('! manca', cfg.src); continue; }
    const out = path.join(IMGDIR, key + '.webp');
    let p = sharp(src).resize({ width: cfg.w, withoutEnlargement: true });
    p = cfg.alpha ? p.webp({ quality: 90, alphaQuality: 100 }) : p.webp({ quality: 80 });
    await p.toFile(out);
  }
  // favicon + apple-touch + og da SVG inline
  const mark = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" rx="96" fill="#890000"/>` +
    `<text x="50%" y="52%" font-family="Georgia,serif" font-size="230" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="central">NG</text></svg>`
  );
  await sharp(mark).resize(32, 32).png().toFile(path.join(ROOT, 'favicon-32.png'));
  await sharp(mark).resize(180, 180).png().toFile(path.join(ROOT, 'apple-touch-icon.png'));
  const og = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#890000"/>` +
    `<text x="50%" y="45%" font-family="Georgia,serif" font-size="96" font-weight="700" fill="#fff" text-anchor="middle">NG SERVIZI ARREDO</text>` +
    `<text x="50%" y="60%" font-family="Georgia,serif" font-size="40" fill="#cdac81" text-anchor="middle">Servizi di arredo &#183; Mirano (VE)</text></svg>`
  );
  await sharp(og).png().toFile(path.join(ROOT, 'assets', 'img', 'og.png'));
  console.log('· immagini + favicon + og generati');
}

/* ==========================================================================
   FILE EXTRA
   ========================================================================== */
function writeExtras() {
  fs.writeFileSync(path.join(ROOT, 'CNAME'), DOMAIN + '\n');
  fs.writeFileSync(path.join(ROOT, '.nojekyll'), '');
  fs.writeFileSync(path.join(ROOT, 'favicon.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="#890000"/><text x="50%" y="52%" font-family="Georgia,serif" font-size="230" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="central">NG</text></svg>\n`);
  fs.writeFileSync(path.join(ROOT, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

  const pages = ['index.html', SLUG.contatti, ...SERVICE_DATA.map(s => s.slug)];
  const today = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    pages.map(u => `  <url><loc>${SITE}/${u === 'index.html' ? '' : u}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
    `\n</urlset>\n`);

  fs.mkdirSync(path.join(ROOT, '.well-known'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, '.well-known', 'assetlinks.json'),
`[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "REPLACE_CON_IL_PACKAGE_ANDROID",
      "sha256_cert_fingerprints": ["REPLACE_CON_LO_SHA256_DEL_CERTIFICATO"]
    }
  }
]
`);
}

/* ==========================================================================
   RUN
   ========================================================================== */
const files = {
  'index.html': buildHome(),
  [SLUG.contatti]: buildContatti(),
  'grazie.html': buildGrazie(),
  '404.html': build404(),
};
for (const s of SERVICE_DATA) files[s.slug] = buildService(s);

fs.mkdirSync(path.join(ROOT, 'assets'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'assets', 'style.css'), CSS);
for (const [name, html] of Object.entries(files)) {
  fs.writeFileSync(path.join(ROOT, name), html, 'utf8');
  console.log('·', name, `(${(html.length / 1024).toFixed(1)} kB)`);
}
writeExtras();
await buildImages();
console.log('\nFatto. Anteprima:  npx serve .   oppure apri index.html');
