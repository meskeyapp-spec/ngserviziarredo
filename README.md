# Sito NG Servizi Arredo — versione statica per GitHub Pages

Sito statico (HTML + CSS + immagini WebP). Nessun database, nessun tracciamento,
nessun cookie di terze parti → **niente cookie banner**, bastano privacy e cookie policy.

- **Contenuti**: 1 home + 5 pagine servizio + contatti + grazie + 404
- **Peso totale**: ~1,8 MB (immagini comprese)
- **Font**: Cardo (self-hosted, per i titoli) + font di sistema per il testo
- **Modulo contatti**: Web3Forms (gratuito, nessun cookie sul visitatore)

---

## 1. Prima della pubblicazione — 3 cose da fare

### a) Access key di Web3Forms (per il modulo contatti)
1. Vai su <https://web3forms.com>, inserisci **info@ngserviziarredo.it**, ricevi la *access key*.
2. In `build.mjs` sostituisci `INSERISCI_LA_TUA_ACCESS_KEY_WEB3FORMS` con la chiave.
3. Ricostruisci (`node build.mjs --no-img`) e ricommitta.

Finché la chiave non è inserita il modulo mostra un errore all'invio; il resto del sito funziona.

### b) Aggiornare Iubenda
La cookie policy Iubenda (id 76628430) va aggiornata: questo sito **non** usa
strumenti di terze parti, ma cita ancora `www.ngserviziarredo.it` — verifica che
privacy e cookie policy siano coerenti con il sito statico (solo cookie tecnici,
modulo gestito da Web3Forms, nessuna analitica).

### c) (facoltativo, per Google Play) `/.well-known/assetlinks.json`
Il file è già presente come segnaposto. Quando servirà per la verifica delle
App Links, sostituisci `package_name` e `sha256_cert_fingerprints` con i valori
reali dell'app Android.

---

## 2. Pubblicazione su GitHub Pages

1. Crea un repository su GitHub, es. `ngserviziarredo/sito` (può essere privato o pubblico).
2. Dentro **questa cartella** (`www/`):
   ```
   git init
   git add .
   git commit -m "Sito statico NG Servizi Arredo"
   git branch -M main
   git remote add origin https://github.com/<utente>/<repo>.git
   git push -u origin main
   ```
   > `../media`, `../wxr-*.xml` ecc. NON fanno parte del repo: resta tutto fuori da `www/`.
3. Su GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   ramo **main**, cartella **/ (root)**. Salva.
4. Dopo 1–2 minuti il sito è online su `https://<utente>.github.io/<repo>/`.

Il file `CNAME` contiene già `ngserviziarredo.it`, quindi GitHub proverà subito a
usare il dominio: completa il passo 3 (DNS) e poi in **Settings → Pages** spunta
**Enforce HTTPS**.

---

## 3. Collegare il dominio ngserviziarredo.it

Nel pannello DNS del dominio (dal registrar dove lo paghi):

| Tipo  | Nome / Host | Valore |
|-------|-------------|--------|
| A     | `@`         | `185.199.108.153` |
| A     | `@`         | `185.199.109.153` |
| A     | `@`         | `185.199.110.153` |
| A     | `@`         | `185.199.111.153` |
| CNAME | `www`       | `<utente>.github.io.` |

(Sono gli IP ufficiali di GitHub Pages.) La propagazione richiede da pochi minuti
a qualche ora. Poi su GitHub → Settings → Pages: verifica il dominio e attiva
**Enforce HTTPS** (il certificato è gratuito e automatico).

---

## 4. Modificare i contenuti

Tutto il testo e i dati stanno in **`build.mjs`** (oggetti `SERVICE_DATA`,
funzioni `buildHome` / `buildContatti`, costanti in alto per email/telefono/social).

```
node build.mjs --no-img     # rigenera solo l'HTML + CSS (veloce)
node build.mjs              # rigenera anche le immagini WebP (richiede 'sharp')
```

Poi `git add -A && git commit && git push` per pubblicare.

### 'sharp' per le immagini
`node build.mjs` senza `--no-img` ottimizza le immagini da `../media/`. Serve il
pacchetto `sharp`:
```
npm i sharp          # dentro www/
```
oppure, se è già installato altrove:
```
NODE_PATH="C:/percorso/di/node_modules" node build.mjs
```
Se `sharp` non c'è, il build salta le immagini e usa quelle già presenti in `assets/img/`.

---

## 5. Anteprima locale

```
npx serve .
```
oppure apri direttamente `index.html` nel browser (le immagini si vedono comunque).

---

## Struttura

```
www/
├─ build.mjs                 generatore (unica fonte dei contenuti)
├─ index.html … *.html       pagine generate — NON modificare a mano
├─ assets/
│  ├─ style.css              generato da build.mjs
│  ├─ fonts/cardo-*.woff2    font self-hosted
│  └─ img/*.webp             immagini ottimizzate + og.png
├─ CNAME  .nojekyll  robots.txt  sitemap.xml  favicon.svg  favicon-32.png  apple-touch-icon.png
└─ .well-known/assetlinks.json   segnaposto per Google Play
```
