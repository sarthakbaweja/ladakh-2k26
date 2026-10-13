// Shared checklist API. Static page is served from ./public by Workers Static Assets.
// GET  /api/state  -> { checks: { [id]: boolean } }
// POST /api/toggle { id, checked } -> { ok: true }

const ID_RE = /^[a-z]{1,3}\d{1,3}$/;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/state" && request.method === "GET") {
      const { results } = await env.DB.prepare("SELECT id, checked FROM checks").all();
      const checks = {};
      for (const r of results) checks[r.id] = r.checked === 1;
      return json({ checks });
    }

    if (url.pathname === "/api/toggle" && request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "bad json" }, 400);
      }
      const { id, checked } = body || {};
      if (typeof id !== "string" || !ID_RE.test(id) || typeof checked !== "boolean") {
        return json({ error: "bad input" }, 400);
      }
      await env.DB.prepare(
        "INSERT INTO checks (id, checked, updated_at) VALUES (?1, ?2, ?3) " +
          "ON CONFLICT(id) DO UPDATE SET checked = excluded.checked, updated_at = excluded.updated_at"
      )
        .bind(id, checked ? 1 : 0, Date.now())
        .run();
      return json({ ok: true });
    }

    return json({ error: "not found" }, 404);
  },
};
