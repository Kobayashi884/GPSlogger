fetch("/list")
  .then((res) => res.json())
  .then((data) => {
    const list = document.getElementById("list");
    list.innerHTML = "";

    if (!data.length) {
      list.innerHTML = "No files found.";
      return;
    }

    data.forEach((path) => {
      const div = document.createElement("div");
      div.className = "item";

      div.textContent = path;

      div.onclick = () => {
        window.location = "/download?file=" + encodeURIComponent(path);
      };

      list.appendChild(div);
    });
  })
  .catch((error) => {
    document.getElementById("list").innerHTML =
      "ERROR loading list…<br>" + error;
  });
