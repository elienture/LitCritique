import "./styles/index.css";
import { initialReviews } from "./reviews";

const reviewForm = document.getElementById("reviewForm"); // форма для заполнения ревью
const closeButton = document.getElementById("closeButton"); // кнопка закрытия формы
const addButton = document.getElementById("addButton"); // кнопка добавления
const formModal = document.getElementById("formModal"); // модальное окно формы
const reviewTemplate = document.getElementById("review").content; // шаблон ревью
const reviewsList = document.querySelector(".reviews_list"); // контейнер для ревью
const ratingStars = document.querySelectorAll(".star");
let starRate = 0; // инициация переменной рейтинга

// Добавление ревью из initialReviews
function addReview(item) {
  reviewsList.append(getCard(item));
}

initialReviews.forEach((item) => addReview(item));

// Функция рейтинга ревью
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

// Функция переворачивания карточки ревью
function reviewFlip(reviewItem) {
  const buttonFront = reviewItem.querySelector(".flip_button_front");
  const buttonBack = reviewItem.querySelector(".flip_button_back"); // Кнопка на задней стороне

  buttonFront.addEventListener("click", () => {
    reviewItem.classList.toggle("is-flipped"); // Переворачиваем карточку на заднюю сторону
  });

  buttonBack.addEventListener("click", () => {
    reviewItem.classList.toggle("is-flipped"); // Переворачиваем карточку обратно на переднюю сторону
  });
}

// Функция для получения карточки ревью
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

  // Установка рейтинга
  rateStars(ratingStars, review);

  // Переворачием карточку ревью
  reviewFlip(reviewItem);

  return reviewItem;
}

// Заполнение рейтинга в форме
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

// Функция для создания карточки ревью
function createReview(name, description, image, author, rating) {
  const reviewItem = getCard({ name, description, image, author, rating });
  reviewsList.prepend(reviewItem); // Добавляем карточку на страницу
}

// Функция для сохранения и получения ревью в localStorage
function saveReview(name, description, image, author, rating) {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || []; // Получаем ревью из localStorage или создаем новый массив при их отсутствии в хранилище
  reviews.push({ name, description, image, author, rating });
  localStorage.setItem("reviews", JSON.stringify(reviews));
}

// Заполнение формы "Add book"
reviewForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Получаем значения из полей
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const author = document.getElementById("author").value;
  const image = document.getElementById("image");
  const defaultImage = "https://i.ibb.co/FgxX4ZJ/no-book-cover.jpg"; // Изображение "No book cover"

  const setImage = (imageUrl) => {
    createReview(title, description, imageUrl, author, starRate); // Создаем карточку
    saveReview(title, description, imageUrl, author, starRate); // Сохраняем в localStorage
  };

  if (image.files.length > 0) {
    const file = image.files[0];
    const reader = new FileReader(); // Чтение содержимого файла с помощью экзмепляра FileReader
    reader.onload = () => setImage(reader.result); // Чтение файла закончилось, получаем результат
    reader.onerror = () => setImage(defaultImage); // При ошибке чтения файла устанавливаем изображение "No book cover"
    reader.readAsDataURL(file); // Чтение содержимого file в формате Data URL
  } else {
    setImage(defaultImage); // Устанавливаем изображение "No book cover", если пользователь не добавил его в форму
  }

  formModal.style.display = "none";
  reviewForm.reset(); // Ресет формы после закрытия
});

window.onload = () => {
  // Ждем полной загрузки страницы с помощью обработчика onload
  const reviewStorage = JSON.parse(localStorage.getItem("reviews")) || []; // Если данных нет, возвращаем пустой массив
  reviewStorage.forEach(({ name, description, image, author, rating }) => {
    createReview(name, description, image, author, rating);
  });
};

// Ресет рейтинга в форме
function resetRating() {
  starRate = 0;
  ratingStars.forEach((star) => {
    star.classList.remove("selected", "hover");
  });
}

// Открытие модального окна
addButton.addEventListener("click", () => {
  formModal.style.display = "block";
  resetRating();
});

// Закрытие модального окна
closeButton.addEventListener("click", () => {
  formModal.style.display = "none";
});

// Закрытие модального окна по клавише Esc
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    formModal.style.display = "none";
  }
});
