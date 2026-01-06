//GeoJSONLayerにする
function addGeoJSONLayer(map, data) {
  var geoJSONLayer = L.geoJSON(data, {
    pointToLayer: function (feature, latLng) {
      return L.circleMarker(latLng, {
        radius: 5,
        color: "red",
        fillColor: "red",
        fillOpacity: 1,
      });
    },
  });

  var geoJSONTDLayer = L.timeDimension.layer.geoJson(geoJSONLayer, {
    updateTimeDimension: true,
    duration: "PT2M",
    updateTimeDimensionMode: "replace",
    addlastPoint: true,
  });

  // Show both layers: the geoJSON layer to show the whole track
  // and the timedimension layer to show the movement of the bus
  geoJSONLayer.addTo(map);
  geoJSONTDLayer.addTo(map);
}

// Leafletマップ初期化
// const map = L.map("map").setView([36.2048, 138.2529], 6); // 東京周辺
const map = L.map("map", {
  center: [36.2, 138.2], // 適当な中心
  zoom: 6,
  timeDimension: true,
  timeDimensionControl: true,
  timeDimensionControlOptions: {
    autoPlay: false,
    loop: true,
    timeSliderDragUpdate: true,
    playerOptions: {
      transitionTime: 100, // 小さいほど滑らか
      loop: true,
    },
  },
});

//ローカルストレージから配列呼び出し
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

const colors = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow",
  "cyan",
  "magenta",
  "brown",
  "pink",
];

//ラップ選択用配列
const lapPolylines = {};

function showlap(lapIndex) {
  const polyline = L.polyline(laps[lapIndex], {
    color: colors[(lapIndex - 1) % colors.length],
    weight: 3,
    opacity: 0.8,
  }).addTo(map);

  // 軌跡全体が見えるようにズーム調整
  map.fitBounds(polyline.getBounds());

  //削除用にpolylineのデータを保存する
  lapPolylines[lapIndex] = polyline;
}

//初めのみ描写
showlap(1);

//削除用の関数
function delelap(lapIndex) {
  map.removeLayer(lapPolylines[lapIndex]);
  delete lapPolylines[lapIndex];
}
// // Polylineで線を描画 ここのpolylineのlaps[]を変えると軌跡も変わる
// for (let i = 0; lapsArray.length - 1 > i; i++) {
//   const polyline = L.polyline(laps[i + 1], {
//     color: colors[i % colors.length],
//     weight: 3,
//     opacity: 0.8,
//   }).addTo(map);
//   // 軌跡全体が見えるようにズーム調整
//   map.fitBounds(polyline.getBounds());
// }

// --- TimeDimension用GeoJSONに変換 ---
function convertToTimeGeoJSON(lapsArray, baseDate = "2025-01-01T00:00:00Z") {
  const base = new Date(baseDate);
  const lapGeoJSON = {};

  // ------ 秒数が記号を使っているのでmsに変換して代入する ------
  lapsArray.forEach((lapPoints, lapIndex) => {
    const features = [];
    lapPoints.forEach((p) => {
      // lapTime "MM:SS.ms" → 秒に変換
      const [min, sec] = p.lapTime.split(":");
      const totalMs = parseInt(min) * 60000 + parseFloat(sec) * 1000;
      const time = new Date(base.getTime() + totalMs).toISOString();

      features.push({
        type: "Feature",
        properties: {
          times: [time], // TimeDimension用は配列
          lap: p.lap,
          speed: p.speed,
          ele: p.ele,
          hdop: p.hdop,
        },
        geometry: {
          type: "Point",
          coordinates: [p.lon, p.lat],
        },
      });
    });
    lapGeoJSON[`lap${lapIndex + 1}`] = {
      type: "FeatureCollection",
      features,
    };
  });

  return lapGeoJSON;
}

const geojson = convertToTimeGeoJSON(lapsArray);

//ラップごとのTimeDimensionLayerを保存
// let count = [1];

// function showLapscount(x) {
//   count.push(x);
//   console.log(count);
//   for (let i = 0; i < count.length; i++) {
//     showLapsAnimation(count[i]);
//   }
// }

// //グラフ用配列削除
// function showLapscountdel(x) {
//   // x と一致する要素を削除
//   count = count.filter((num) => num !== x);
// }

function showLapsAnimation(lapIndex) {
  // table の tr が選択されているか確認
  const tr = document.querySelector(
    `#summaryTable tbody tr:nth-child(${lapIndex})`
  );

  const geoLayer = L.geoJSON(geojson[`lap${lapIndex}`], {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 2,
        color: "yellow",
        weight: 1,
        fillOpacity: 1,
      });
    },
  });

  const tdLayer = L.timeDimension.layer.geoJson(geoLayer, {
    updateTimeDimension: true,
    duration: "PT0S",
    updateTimeDimensionMode: "replace",
    addlastPoint: false,
  });

  tdLayer.addTo(map);
}

// }

// // --- GeoJSONレイヤー ---
// //geojsonのlapを変えることでラップのアニメーションするのを変えれる
// const geoLayer = L.geoJSON(geojson.lap2, {
//   pointToLayer: function (feature, latlng) {
//     return L.circleMarker(latlng, {
//       radius: 2,
//       color: "yellow",
//       weight: 1,
//       fillOpacity: 1,
//     });
//   },
// });

// // --- TimeDimensionレイヤー（アニメーション） ---
// const tdLayer = L.timeDimension.layer.geoJson(geoLayer, {
//   updateTimeDimension: true,
//   duration: "PT0S",
//   updateTimeDimensionMode: "replace",
//   addlastPoint: false,
// });

let timeLabels = []; // DOMContentLoaded の外、グローバルに宣言

document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("chart").getContext("2d");
  // 初期化コード
  // timeLabels に値をセット
  Object.keys(laps)
    .slice(0, -1)
    .forEach((lapNum, i) => {
      const lapPoints = laps[lapNum];
      if (i === 0) timeLabels = lapPoints.map((p) => p.lapTime.slice(0, -3));
    });
});

// --- 地図にアニメーション用点を追加 ---
// tdLayer.addTo(map);
showLapsAnimation(1);
