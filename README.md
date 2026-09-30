# EsAn Yogalayam — Website

Official website for **EsAn Yogalayam**, a yoga institution founded in 2018 by Master U. Ayyampillai.

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

## Before going live — update these placeholders

The description did not include contact details. Replace them in two places:

1. `index.html` — every element marked `data-placeholder` in the Contact section (phone, email, address).
2. `js/main.js` — `CONTACT_PHONE` (digits only, with country code) so the enquiry form opens WhatsApp to the right number.

Photos of classes, the founder and International Yoga Day programmes would strengthen the Story, Achievements and IDY sections; the layout is ready to take images.
