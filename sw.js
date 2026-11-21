"use strict";
/* Service worker：讓本站可被「安裝／加到主畫面」成全螢幕 App。
   策略一律 network-first：有網路時永遠拿最新版（更新檔案不會被舊快取卡住），
   離線時才用上次抓到的快取。版本更新時換 CACHE 名稱即可清掉舊快取。 */
const CACHE = "fist-soul-v4";
self.addEventListener("install", (e) => { self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request))
  );
});
