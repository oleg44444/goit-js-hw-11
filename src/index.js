import ImagesApiService from './js/images.js';
import Notiflix from 'notiflix';
const newImageService = new ImagesApiService();
const form = document.querySelector('.search-form');
const input = document.querySelector('.search-form input');
const gallery = document.querySelector('.gallery');
form.addEventListener('submit', onFormSearch);
const buttonLoadMore = document.querySelector('.load-more');

// В початковому стані кнопка повинна бути прихована.
buttonLoadMore.style.display = 'none';

buttonLoadMore.addEventListener('click', onLoadMoreClick);

function onFormSearch(evt) {
  // При повторному сабміті форми кнопка спочатку ховається, а після запиту знову відображається.
  buttonLoadMore.style.display = 'none';
  evt.preventDefault();
  newImageService.page = 1;
  newImageService.text = input.value; // Оновити пошуковий запит
  newImageService.getSearch().then(images => createGallery(images));
  // Після першого запиту кнопка з'являється в інтерфейсі під галереєю.
  if (images.length > 0) {
    buttonLoadMore.style.display = 'block';
  }
}

// створюємо нову розмітку з зображеннями
function createGallery(arr) {
  // Очищаємо вміст галереї перед рендерингом нових зображень
  gallery.innerHTML = '';

  if (!Array.isArray(arr) || arr.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  arr.forEach(item => {
    const photoCard = `
      <div class="photo-card">
        <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes ${item.likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${item.views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${item.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${item.downloads}</b>
          </p>
        </div>
      </div>
    `;

    gallery.insertAdjacentHTML('beforeend', photoCard);
  });
}

// створюємо функцію для перелистування сторінки

function onLoadMoreClick() {
  newImageService.page += 1; // Збільшуємо номер сторінки
  newImageService.getSearch().then(images => {
    createGallery(images);

    if (images.length === 0) {
      buttonLoadMore.style.display = 'none';
      Notiflix.Notify.failure('Більше зображень для завантаження немає.');
    }
  });
}
