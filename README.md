# TaskFlow

A project management web app built with plain HTML, CSS and vanilla JavaScript. Data is stored in the browser with LocalStorage. Charts use Chart.js (loaded from a CDN).

## Run locally
Open `index.html` in a browser, or serve the folder: `npx serve .`

## Deploy to Vercel
Import the repository in Vercel. No build step is needed; leave the framework preset as "Other".

## Structure
- `index.html` page shell
- `css/style.css` design system and layout
- `js/storage.js` icons, LocalStorage and demo data
- `js/dashboard.js`, `projects.js`, `tasks.js`, `calendar.js`, `team.js`, `analytics.js` feature modules
- `js/settings.js` settings, messages and notifications
- `js/app.js` helpers, router, event handling (loaded last)

Scripts are classic scripts sharing one global scope, so keep the load order in `index.html`.
