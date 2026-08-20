function previewImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const img = document.getElementById("preview");
  img.src = URL.createObjectURL(file);
  img.style.display = "block";
}