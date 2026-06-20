const stars = document.querySelectorAll("#stars span");
const ratingInput = document.getElementById("rating");

let selectedRating = 0;

// hover effect
stars.forEach(star => {
  star.addEventListener("mouseover", () => {
    const value = star.getAttribute("data-value");
    highlightStars(value);
  });

  star.addEventListener("click", () => {
    selectedRating = star.getAttribute("data-value");
    ratingInput.value = selectedRating;
  });
});

// όταν φεύγει το mouse
document.getElementById("stars").addEventListener("mouseleave", () => {
  highlightStars(selectedRating);
});

function highlightStars(value) {
  stars.forEach(star => {
    star.classList.remove("active");
    if (star.getAttribute("data-value") <= value) {
      star.classList.add("active");
    }
  });
}