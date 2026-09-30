# EsAn Yogalayam — Website

Official website for **EsAn Yogalayam**, a yoga institution founded in 2018 by Master U. Ayyampillai, M.Sc Yoga.

Static site — plain HTML, CSS and JavaScript. No build step, no dependencies.

## Structure

```
index.html         — single-page site (story, training, schedule, achievements, service, IDY, vision, contact)
css/styles.css     — design system + all section styles
js/main.js         — sticky header, mobile nav, scroll reveal, stat counters, enquiry form
assets/            — logo (original JPEG, transparent PNG mark + full lock-up, favicons)
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Deploy

Hosted on GitHub Pages from the `main` branch (root). Any push to `main` redeploys.

## Contact details

Phone, email and address live in the Contact section of `index.html`. The enquiry form has no backend; it opens WhatsApp to `CONTACT_PHONE` in `js/main.js` (digits only, with country code). Update both places if the number changes.
