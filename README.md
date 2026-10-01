# EcoPlus — Vercel Ready

EcoPlus is a clean, responsive sustainability intelligence dashboard for colleges, campuses, and organizations.

## Features

- Manual institute setup
- Enter number of blocks
- Enter custom block names
- Editable administrator name
- Dashboard with Eco Score
- Energy, water and waste metrics
- Block performance
- AI sustainability insight UI
- Resource monitoring
- Impact center
- Green Champions leaderboard
- Browser localStorage persistence
- Responsive mobile UI
- Vercel-ready static deployment

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run build
```

Then serve the `dist` directory with any static server.

## Vercel

Import the GitHub repository into Vercel.

Build command:

```text
npm run build
```

Output directory:

```text
dist
```

No API key is required for this prototype.

## Important prototype note

The resource figures and AI recommendations are demo/simulated data. They are designed for a hackathon prototype. A production version can connect IoT/sensor feeds, a database, authentication, and an AI API through server-side functions.

## Responsive UI
The dashboard is optimized for desktop, tablet, and mobile screens. On mobile, navigation becomes a bottom navigation bar and forms/cards adapt to narrow widths.

## Reports

EcoPlus includes Daily, Weekly, and Monthly usage report generation based on the manually entered block usage. Reports can be printed or saved as PDF through the browser print dialog.
