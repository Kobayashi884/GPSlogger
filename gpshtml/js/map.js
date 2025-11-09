// Leafletマップ初期化
const map = L.map("map").setView([36.2048, 138.2529], 6); // 東京周辺
//配列呼び出し
const points = JSON.parse(localStorage.getItem("pointsData"));
const laps = JSON.parse(localStorage.getItem("lapsData"));
const lapsArray = Object.values(laps);
L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png",
  {
    maxZoom: 18,
    attribution: "openstreetmap",
  }
).addTo(map);

const colors = ["red", "blue", "green"];
// Polylineで線を描画
for (let i = 0; lapsArray.length - 1 > i; i++) {
  const polyline = L.polyline(laps[i + 1], {
    color: colors[i % colors.length],
    weight: 3,
    opacity: 0.8,
  }).addTo(map);
  // 軌跡全体が見えるようにズーム調整
  map.fitBounds(polyline.getBounds());
}
