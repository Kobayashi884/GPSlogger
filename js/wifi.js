document.getElementById("loadBtn").onclick = () => {
  document.getElementById("status").textContent = "Loading...";

  fetch("http://192.168.4.1/list")
    .then((res) => res.json())
    .then((data) => {
      const list = document.getElementById("list");
      list.innerHTML = "";

      if (!data.length) {
        list.textContent = "No files found.";
        return;
      }

      data.forEach((path) => {
        const div = document.createElement("div");
        div.className = "item";
        div.textContent = path;
        list.appendChild(div);
      });

      document.getElementById("status").textContent = "✔ loaded";
    })
    .catch((err) => {
      document.getElementById("status").innerHTML = "❌ failed:<br>" + err;
    });
};
