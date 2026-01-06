function showInfo(title, text) {
  document.getElementById("infoTitle").textContent = title;
  document.getElementById("infoText").textContent = text;
  document.getElementById("infoBox").scrollIntoView({ behavior: "smooth", block: "center" });
}
