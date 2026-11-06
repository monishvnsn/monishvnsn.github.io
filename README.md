# monishvnsn.dev

Plain static personal site (no build step).

- `index.html` home, `on-x/`, `blog/`, `notes/` (pointer to On X), `404.html`, `style.css`, `main.js`
- `CNAME` = monishvnsn.dev

## Deploy on GitHub Pages
1. Push these files to the root of the repo.
2. Settings > Pages > Deploy from branch `main` / root. Custom domain: monishvnsn.dev, enable HTTPS.
3. At Name.com DNS: A records for `@` -> 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153; CNAME `www` -> monishvnsn.github.io.

Free Cal.com booking stays disconnected until a verified event path is set on `#cal-embed` (`data-cal-link`). Do not invent that path. Email remains an ordinary contact link, not a booking button.
