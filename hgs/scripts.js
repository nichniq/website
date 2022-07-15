'use strict';

const sculpture_page = document.getElementById("sculpture");

if (sculpture_page) {
  const thumbnails = sculpture_page.querySelectorAll("nav img");
  const images = [
    ...sculpture_page.querySelectorAll("section video"),
    ...sculpture_page.querySelectorAll("section img"),
  ];

  let selected_index = 0;

  function select_image(index) {
    images[selected_index].style.display = null;
    thumbnails[selected_index].parentElement.style.outline = null;

    images[index].style.display = "revert";
    thumbnails[index].parentElement.style.outline = "1px solid white";

    selected_index = index;
  }

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      select_image(index);
    });
  });

  select_image(0);

  document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft") {
      select_image(
        selected_index === 0 ? images.length - 1 : selected_index - 1
      );
    }

    if (e.code === "ArrowRight") {
      select_image(
        selected_index === images.length - 1 ? 0 : selected_index + 1
      );
    }
  })

  document.querySelector(".full-images").addEventListener("click", e => {
    const { x } = e;
    const section = e.target.closest(".full-images");
    const { left, width } = section.getBoundingClientRect();
    const center = (width - left) / 2;

    if (x <= center) {
      select_image(
        selected_index === 0 ? images.length - 1 : selected_index - 1
      );
    }

    if (x > center) {
      select_image(
        selected_index === images.length - 1 ? 0 : selected_index + 1
      );
    }
  });
}
