var CACHE_NAME = "datalogger-v1";
//キャッシュして保存させる項目
var FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/js/db.js",
  "/manifest.json",
];

//インストール時の必要なファイルをキャッシュする
self.addEventListener("install", function (event) {
  console.log("install datalogger");

  event.waitUntil(
    caches.open("datalogger-v1").then(function (cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

//フェッチの処理（キャッシュにファイルやモノがあるかを確認してなかったらネットワークから取得）
self.addEventListener("fetch", function (event) {
  console.log("fetch called");

  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response ? response : fetch(event.request);
    })
  );
});
