document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("chart").getContext("2d");
  const points = JSON.parse(localStorage.getItem("pointsData"));

  const colors = ["red", "blue", "green"];
  let datasets = [];
  let timeLabels = [];

  // 初めの表示（速度：speed）
  Object.keys(laps)
    .slice(0, -1)
    .forEach((lapNum, i) => {
      const lapPoints = laps[lapNum];
      const data = lapPoints.map((p) => p.speed);
      const labels = lapPoints.map((p) => p.lapTime.slice(0, -3));

      // 最初のlapのラベルを x 軸に使う
      if (i === 0) timeLabels = labels;

      datasets.push({
        label: `Lap ${lapNum} 速度 (km/h)`,
        data: data,
        borderColor: colors[i % colors.length],
        borderWidth: 2,
        tension: 0.7,
        pointRadius: 0,
      });
    });

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      //それぞれのラップごとのデータをdatasetsに{}で追加する
      labels: timeLabels,
      datasets: datasets,
    },
    options: {
      scales: {
        x: { title: { display: true, text: "時間 (分:秒)" } },
        y: { beginAtZero: true },
      },
      plugins: {
        zoom: {
          pan: { enabled: true, mode: "x" },
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: "x",
          },
        },
      },
    },
  });

  // dataSwitch クリックで speed/altitude/GPS 切替
  document.getElementById("dataSwitch").addEventListener("click", (e) => {
    e.preventDefault();
    document
      .querySelectorAll("#dataSwitch a")
      .forEach((a) => a.classList.remove("active"));
    e.target.classList.add("active");

    const type = e.target.dataset.type;
    datasets = [];

    Object.keys(laps)
      .slice(0, -1)
      .forEach((lapNum, i) => {
        const lapPoints = laps[lapNum];
        let data = [];
        let labelText = "";

        if (type === "speed") {
          data = lapPoints.map((p) => p.speed);
          labelText = "速度 (km/h)";
        } else if (type === "altitude") {
          data = lapPoints.map((p) => p.ele);
          labelText = "標高 (m)";
        } else if (type === "gps") {
          data = lapPoints.map((p) => p.hdop);
          labelText = "GPS強度";
        }

        datasets.push({
          label: `Lap ${lapNum} ${labelText}`,
          data: data,
          borderColor: colors[i % colors.length],
          borderWidth: 2,
          tension: 0.7,
          pointRadius: 0,
        });

        if (i === 0) timeLabels = lapPoints.map((p) => p.lapTime.slice(0, -3));
      });

    chart.data.labels = timeLabels;
    chart.data.datasets = datasets;
    chart.update();
  });
});
