# monishvnsn.dev

Plain static personal site (no build step), styled like the Bear Blog default theme.

- `index.html` home (bio, projects, links), `blog/`, `notes/`, `404.html`, `style.css`
- `CNAME` = monishvnsn.dev

## Deploy on GitHub Pages
1. Push these files to the root of a repo (e.g. `monishvnsn.github.io`).
2. Settings > Pages > Deploy from branch `main` / root. Custom domain: monishvnsn.dev, enable HTTPS.
3. At Name.com DNS: A records for `@` -> 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153; CNAME `www` -> monishvnsn.github.io.

Add LinkedIn: see the TODO comment in `index.html`. Add a blog post: new `blog/<slug>/index.html` and an `<li><span><time>2026-01-01</time></span><a href="/blog/slug/">Title</a></li>` in `blog/index.html`.
