const UPSTREAM = "https://www.vyuyun.com";
const SESSION_DAYS = 90;
const TOKEN_REFRESH_MARGIN = 60 * 60 * 24;
let tokenCache = { value: "", expiresAt: 0 };
const loginAttempts = new Map();

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/pan/api/")) return new Response("Not found", { status: 404 });

    try {
      const action = url.pathname.slice("/pan/api/".length);
      const actionName = action.split("/")[0];
      if (actionName === "login" && request.method === "POST") return login(request, env);
      if (actionName === "logout" && request.method === "POST") return logout();
      if (actionName === "session" && request.method === "GET") return session(request, env);
      if (!await hasValidSession(request, env)) return json({ error: "请先登录" }, 401);

      switch (actionName) {
        case "me": return upstream(request, env, "/apiv1/user/getuserinfo", "GET");
        case "files": {
          const query = new URLSearchParams(url.search);
          const itemId = query.get("item_id") || "all";
          query.delete("item_id");
          return upstream(request, env, `/apiv1/browse/folders/${encodeURIComponent(itemId)}?${query}`, "GET");
        }
        case "search": return upstream(request, env, `/apiv1/browse/search${url.search}`, "GET");
        case "folder": return upstream(request, env, "/apiv1/browse/create-folder", "POST");
        case "delete": return upstream(request, env, "/apiv1/browse/remove", "POST");
        case "rename": return upstream(request, env, "/apiv1/browse/rename", "POST");
        case "download": return upstream(request, env, `/apiv1/browse/getDownUrl/${encodeURIComponent(actionValue(url))}${url.search}`, "GET");
        case "upload-token": return upstream(request, env, "/apiv1/browse/getuploadtoken", "POST");
        case "upload-plan": return upstream(request, env, "/file/token", "POST");
        case "upload-complete": return completeUpload(request, env);
        default: return json({ error: "未知的 Pan API 操作" }, 404);
      }
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "服务暂时不可用" }, 502);
    }
  }
};

function actionValue(url) {
  const value = url.pathname.slice("/pan/api/download/".length);
  if (!value || value.includes("/")) throw new Error("缺少文件 id");
  return value;
}

async function login(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || { count: 0, resetAt: now + 10 * 60 * 1000 };
  if (attempts.resetAt <= now) { attempts.count = 0; attempts.resetAt = now + 10 * 60 * 1000; }
  if (attempts.count >= 10) return json({ error: "尝试次数过多，请 10 分钟后再试" }, 429);
  const body = await request.json().catch(() => ({}));
  if (!env.PAN_PASSWORD || !await constantTimeEqual(String(body.password || ""), String(env.PAN_PASSWORD))) {
    attempts.count += 1; loginAttempts.set(ip, attempts);
    return json({ error: "密码不正确" }, 403);
  }
  loginAttempts.delete(ip);
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400;
  const payload = `${expiresAt}.${crypto.randomUUID()}`;
  const signature = await sign(payload, env.SESSION_SECRET);
  return json({ ok: true }, 200, {
    "Set-Cookie": `pan_session=${base64url(payload)}.${signature}; Path=/pan; Max-Age=${SESSION_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`
  });
}

function logout() {
  return json({ ok: true }, 200, { "Set-Cookie": "pan_session=; Path=/pan; Max-Age=0; HttpOnly; Secure; SameSite=Lax" });
}

async function session(request, env) {
  return (await hasValidSession(request, env)) ? json({ ok: true }) : json({ error: "未登录" }, 401);
}

async function hasValidSession(request, env) {
  try {
    if (!env.SESSION_SECRET) return false;
    const cookie = request.headers.get("Cookie") || "";
    const match = cookie.match(/(?:^|;\s*)pan_session=([^;]+)/);
    if (!match) return false;
    const parts = match[1].split(".");
    if (parts.length !== 3) return false;
    const payload = fromBase64url(parts[0]);
    const expiresAt = Number(payload.split(".")[0]);
    return expiresAt > Math.floor(Date.now() / 1000) && await constantTimeEqual(parts[2], await sign(payload, env.SESSION_SECRET));
  } catch {
    return false;
  }
}

async function upstream(request, env, path, method) {
  const token = await getToken(env);
  const headers = new Headers({ token });
  let body;
  if (method === "POST") {
    body = await request.json().catch(() => ({}));
    delete body.complete_url;
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`${UPSTREAM}${path}`, { method, headers, body: method === "POST" ? JSON.stringify(body) : undefined });
  const responseBody = await response.arrayBuffer();
  return new Response(responseBody, { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") || "application/json", "Cache-Control": "no-store" } });
}

async function completeUpload(request, env) {
  const body = await request.json().catch(() => ({}));
  if (!body.complete_url) return json({ error: "缺少上传完成地址" }, 400);
  const target = new URL(body.complete_url, "https://up.bilnn.top");
  if (target.protocol !== "https:" || target.hostname !== "up.bilnn.top") return json({ error: "上传完成地址不受信任" }, 400);
  delete body.complete_url;
  const response = await fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json", token: await getToken(env) },
    body: JSON.stringify(body)
  });
  return new Response(await response.arrayBuffer(), {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") || "application/json", "Cache-Control": "no-store" }
  });
}

async function getToken(env) {
  const now = Math.floor(Date.now() / 1000);
  if (tokenCache.value && tokenCache.expiresAt - TOKEN_REFRESH_MARGIN > now) return tokenCache.value;
  if (!env.VYUYUN_APPID || !env.VYUYUN_APPSECRET) throw new Error("Worker 尚未配置微雨云凭据");
  const response = await fetch(`${UPSTREAM}/apiv1/api/gettoken`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ appid: env.VYUYUN_APPID, appsecret: env.VYUYUN_APPSECRET }) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.code !== 0 || !result.data?.token) throw new Error(result.msg || "无法获取微雨云 token");
  tokenCache = { value: result.data.token, expiresAt: now + Number(result.data.expires_in || 604800) };
  return tokenCache.value;
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret || ""), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return bytesToBase64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))));
}

async function constantTimeEqual(left, right) {
  const a = new TextEncoder().encode(left); const b = new TextEncoder().encode(right);
  let result = a.length ^ b.length;
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) result |= (a[index % (a.length || 1)] || 0) ^ (b[index % (b.length || 1)] || 0);
  return result === 0;
}

function base64url(value) { return bytesToBase64url(new TextEncoder().encode(value)); }
function bytesToBase64url(bytes) { return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
function fromBase64url(value) { return atob(value.replace(/-/g, "+").replace(/_/g, "/")); }
function json(body, status = 200, headers = {}) { return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers } }); }
