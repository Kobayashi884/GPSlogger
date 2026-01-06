document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("chart").getContext("2d");

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

  // 表示用ラベルと Date 用ラベルを別で保持
  let displayLabels = [];
  let timeLabelsDate = [];
  let datasets = [];

  const baseDate = new Date("2025-01-01T00:00:00Z"); // TimeDimension 基準日時

  // 縦線プラグイン
  const verticalLinePlugin = {
    id: "verticalLine",
    afterDraw: (chart) => {
      const xScale = chart.scales.x;
      const ctx = chart.ctx;
      const index = chart.options.plugins.verticalLine?.lineIndex ?? 0;

      if (!xScale) return;
      const x = xScale.getPixelForValue(index);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, chart.chartArea.top);
      ctx.lineTo(x, chart.chartArea.bottom);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.stroke();
      ctx.restore();
    },
  };

  // 初期データ作成（speed 表示）
  Object.keys(laps)
    .slice(0, -1)
    .forEach((lapNum, i) => {
      const lapPoints = laps[lapNum];

      // X軸表示用ラベル
      if (i === 0) {
        displayLabels = lapPoints.map((p) => p.lapTime.slice(0, -3)); // MM:SS 表示
        timeLabelsDate = lapPoints.map((p) => {
          const [min, sec] = p.lapTime.split(":");
          return new Date(
            baseDate.getTime() + parseInt(min) * 60000 + parseFloat(sec) * 1000
          );
        });
      }

      // const data = lapPoints.map((p) => p.speed);

      // datasets.push({
      //   label: `Lap ${lapNum}`,
      //   data: data,
      //   borderColor: colors[i % colors.length],
      //   borderWidth: 2,
      //   tension: 0.7,
      //   pointRadius: 0,
      // });
    });

  // Chart 作成
  const chart = new Chart(ctx, {
    type: "line",
    data: { labels: displayLabels, datasets: datasets },
    options: {
      scales: {
        x: { title: { display: true, text: "時間 (分:秒)" } },
        y: { beginAtZero: true },
      },
      plugins: {
        verticalLine: { lineIndex: 0 }, // 初期値
        zoom: {
          pan: { enabled: true, mode: "x" },
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: "x",
          },
        },
      },
      animation: false,
    },
    plugins: [verticalLinePlugin],
  });
  //現在選択されているグラフの種類(初期は「速度」を選択する)
  let type = "speed";

  //ラップのグラフ描画の配列保存
  let lapChartlines = [1];

  //グラフ用配列追加
  function lapChartlinescount(x) {
    lapChartlines.push(x);
    // console.log(lapChartlines);
  }

  //グラフ用配列削除
  function lapChartlinesdel(x) {
    // x と一致する要素を削除
    lapChartlines = lapChartlines.filter((num) => num !== x);
    redrawChart();
  }

  //グラフの再描画用
  function redrawChart() {
    //グラフ削除，繰り返し描画用代入

    datasets = [];

    // lapChartlines に入っている番号だけ描画
    lapChartlines.forEach((lapNum, idx) => {
      // table の tr が選択されているか確認
      const tr = document.querySelector(
        `#summaryTable tbody tr:nth-child(${lapNum})`
      );
      if (!tr || !tr.classList.contains("table-danger")) return;

      datasets.push({
        label: `Lap ${lapNum}`,
        data: laps[lapNum].map((p) => p[type]),
        borderColor: colors[(lapNum - 1) % colors.length],
        borderWidth: 2,
        tension: 0.7,
        pointRadius: 0,
      });
    });

    chart.data.datasets = datasets;
    chart.update();
  }

  //はじめのみラップ１を表示する
  redrawChart(1);

  //htmlで読み取れないためfunctionとして動かしたいのでwindowでグローバル化
  window.redrawChart = redrawChart;
  window.lapChartlinescount = lapChartlinescount;
  window.lapChartlinesdel = lapChartlinesdel;

  // Leaflet TimeDimension と同期
  map.timeDimension.on("timeload", () => {
    const currentTime = map.timeDimension.getCurrentTime();
    console.log(
      "Current TimeDimension time:",
      new Date(currentTime).toISOString()
    );

    const index = timeLabelsDate.findIndex((t) => t.getTime() >= currentTime);
    if (index >= 0) {
      chart.options.plugins.verticalLine.lineIndex = index;
      chart.update("none"); // 赤線のみ更新
    }
  });

  // dataSwitch（speed / ele / hdop）をタッチしたときのイベントリスナー
  document.getElementById("dataSwitch").addEventListener("click", (e) => {
    e.preventDefault();
    //bootstrapで枠をわかりやすく選択にするためactiveを追加する
    document
      .querySelectorAll("#dataSwitch a")
      .forEach((a) => a.classList.remove("active"));
    e.target.classList.add("active");

    type = e.target.dataset.type;
    console.log(type);
    redrawChart();
  });
});
