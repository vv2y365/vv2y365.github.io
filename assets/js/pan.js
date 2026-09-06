(() => {
  const root = document.querySelector("[data-api-base]");
  if (!root) return;

  const apiBase = root.dataset.apiBase.replace(/\/$/, "");
  const gate = root.querySelector('[data-view="gate"]');
  const desk = root.querySelector('[data-view="desk"]');
  const loginForm = root.querySelector("[data-login-form]");
  const loginStatus = root.querySelector("[data-login-status]");
  const list = root.querySelector("[data-file-list]");
  const notice = root.querySelector("[data-notice]");
  const progress = root.querySelector("[data-progress]");
  const progressBar = progress.querySelector("span");
  const breadcrumbs = root.querySelector("[data-breadcrumbs]");
  const player = root.querySelector("[data-player]");
  const playerVideo = root.querySelector("[data-player-video]");
  const playerTitle = root.querySelector("[data-player-title]");
  const playerError = root.querySelector("[data-player-error]");
  const state = { folder: "all", trail: [], items: [], account: null };

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  const formatSize = (value) => {
    const bytes = Number(value);
    if (!Number.isFinite(bytes) || bytes <= 0) return "-";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
  };
  const formatDate = (value) => value ? new Date(value).toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }) : "-";
  const setNotice = (message = "", error = false) => { notice.textContent = message; notice.style.color = error ? "#b33d2c" : ""; };
  const json = async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.error) throw new Error(data.error || data.msg || `请求失败 (${response.status})`);
    return data;
  };
  const request = async (path, options = {}) => json(await fetch(`${apiBase}${path}`, { credentials: "same-origin", ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) } }));
  const post = (path, body) => request(path, { method: "POST", body: JSON.stringify(body) });

  function showDesk() { gate.hidden = true; desk.hidden = false; }
  function showGate(message = "") { desk.hidden = true; gate.hidden = false; loginStatus.textContent = message; }

  function renderBreadcrumbs() {
    breadcrumbs.innerHTML = "";
    const parts = [{ id: "all", name: "根目录" }, ...state.trail];
    parts.forEach((part, index) => {
      const button = document.createElement("button");
      button.type = "button"; button.textContent = part.name;
      button.addEventListener("click", () => openFolder(part.id, index === 0 ? [] : state.trail.slice(0, index)));
      breadcrumbs.append(button);
      if (index < parts.length - 1) { const separator = document.createElement("span"); separator.className = "pan-breadcrumb-separator"; separator.textContent = "/"; breadcrumbs.append(separator); }
    });
  }

  function unwrapItems(data) {
    return data?.data?.data?.map((entry) => entry.data).filter(Boolean) || [];
  }

  function renderFiles(items) {
    state.items = items;
    list.innerHTML = "";
    if (!items.length) { list.innerHTML = '<div class="pan-empty">这里还没有文件</div>'; return; }
    items.forEach((item) => {
      const attrs = item.attributes || {};
      const isFolder = item.type === "folder";
      const row = document.createElement("div"); row.className = "pan-file-row";
      const name = escapeHtml(attrs.basename || attrs.name || "未命名");
      const extension = isFolder ? "DIR" : ((attrs.mimetype || attrs.name || "FILE").split("/").pop().split(".").pop() || "FILE").slice(0, 5).toUpperCase();
      row.innerHTML = `<div class="pan-file-name"><span class="pan-file-icon">${isFolder ? "DIR" : escapeHtml(extension)}</span><button class="pan-file-name-button" type="button" title="${name}">${name}</button></div><span>${isFolder ? "文件夹" : escapeHtml(attrs.mimetype || "文件")}</span><span>${isFolder ? `${attrs.items || 0} 项` : formatSize(attrs.filesize)}</span><span>${formatDate(attrs.updated_at || attrs.created_at)}</span><div class="pan-row-actions"><button type="button" data-action="rename">重命名</button><button type="button" data-action="delete">删除</button></div>`;
      const nameButton = row.querySelector(".pan-file-name-button");
      nameButton.addEventListener("click", () => isFolder ? openFolder(item.id, [...state.trail, { id: item.id, name: attrs.name || attrs.basename }]) : openFile(item));
      row.querySelector('[data-action="rename"]').addEventListener("click", () => renameItem(item, attrs, isFolder));
      row.querySelector('[data-action="delete"]').addEventListener("click", () => deleteItem(item, attrs, isFolder));
      list.append(row);
    });
  }

  async function loadAccount() {
    const data = await request("/me");
    const attrs = data.data?.attributes || {};
    state.account = attrs;
    root.querySelector("[data-account]").textContent = attrs.nick || attrs.email || "已连接";
  }

  async function openFolder(id, trail = state.trail) {
    setNotice("正在读取文件列表...");
    try {
      const data = await request(`/files?item_id=${encodeURIComponent(id)}&sort=created_at&direction=DESC&page=1`);
      state.folder = id; state.trail = trail; renderBreadcrumbs(); renderFiles(unwrapItems(data)); setNotice("");
    } catch (error) { setNotice(error.message, true); if (/登录|session|unauthorized/i.test(error.message)) showGate("登录已过期，请重新输入密码"); }
  }

  async function openFile(item) {
    const attrs = item.attributes || {}; const name = attrs.basename || attrs.name || "文件";
    setNotice(`正在准备 ${name}...`);
    try {
      const data = await request(`/download/${encodeURIComponent(item.id)}`);
      const url = data.data?.downInfo?.url;
      if (!url) throw new Error("没有获得下载地址");
      if (/\.(mp4|webm|ogg|mov|m4v|avi|mkv)$/i.test(name) || (attrs.mimetype || "").startsWith("video/")) {
        playerTitle.textContent = name; playerError.textContent = ""; playerVideo.src = url; player.hidden = false; playerVideo.play().catch(() => {});
      } else { window.open(url, "_blank", "noopener"); }
      setNotice("");
    } catch (error) { setNotice(error.message, true); }
  }

  async function renameItem(item, attrs, isFolder) {
    const oldName = attrs.basename || attrs.name || ""; const name = window.prompt("输入新名称", oldName.replace(/\.[^.]+$/, ""));
    if (!name || name === oldName) return;
    try { await post("/rename", { id: item.id, type: isFolder ? "folder" : "file", name, emoji: null, _method: "patch" }); await openFolder(state.folder, state.trail); }
    catch (error) { setNotice(error.message, true); }
  }

  async function deleteItem(item, attrs, isFolder) {
    const name = attrs.basename || attrs.name || "这个项目";
    if (!window.confirm(`确定删除“${name}”吗？此操作不可恢复。`)) return;
    try { await post("/delete", { items: [{ force_delete: false, type: isFolder ? "folder" : "file", id: item.id }] }); await openFolder(state.folder, state.trail); }
    catch (error) { setNotice(error.message, true); }
  }

  async function uploadFile(file) {
    setNotice(`准备上传 ${file.name}...`); progress.hidden = false; progressBar.style.width = "0%";
    try {
      const md5hash = await md5File(file);
      const tokenData = await post("/upload-token", { name: file.name, path: state.folder === "all" ? "" : undefined, folder_id: state.folder === "all" ? undefined : state.folder });
      const uploadtoken = tokenData.data?.uploadtoken; if (!uploadtoken) throw new Error("没有获得上传授权");
      const plan = await post("/upload-plan", { uploadtoken, file_name: file.name, file_size: file.size, file_type: file.type, md5hash });
      const upload = plan.data;
      if (!upload || !upload.UploadURLs) { await openFolder(state.folder, state.trail); return; }
      const etags = [];
      for (let index = 0; index < upload.UploadURLs.length; index += 1) {
        const start = index * upload.ChunkSize; const chunk = file.slice(start, Math.min(start + upload.ChunkSize, file.size));
        const response = await fetch(upload.UploadURLs[index], { method: "PUT", headers: { token: uploadtoken }, body: chunk });
        if (!response.ok) throw new Error(`第 ${index + 1} 个分片上传失败`);
        etags.push({ num: index + 1, ETag: response.headers.get("ETag") || response.headers.get("etag") || "" });
        progressBar.style.width = `${Math.round(((index + 1) / upload.UploadURLs.length) * 90)}%`;
      }
      await post("/upload-complete", { uploadtoken, partList: etags, complete_url: upload.CompleteURL });
      progressBar.style.width = "100%"; setNotice(`${file.name} 上传完成`); await openFolder(state.folder, state.trail);
    } catch (error) { setNotice(error.message, true); } finally { window.setTimeout(() => { progress.hidden = true; }, 800); }
  }

  async function searchFiles(query) {
    if (!query.trim()) return openFolder(state.folder, state.trail);
    setNotice("正在搜索...");
    try { const data = await request(`/search?query=${encodeURIComponent(query.trim())}&filter=`); renderFiles(data.data?.lists?.map((entry) => entry.data).filter(Boolean) || []); setNotice(""); }
    catch (error) { setNotice(error.message, true); }
  }

  async function md5File(file) {
    const buffer = await file.slice(0, Math.min(file.size, 209715200)).arrayBuffer();
    const bytes = new Uint8Array(buffer); const bitLength = bytes.length * 8;
    const words = new Int32Array(Math.ceil((bytes.length + 9) / 64) * 16);
    for (let i = 0; i < bytes.length; i += 1) words[i >> 2] |= bytes[i] << ((i % 4) * 8);
    words[bytes.length >> 2] |= 0x80 << ((bytes.length % 4) * 8);
    words[words.length - 2] = bitLength | 0; words[words.length - 1] = Math.floor(bitLength / 4294967296);
    let a = 0x67452301; let b = 0xefcdab89; let c = 0x98badcfe; let d = 0x10325476;
    const left = (x, amount) => (x << amount) | (x >>> (32 - amount)); const add = (x, y) => (x + y) | 0;
    const ff = (x, y, z) => (x & y) | (~x & z); const gg = (x, y, z) => (x & z) | (y & ~z); const hh = (x, y, z) => x ^ y ^ z; const ii = (x, y, z) => y ^ (x | ~z);
    const round = (fn, aa, bb, cc, dd, x, s, t) => add(left(add(add(aa, fn(bb, cc, dd)), add(x, t)), s), bb);
    for (let offset = 0; offset < words.length; offset += 16) { let aa = a; let bb = b; let cc = c; let dd = d;
      aa = round(ff, aa, bb, cc, dd, words[offset], 7, -680876936); dd = round(ff, dd, aa, bb, cc, words[offset + 1], 12, -389564586); cc = round(ff, cc, dd, aa, bb, words[offset + 2], 17, 606105819); bb = round(ff, bb, cc, dd, aa, words[offset + 3], 22, -1044525330);
      aa = round(ff, aa, bb, cc, dd, words[offset + 4], 7, -176418897); dd = round(ff, dd, aa, bb, cc, words[offset + 5], 12, 1200080426); cc = round(ff, cc, dd, aa, bb, words[offset + 6], 17, -1473231341); bb = round(ff, bb, cc, dd, aa, words[offset + 7], 22, -45705983);
      aa = round(ff, aa, bb, cc, dd, words[offset + 8], 7, 1770035416); dd = round(ff, dd, aa, bb, cc, words[offset + 9], 12, -1958414417); cc = round(ff, cc, dd, aa, bb, words[offset + 10], 17, -42063); bb = round(ff, bb, cc, dd, aa, words[offset + 11], 22, -1990404162);
      aa = round(ff, aa, bb, cc, dd, words[offset + 12], 7, 1804603682); dd = round(ff, dd, aa, bb, cc, words[offset + 13], 12, -40341101); cc = round(ff, cc, dd, aa, bb, words[offset + 14], 17, -1502002290); bb = round(ff, bb, cc, dd, aa, words[offset + 15], 22, 1236535329);
      aa = round(gg, aa, bb, cc, dd, words[offset + 1], 5, -165796510); dd = round(gg, dd, aa, bb, cc, words[offset + 6], 9, -1069501632); cc = round(gg, cc, dd, aa, bb, words[offset + 11], 14, 643717713); bb = round(gg, bb, cc, dd, aa, words[offset], 20, -373897302);
      aa = round(gg, aa, bb, cc, dd, words[offset + 5], 5, -701558691); dd = round(gg, dd, aa, bb, cc, words[offset + 10], 9, 38016083); cc = round(gg, cc, dd, aa, bb, words[offset + 15], 14, -660478335); bb = round(gg, bb, cc, dd, aa, words[offset + 4], 20, -405537848);
      aa = round(gg, aa, bb, cc, dd, words[offset + 9], 5, 568446438); dd = round(gg, dd, aa, bb, cc, words[offset + 14], 9, -1019803690); cc = round(gg, cc, dd, aa, bb, words[offset + 3], 14, -187363961); bb = round(gg, bb, cc, dd, aa, words[offset + 8], 20, 1163531501);
      aa = round(gg, aa, bb, cc, dd, words[offset + 13], 5, -1444681467); dd = round(gg, dd, aa, bb, cc, words[offset + 2], 9, -51403784); cc = round(gg, cc, dd, aa, bb, words[offset + 7], 14, 1735328473); bb = round(gg, bb, cc, dd, aa, words[offset + 12], 20, -1926607734);
      aa = round(hh, aa, bb, cc, dd, words[offset + 5], 4, -378558); dd = round(hh, dd, aa, bb, cc, words[offset + 8], 11, -2022574463); cc = round(hh, cc, dd, aa, bb, words[offset + 11], 16, 1839030562); bb = round(hh, bb, cc, dd, aa, words[offset + 14], 23, -35309556);
      aa = round(hh, aa, bb, cc, dd, words[offset + 1], 4, -1530992060); dd = round(hh, dd, aa, bb, cc, words[offset + 4], 11, 1272893353); cc = round(hh, cc, dd, aa, bb, words[offset + 7], 16, -155497632); bb = round(hh, bb, cc, dd, aa, words[offset + 10], 23, -1094730640);
      aa = round(hh, aa, bb, cc, dd, words[offset + 13], 4, 681279174); dd = round(hh, dd, aa, bb, cc, words[offset], 11, -358537222); cc = round(hh, cc, dd, aa, bb, words[offset + 3], 16, -722521979); bb = round(hh, bb, cc, dd, aa, words[offset + 6], 23, 76029189);
      aa = round(hh, aa, bb, cc, dd, words[offset + 9], 4, -640364487); dd = round(hh, dd, aa, bb, cc, words[offset + 12], 11, -421815835); cc = round(hh, cc, dd, aa, bb, words[offset + 15], 16, 530742520); bb = round(hh, bb, cc, dd, aa, words[offset + 2], 23, -995338651);
      aa = round(ii, aa, bb, cc, dd, words[offset], 6, -198630844); dd = round(ii, dd, aa, bb, cc, words[offset + 7], 10, 1126891415); cc = round(ii, cc, dd, aa, bb, words[offset + 14], 15, -1416354905); bb = round(ii, bb, cc, dd, aa, words[offset + 5], 21, -57434055);
      aa = round(ii, aa, bb, cc, dd, words[offset + 12], 6, 1700485571); dd = round(ii, dd, aa, bb, cc, words[offset + 3], 10, -1894986606); cc = round(ii, cc, dd, aa, bb, words[offset + 10], 15, -1051523); bb = round(ii, bb, cc, dd, aa, words[offset + 1], 21, -2054922799);
      aa = round(ii, aa, bb, cc, dd, words[offset + 8], 6, 1873313359); dd = round(ii, dd, aa, bb, cc, words[offset + 15], 10, -30611744); cc = round(ii, cc, dd, aa, bb, words[offset + 6], 15, -1560198380); bb = round(ii, bb, cc, dd, aa, words[offset + 13], 21, 1309151649);
      aa = round(ii, aa, bb, cc, dd, words[offset + 4], 6, -145523070); dd = round(ii, dd, aa, bb, cc, words[offset + 11], 10, -1120210379); cc = round(ii, cc, dd, aa, bb, words[offset + 2], 15, 718787259); bb = round(ii, bb, cc, dd, aa, words[offset + 9], 21, -343485551);
      a = add(a, aa); b = add(b, bb); c = add(c, cc); d = add(d, dd);
    }
    return [a, b, c, d].map((word) => Array.from({ length: 4 }, (_, i) => ((word >> (i * 8)) & 255).toString(16).padStart(2, "0")).join("")).join("");
  }

  root.querySelector("[data-toggle-password]").addEventListener("click", (event) => { const input = root.querySelector("#pan-password"); input.type = input.type === "password" ? "text" : "password"; event.currentTarget.textContent = input.type === "password" ? "显示" : "隐藏"; });
  loginForm.addEventListener("submit", async (event) => { event.preventDefault(); loginStatus.textContent = "验证中..."; try { await post("/login", { password: new FormData(loginForm).get("password") }); showDesk(); await Promise.all([loadAccount(), openFolder("all", [])]); } catch (error) { loginStatus.textContent = error.message; } });
  root.querySelector("[data-logout]").addEventListener("click", async () => { await post("/logout", {}); showGate("已退出"); });
  root.querySelector("[data-refresh]").addEventListener("click", () => openFolder(state.folder, state.trail));
  root.querySelector("[data-new-folder]").addEventListener("click", async () => { const name = window.prompt("输入文件夹名称"); if (!name) return; try { await post("/folder", { name, ...(state.folder === "all" ? {} : { parent_id: state.folder }) }); await openFolder(state.folder, state.trail); } catch (error) { setNotice(error.message, true); } });
  root.querySelector("[data-upload]").addEventListener("change", async (event) => { for (const file of event.target.files) await uploadFile(file); event.target.value = ""; });
  root.querySelector("[data-search-form]").addEventListener("submit", (event) => { event.preventDefault(); searchFiles(root.querySelector("[data-search-input]").value); });
  root.querySelectorAll("[data-close-player]").forEach((element) => element.addEventListener("click", () => { playerVideo.pause(); playerVideo.removeAttribute("src"); playerVideo.load(); player.hidden = true; }));

  request("/session").then(() => { showDesk(); return Promise.all([loadAccount(), openFolder("all", [])]); }).catch(() => showGate());
})();
