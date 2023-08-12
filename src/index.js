import throttle from 'lodash.throttle';
import ImagesApiService from './js/images.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const newImageService = new ImagesApiService();
const form = document.querySelector('.search-form');
const input = document.querySelector('.search-form input');
const gallery = document.querySelector('.gallery');
const scrollTopButton = document.querySelector('.scroll-top-btn');
const loaderMore = document.querySelector('.loader');

form.addEventListener('submit', onFormSearch);

// В початковому стані кнопка повинна бути прихована.
loaderMore.style.display = 'none';

function onFormSearch(evt) {
  loaderMore.style.display = 'none';
  evt.preventDefault();
  newImageService.page = 1;
  newImageService.text = input.value;

  newImageService
    .getSearch()
    .then(data => {
      console.log(data.hits.length);
      if (data.totalHits > 40) {
        loaderMore.style.display = 'flex';
      } else {
        loaderMore.style.display = 'none';
      }
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      createGallery(data.hits);
    })
    .catch(error => {
      console.error(error);
      Notiflix.Notify.failure(
        'An error occurred while fetching images. Please try again later.'
      );
    });
}

// створюємо нову розмітку з зображеннями
function createGallery(arr) {
  // Очищаємо вміст галереї перед рендерингом нових зображень
  gallery.innerHTML = '';

  appendImages(arr);
}

// створюємо бескінечний скролл
window.addEventListener(
  'scroll',
  throttle(() => {
    const documentRect = document.documentElement.getBoundingClientRect();

    if (documentRect.bottom < document.documentElement.clientHeight + 150) {
      console.log('DONE');
      newImageService.page += 1; // Збільшуємо номер сторінки

      newImageService.getSearch().then(data => {
        appendImages(data.hits);
        const { height: cardHeight } = document
          .querySelector('.gallery')
          .firstElementChild.getBoundingClientRect();
        const galleryHeight = gallery.getBoundingClientRect().height;

        const scrollAmount = cardHeight * 2;

        if (scrollAmount < galleryHeight) {
          window.scrollBy({
            top: scrollAmount,
            behavior: 'smooth',
          });
        }

        if (data.totalHits > 40) {
          loaderMore.style.display = 'flex';
          console.log('loaderMore should be displayed');
        } else {
          loaderMore.style.display = 'none';
          console.log('loaderMore should be hidden');

          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results"
          );
        }
        return;
      });
    }
  }, 500)
);

function appendImages(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loaderMore.style.display = 'none';
    return;
  }

  arr.forEach(item => {
    const photoCard = `
    <a href="${item.largeImageURL}" class="photo-card-link">
      <div class="photo-card">
        <img src="${item.webformatURL}" class="photo-card-image" alt="${item.tags}" loading="lazy" />
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
    </a>
    `;

    gallery.insertAdjacentHTML('beforeend', photoCard);
    loaderMore.style.display = 'none';
  });

  const lightbox = new SimpleLightbox('.photo-card-link');
  lightbox.refresh();
}

// Показуємо або приховуємо кнопку в залежності від положення на сторінці
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopButton.style.display = 'block';
  } else {
    scrollTopButton.style.display = 'none';
  }
});

// Прокручування вверх при кліку на кнопку
scrollTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});
