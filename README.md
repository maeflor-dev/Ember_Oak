# Ember & Oak

A responsive, single-page landing page for a fictional specialty coffee shop in Brooklyn. This is a static HTML, CSS, and JavaScript portfolio project; it does not require a build step or package installation.

## Run locally

From the project directory, start a local web server:

```powershell
py -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser. You can also open `index.html` directly, but a local server more closely matches how the site is served online.

## Features

- Responsive navigation with a mobile menu
- Hero, story, best sellers, menu, reviews, gallery, FAQ, contact, and footer sections
- Interactive menu tabs, review carousel, FAQ accordion, and gallery lightbox
- Scroll reveal effects and reduced-motion support
- Accessible labels, keyboard interactions, and image descriptions

## Project structure

```text
.
├── index.html
├── public/
│   ├── script.js
│   └── style.css
├── galleryimages/
├── images/
├── imagesperson/
└── icon/
```

The page loads styles and JavaScript from `public/`; image and icon assets are stored in the folders beside `index.html`.

## External resources

Google Fonts and Lucide icons are loaded from third-party CDNs and require an internet connection. If they cannot be reached, the page uses its CSS font fallbacks; the icons may not appear.

## Contact form

The contact form is a front-end demonstration only. It displays a temporary success state but does not send or store messages. Connect it to a backend or form service before using it for real inquiries.
