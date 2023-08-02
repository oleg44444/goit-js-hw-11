import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';

function getSearch(searchText) {
  const params = {
    key: '38612170-77e451be80bcbbe7a33b7fee0',
    q: searchText,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  return axios
    .get(BASE_URL, { params })
    .then(response => response.data.hits) // Отримуємо масив зображень з відповіді
    .catch(error => {
      console.error(error);
      return [];
    });
}

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-form input');
const gallery = document.querySelector('.gallery');
form.addEventListener('submit', onFormSearch);

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

function onFormSearch(evt) {
  evt.preventDefault();
  const searchText = input.value; // Отримання значення з введення
  getSearch(searchText).then(data => createGallery(data));
}
