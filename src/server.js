import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { orchestrate } from "./services/orchestrator.js";
import { store } from "./services/store.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");
const publicDir = join(rootDir, "public");
const port = Number(process.env.PORT || 3000);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body)
  });
  res.end(body);
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const safePath = normalize(decodeURIComponent(requestedPath)).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(publicDir, safePath);

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const data = await readFile(filePath);
    const contentType = mimeTypes[extname(filePath)] || "application/octet-stream";
    res.writeHead(200, { "content-type": contentType });
    res.end(data);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

async function routeApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, { ok: true, service: "bharat-ledger", mode: "agentic-starter" });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/state") {
    sendJson(res, 200, store.snapshot());
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/ai/message") {
    try {
      const body = await readJson(req);
      const result = orchestrate({
        message: String(body.message || ""),
        language: body.language || "hinglish",
        userId: body.userId || "demo-user",
        businessId: body.businessId || "demo-business"
      });
      sendJson(res, 200, result);
    } catch (error) {
      sendJson(res, 400, { error: error.message || "Unable to process request" });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/transactions/confirm") {
    try {
      const body = await readJson(req);
      const transaction = store.confirmDraft(body.draftId);
      sendJson(res, 200, { transaction, state: store.snapshot() });
    } catch (error) {
      sendJson(res, 400, { error: error.message || "Unable to confirm draft" });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/transactions") {
    try {
      const body = await readJson(req);
      const transaction = store.createTransaction(body, {
        userId: body.userId || "demo-user",
        businessId: body.businessId || "demo-business"
      });
      sendJson(res, 200, { transaction, state: store.snapshot() });
    } catch (error) {
      sendJson(res, 400, { error: error.message || "Unable to create transaction" });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/parties") {
    try {
      const body = await readJson(req);
      const party = store.createParty(body, {
        userId: body.userId || "demo-user",
        businessId: body.businessId || "demo-business"
      });
      sendJson(res, 200, { party, state: store.snapshot() });
    } catch (error) {
      sendJson(res, 400, { error: error.message || "Unable to create party" });
    }
    return;
  }

  sendJson(res, 404, { error: "API route not found" });
}

const server = createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/api/")) {
      await routeApi(req, res);
      return;
    }
    await serveStatic(req, res);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Internal server error" });
  }
});

server.listen(port, () => {
  console.log(`Bharat Ledger running at http://localhost:${port}`);
});
