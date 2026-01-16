Place your logo image file here and name it `logo.png`.

Recommended path: `frontend/public/logo.png` (this folder is served by Vite as the public root).

How to use the logo in the app:
- Small site logo in the navbar (recommended):

  <img src="/logo.png" alt="ArchaiMap" className="w-10 h-10 object-contain" />

- Full header/logo usage (if you later want it on pages other than the homepage):

  <img src="/logo.png" alt="ArchaiMap" className="w-28 h-28 object-contain" />

Image format & sizing recommendations:
- Use a square PNG (transparent) or an optimized SVG for best scaling.
- Provide a 256x256 PNG for good retina results.

Note: Per your request I did not add the logo to the homepage. Place the file here and reference it from the `Navbar` or `Footer` if you want it visible across the site.
