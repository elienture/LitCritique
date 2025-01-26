import "./styles/index.css";
import { initialReviews } from "./reviews";

const reviewForm = document.getElementById("reviewForm"); // review form
const closeButton = document.getElementById("closeButton"); // form close button
const addButton = document.getElementById("addButton"); // add review button
const formModal = document.getElementById("formModal"); // form modal
const reviewTemplate = document.getElementById("review").content; // review template
const reviewsList = document.querySelector(".reviews_list"); // review section
const ratingStars = document.querySelectorAll(".star");
let starRate = 0; // initial rating variable

// display reviews from initialReviews array
function addReview(item) {
  reviewsList.append(getCard(item));
}

initialReviews.forEach((item) => addReview(item));

// rating function
function rateStars(ratingStars, item) {
  ratingStars.forEach((star, index) => {
    if (index < item.rating) {
      star.classList.add("selected");
    }

    star.addEventListener("click", () => {
      ratingStars.forEach((star, i) => {
        star.classList.remove("selected");
        if (i <= index) {
          star.classList.add("selected");
        }
      });
    });

    star.addEventListener("mouseover", () => {
      ratingStars.forEach((star, i) => {
        if (i <= index) {
          star.classList.add("hover");
        } else {
          star.classList.remove("hover");
        }
      });
    });

    star.addEventListener("mouseout", () => {
      ratingStars.forEach((star) => {
        star.classList.remove("hover");
      });
    });
  });
}

// flipping review card function
function reviewFlip(reviewItem) {
  const buttonFront = reviewItem.querySelector(".flip_button_front");
  const buttonBack = reviewItem.querySelector(".flip_button_back"); 

  buttonFront.addEventListener("click", () => {
    reviewItem.classList.toggle("is-flipped"); // flip back the card to view description
  });

  buttonBack.addEventListener("click", () => {
    reviewItem.classList.toggle("is-flipped"); // flip card to the front 
  });
}

// review display function
function getCard(review) {
  const reviewItem = reviewTemplate
    .querySelector(".review_box")
    .cloneNode(true);
  const reviewTitle = reviewItem.querySelector(".review_title");
  const reviewImage = reviewItem.querySelector(".review_image");
  const reviewDescription = reviewItem.querySelector(".review_description");
  const reviewAuthor = reviewItem.querySelector(".review_author");
  const ratingStars = reviewItem.querySelectorAll(".star");

  reviewImage.src = review.image;
  reviewTitle.textContent = review.name;
  reviewAuthor.textContent = review.author;
  reviewDescription.textContent = review.description;

  // set up rating
  rateStars(ratingStars, review);

  // flip review card
  reviewFlip(reviewItem);

  return reviewItem;
}

// submit rating
ratingStars.forEach((star) => {
  star.addEventListener("click", () => {
    starRate = star.dataset.value;
    ratingStars.forEach((s, i) => {
      s.classList.remove("selected");
      if (i < starRate) {
        s.classList.add("selected");
      }
    });
  });

  star.addEventListener("mouseover", () => {
    ratingStars.forEach((s, i) => {
      if (i < star.dataset.value) {
        s.classList.add("hover");
      }
    });
  });

  star.addEventListener("mouseout", () => {
    ratingStars.forEach((s) => {
      s.classList.remove("hover");
    });
  });
});

// create a new review 
function createReview(name, description, image, author, rating) {
  const reviewItem = getCard({ name, description, image, author, rating });
  reviewsList.prepend(reviewItem); // add card to page
}

// function for setting and getting items from localStorage 
function saveReview(name, description, image, author, rating) {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || []; // get reviews from localStorage or get empty array if storage is empty
  reviews.push({ name, description, image, author, rating });
  localStorage.setItem("reviews", JSON.stringify(reviews));
}

// submiting form through "Add book"
reviewForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // get values from inputs
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const author = document.getElementById("author").value;
  const image = document.getElementById("image");
  const defaultImage = "https://i.ibb.co/FgxX4ZJ/no-book-cover.jpg"; // displays "No book cover"

  const setImage = (imageUrl) => {
    createReview(title, description, imageUrl, author, starRate); // create review card 
    saveReview(title, description, imageUrl, author, starRate); // save to localStorage
  };

  if (image.files.length > 0) {
    const file = image.files[0];
    const reader = new FileReader(); // reading file's contents with FileReader
    reader.onload = () => setImage(reader.result); // file reading complete, get result
    reader.onerror = () => setImage(defaultImage); // in case of error, image is set to "No book cover"
    reader.readAsDataURL(file); // file's contents in Data URL format
  } else {
    setImage(defaultImage); // set "No book cover", if user did not upload an image 
  }

  formModal.style.display = "none";
  reviewForm.reset(); // form reset after closing
});

window.onload = () => {
  // wait for page to upload completely using onload
  const reviewStorage = JSON.parse(localStorage.getItem("reviews")) || []; // return empty array if there is no content in localStorage
  reviewStorage.forEach(({ name, description, image, author, rating }) => {
    createReview(name, description, image, author, rating);
  });
};

// rating reset 
function resetRating() {
  starRate = 0;
  ratingStars.forEach((star) => {
    star.classList.remove("selected", "hover");
  });
}

// modal open function
addButton.addEventListener("click", () => {
  formModal.style.display = "block";
  resetRating();
});

// modal close function
closeButton.addEventListener("click", () => {
  formModal.style.display = "none";
});

// modal close function (using "esc")
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    formModal.style.display = "none";
  }
});
