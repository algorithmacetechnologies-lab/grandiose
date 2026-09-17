/**
 * Aveshost / cPanel / LiteSpeed / Phusion Passenger entry point.
 *
 * In cPanel → Setup Node.js App, set:
 *   Application startup file: server.js
 *   Application mode:        Production
 *   Node.js version:         18+ (20 LTS recommended)
 *
 * Passenger injects `PhusionPassenger` and a `PORT` environment variable.
 * This wrapper never hard-codes a public bind address beyond what the host provides.
 */
try {
  require("dotenv").config();
  require("dotenv").config({ path: ".env.local" });
} catch {
  /* dotenv is optional once the host injects environment variables */
}

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const passenger =
  typeof globalThis !== "undefined" ? globalThis.PhusionPassenger : undefined;
const isPassenger = Boolean(passenger);

if (isPassenger && passenger && typeof passenger.configure === "function") {
  passenger.configure({ autoInstall: false });
}

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || process.env.HOST || "localhost";
const port = Number(process.env.PORT) || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    });

    server.on("error", (err) => {
      console.error("HTTP server error:", err);
      if (!isPassenger) process.exit(1);
    });

    const onListen = (err) => {
      if (err) throw err;
      const displayHost = isPassenger ? "passenger" : `${hostname}:${port}`;
      console.log(`> Grandiose Real Estate ready on http://${displayHost}`);
    };

    if (isPassenger) {
      server.listen("passenger", onListen);
    } else {
      server.listen(port, hostname, onListen);
    }
  })
  .catch((err) => {
    console.error("Failed to prepare Next.js application:", err);
    process.exit(1);
  });
