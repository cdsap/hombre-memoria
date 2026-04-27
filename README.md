# Hombre Memoria

> An archive of oral memories from the *Campo de Calatrava*, recorded and compiled by Carlos Villar.

This is a small static website that hosts the testimonies that my father, **Carlos Villar**, gathered throughout his life of work documenting the oral culture of his beloved Campo de Calatrava (Ciudad Real, Spain). After his passing, I built this site to preserve and quietly share that work.

## A personal note

This repository is a **personal project, in memory of my father**, and is intentionally unrelated to my usual professional work on Gradle, Android, and Kotlin tooling. If you've found this from one of my technical projects: this is a different kind of thing entirely. The code here is small, plain, and slow-changing — it is a digital edition of a cultural archive, not a software product. There will be no roadmap, no plugin, and probably no PRs to review.

## About Carlos Villar's work

For decades, Carlos travelled the villages of the Campo de Calatrava recording interviews with the people he called *hombres memoria* — keepers of memory. He was interested in the way oral tradition has, for centuries, carried knowledge from one generation to the next, and in what we lose when that chain is broken.

The articles collected in this site are extracts of those recordings, transcribed and curated. They cover everyday life, festivities, agricultural rituals, sayings, songs, anecdotes, and the lived geography of villages such as Cózar, Castellar, Carrizosa, Navajas, and many more.

If anyone — researcher, institution, or family of those interviewed — would like access to the original recordings, please reach out to the contact email listed on the site.

## How the site works

The site is fully static. It is built with plain HTML, CSS and JavaScript, no build step, no framework. Articles live in a single `db.csv` file that is fetched and parsed in the browser with [PapaParse](https://www.papaparse.com/).

Adding or editing an article means editing the CSV and committing.

### Files

| File | Purpose |
| --- | --- |
| `index.html` | Main page: random article, search, tag cloud |
| `articulos.html` + `articulos.js` | Full alphabetical list of articles |
| `informacion.html` | About the project |
| `aviso-legal.html`, `privacidad.html`, `cookies.html` | EU legal pages |
| `styles.css` | Editorial design system shared across all pages |
| `script.js` | Loads `db.csv`, renders articles, search, tag cloud |
| `db.csv` | The archive itself |
| `pictures/` | Photographs from the original recordings |

## Running locally

The site needs to be served over HTTP (browsers block `fetch` from `file://`). Any static server works; the simplest is Python:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Deploying

The site is hosted on GitHub Pages. Any push to `main` redeploys it within about a minute.

## Acknowledgements and license

The content of the archive — testimonies, transcriptions, and photographs — belongs to Carlos Villar, the people he interviewed, and their families. It is published here for cultural and educational purposes only, with no commercial intent. Please do not redistribute the contents without permission.

The code itself (HTML/CSS/JS in this repository) is provided as-is for anyone who wants to learn from it or build something similar in tribute to a relative of their own.

— *In memory of Carlos Villar.*
