# Aveshost / cPanel deployment

This application is a Next.js production server started from `server.js`, which is compatible with:

- Aveshost cPanel **Setup Node.js App**
- CloudLinux / Phusion Passenger
- LiteSpeed reverse proxy
- PostgreSQL (recommended) via `DATABASE_URL`

MySQL is **not** a drop-in replacement. The CMS uses PostgreSQL through Drizzle ORM.

## 1. Create the Node.js application

In cPanel → **Setup Node.js App**:

| Field | Value |
| --- | --- |
| Node.js version | 20 LTS (18+ supported) |
| Application mode | Production |
| Application root | directory that contains `package.json` and `server.js` |
| Application URL | your domain or subdomain |
| Application startup file | `server.js` |

If the selector defaults to `app.js`, that file is provided and simply loads `server.js`.

## 2. Environment variables

Add these in the Node.js App **Environment Variables** panel (do not rely on a gitignored `.env.local` file on the server):

```
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME
DATABASE_SSL=false
DATABASE_POOL_MAX=5
ADMIN_USERNAME=Grandiose_Real_Estate
ADMIN_PASSWORD=your-secure-password
AUTH_SECRET=a-long-random-string
```

Set `DATABASE_SSL=true` if the PostgreSQL host requires SSL.

## 3. Install and build

From the application root (or via the Node.js App “Run NPM Install / Run JS script” buttons):

```bash
npm install
npm run build
```

Then **Restart** the Node.js application.

`npm start` runs `node server.js`, which Passenger also uses as the entry point.

## 4. Database

1. Create a PostgreSQL database and user in cPanel (or point `DATABASE_URL` at a managed Postgres instance).
2. Apply the schema:

```bash
npx drizzle-kit push
```

3. Optional seed (team, sample listings, site settings):

```bash
npx tsx src/db/seed.ts
```

`tsx` is not a production dependency. If it is unavailable on the host, skip seeding and create content through `/admin`.

## 5. File uploads

Admin image uploads are stored under `public/uploads/`. Ensure that directory is writable by the application user:

```bash
mkdir -p public/uploads
chmod 755 public/uploads
```

## 6. Admin login

- URL: `https://your-domain/admin/login`
- Username: value of `ADMIN_USERNAME` (default `Grandiose_Real_Estate`)
- Password: value of `ADMIN_PASSWORD`

## 7. Troubleshooting

| Symptom | Check |
| --- | --- |
| Application will not start | Startup file is `server.js`; Node 18+; `npm run build` completed |
| 503 / passenger error | Open the Node.js App error log; confirm `PORT` is not hard-overridden |
| Database errors | `DATABASE_URL` is set; user can connect; `DATABASE_SSL=true` if required |
| Login always fails | `ADMIN_PASSWORD` is set in the Node.js App environment, then restart |
| Uploads fail | `public/uploads` exists and is writable |
