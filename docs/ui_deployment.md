# UI Deployment

## Cloudflare Pages path
- keep `NEXT_PUBLIC_APP_MODE=demo` for public portfolio hosting
- run `npm install` and `npm run build` inside `frontend/`
- deploy the generated Next.js app with compatible Pages support or a static-friendly adapter later
- rely on `public/demo` assets so no backend dependency is required

## VPS path
- set `NEXT_PUBLIC_APP_MODE=demo` or `api`
- run:
  - `cd frontend`
  - `npm install`
  - `npm run build`
  - `npm run start`
- point a reverse proxy at the Next.js server

## Environment variables
- `NEXT_PUBLIC_APP_MODE=demo`
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`

## Static asset strategy
- use `frontend/public/demo` for images, JSON examples, and point cloud samples
- keep route rendering functional even with no backend
- later API mode can replace those assets with generated run outputs
