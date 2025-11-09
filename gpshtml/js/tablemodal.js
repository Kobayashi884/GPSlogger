const frontForkData = [
  // フロントフォーク
  {
    name: "残ストローク",
    placeholder: "mm",
    type: "number",
    image: "sample_sag.jpg",
    detail: "Sag: 110mm<br>Rebound: 10クリック<br>フォークオイル: 10W, 120ml",
  },
  {
    name: "突き出し量",
    placeholder: "mm",
    type: "number",
    image: "sample_rake.jpg",
    detail: "突き出し量: 25mm<br>備考: フロントセッティング例",
  },
  {
    name: "圧側／伸側減衰",
    placeholder: "クリック",
    type: "number",
    image: "sample_fork_damping.jpg",
    detail: "圧側: 10クリック<br>伸側: 12クリック<br>備考: 推奨値",
  },
  {
    name: "フォークオイルの粘度・量",
    placeholder: "例: 10W, 120ml",
    type: "text",
    image: "sample_fork_oil.jpg",
    detail: "フォークオイル: 10W, 120ml<br>交換時期: 5000kmごと",
  },
];

const rearShockData = [
  // リアショック
  {
    name: "スプリングレート",
    placeholder: "N/mm",
    type: "number",
    image: "sample_spring.jpg",
    detail: "スプリングレート: 120N/mm<br>備考: リアセッティング例",
  },
  {
    name: "プリロード",
    placeholder: "mm",
    type: "number",
    image: "sample_preload.jpg",
    detail: "プリロード: 25mm<br>備考: サスペンション硬さ調整",
  },
  {
    name: "圧側／伸側減衰",
    placeholder: "クリック",
    type: "number",
    image: "sample_rear_damping.jpg",
    detail: "圧側: 12クリック<br>伸側: 14クリック<br>備考: リアセッティング例",
  },
  {
    name: "リンク比率",
    placeholder: "例: 2.5:1",
    type: "text",
    image: "sample_link_ratio.jpg",
    detail: "リンク比率: 2.5:1<br>備考: リアリンク構造",
  },
];

const gearData = [
  {
    name: "フロントスプロケット",
    placeholder: "例: 14丁",
    type: "text",
    image: "sample_link_ratio.jpg",
    detail: "サンプル",
  },
  {
    name: "リアスプロケット",
    placeholder: "例: 32丁",
    type: "text",
    image: "sample_link_ratio.jpg",
    detail: "サンプルリア",
  },
];

function createTableRows(dataArray, tableId) {
  const tbody = document.querySelector(`#${tableId} tbody`);

  dataArray.forEach((item, index) => {
    const tr = document.createElement("tr");

    // 項目＋詳細ボタン
    const tdName = document.createElement("td");
    tdName.innerHTML = `
      <div class="d-flex align-items-center">
        <span>${item.name}</span>
        <button class="btn btn-outline-secondary btn-sm ms-2" data-bs-toggle="modal" data-bs-target="#detailModal" data-index="${index}" data-table="${tableId}">
          <i class="bi bi-card-text"></i>
        </button>
      </div>
    `;
    tr.appendChild(tdName);

    // 値
    const tdValue = document.createElement("td");
    tdValue.innerHTML = `<input type="${item.type}" class="form-control" placeholder="${item.placeholder}" />`;
    tr.appendChild(tdValue);

    tbody.appendChild(tr);
  });
}

// テーブル作成
createTableRows(frontForkData, "frontForkTable");
createTableRows(rearShockData, "rearShockTable");
createTableRows(gearData, "gearTable");

// モーダル表示時に内容を差し替え
const detailModal = document.getElementById("detailModal");
detailModal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;
  const tableId = button.getAttribute("data-table");
  const index = button.getAttribute("data-index");

  let item;
  if (tableId === "frontForkTable") item = frontForkData[index];
  if (tableId === "rearShockTable") item = rearShockData[index];
  if (tableId === "gearTable") item = gearData[index];

  document.getElementById("modalTitle").textContent = item.name;
  document.getElementById("modalBody").innerHTML = `
    <div class="card">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${item.image}" class="img-fluid rounded" alt="${item.name}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            ${item.detail}
          </div>
        </div>
      </div>
    </div>
  `;
});
