const upload = (fileInput, image) => {
  const fileInputElem = document.querySelector(fileInput);
  const imageElem = document.querySelector(image);
  const file = fileInputElem.files[0];
  reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (e) {
    imageElem.setAttribute('src', e.target.result);
  }
}