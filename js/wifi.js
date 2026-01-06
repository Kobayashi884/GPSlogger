document.getElementById("loadBtn").onclick = () => {
  const status = document.getElementById("status");
  status.textContent = "Loading...";

  fetch("http://192.168.4.1/list")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#fileTable tbody");
      tbody.innerHTML = "";

      if (!data.length) {
        status.textContent = "No files found.";
        return;
      }

      data.forEach((path, index) => {
        const tr = document.createElement("tr");

        // 番号
        const tdIndex = document.createElement("td");
        tdIndex.textContent = index + 1;
        tr.appendChild(tdIndex);

        // ファイルパス
        const tdPath = document.createElement("td");
        tdPath.textContent = path;
        tr.appendChild(tdPath);

        // ダウンロードボタン
        const tdBtn = document.createElement("td");
        const btn = document.createElement("button");
        btn.className = "btn btn-sm btn-success";
        btn.textContent = "DL";
        btn.onclick = () => {
          window.location.href = `http://192.168.4.1/download?file=${encodeURIComponent(
            path
          )}`;
        };
        tdBtn.appendChild(btn);
        tr.appendChild(tdBtn);

        tbody.appendChild(tr);
      });

      status.textContent = "✔ Loaded";
    })
    .catch((err) => {
      status.innerHTML = "❌ Failed:<br>" + err;
    });
};
