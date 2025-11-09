const tbody = document.querySelector("#summaryTable tbody");
tbody.innerHTML = "";

//ローカルから配列呼び出し
//const laps = JSON.parse(localStorage.getItem("lapsData"));
//const lapsArray = Object.values(laps);
const finishTime = [];
const maxSpeed = [];
const avgSpeed = [];
const convertfinishTime = [];

for (let i = 0; lapsArray.length - 1 > i; i++) {
  const alllapTime = lapsArray[i].map((p) => p.lapTime);
  //最後のタイムを保存する
  finishTime[i] = alllapTime[alllapTime.length - 1];
  //スピード計算
  const allspeed = lapsArray[i].map((p) => p.speed);
  maxSpeed[i] = Math.max(...allspeed);
  avgSpeed[i] = (allspeed.reduce((a, b) => a + b, 0) / allspeed.length).toFixed(
    2
  );
  convertfinishTime[i] = convertLapTimeToMs(finishTime[i]);
}
const minValue = Math.min(...convertfinishTime);
const minIndex = convertfinishTime.indexOf(minValue);

for (let i = 0; lapsArray.length - 1 > i; i++) {
  // ---- 行を作成 ----
  const tr = document.createElement("tr");
  tr.innerHTML = `
      <td style="color: ${colors[i % colors.length]}">${i + 1}${
    i === minIndex ? " 🥇" : ""
  }</td>
      <td>${finishTime[i]}</td>
      <td>${maxSpeed[i]} km/h</td>
      <td>${avgSpeed[i]} km/h</td>
    `;

  tbody.appendChild(tr);
}

// --------- lapTime → ms 変換関数 --------------
// "00:12.34" → 12340ms
function convertLapTimeToMs(lapTime) {
  const [mm, ss] = lapTime.split(":");
  const [s, ms] = ss.split(".");

  return (
    parseInt(mm) * 60 * 1000 + parseInt(s) * 1000 + parseInt(ms.padEnd(3, "0"))
  );
}
