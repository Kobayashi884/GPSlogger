document.getElementById("gpxlog").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const text = await file.text();
  localStorage.setItem("gpxData", text);
  localStorage.setItem("gpxFileName", file.name);
  console.log(file.name);

  // gpxParser.js を使ってパース
  const gpx = new gpxParser();
  gpx.parse(text);

  // パース後のpointsを取得
  const points = gpx.tracks[0].points;

  // 読み取れない追加情報(speed, lap, lapTime, hdop)をXMLから抽出
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "text/xml");
  const trkpts = xml.querySelectorAll("trkpt");

  for (let i = 0; i < trkpts.length; i++) {
    const trkpt = trkpts[i];
    const speed = trkpt.querySelector("speed")?.textContent || null;
    const lap = trkpt.querySelector("extensions > lap")?.textContent || null;
    const lapTime =
      trkpt.querySelector("extensions > lapTime")?.textContent || null;
    const hdop = trkpt.querySelector("extensions > hdop")?.textContent || null;

    if (points[i]) {
      //数の値を決めて配列に代入する
      points[i].speed = speed ? parseFloat(speed) : null;
      points[i].lap = lap ? parseInt(lap) : null;
      points[i].lapTime = lapTime || null;
      points[i].hdop = hdop ? parseFloat(hdop) : null;
      //console.log(Object.keys(points[i]));
    }
  }
  // Chart.js用に保存（配列をJSONに変換）
  localStorage.setItem("pointsData", JSON.stringify(points));
  const laps = {};
  // lapごとに分ける
  for (let i = 0; i < points.length; i++) {
    const lap = points[i].lap;
    if (!laps[lap]) laps[lap] = [];
    laps[lap].push(points[i]);
  }
  localStorage.setItem("lapsData", JSON.stringify(laps));
  window.location.reload();
});
