// IMPORTS
import fetchImage from './fetchPictures';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

// REFS
const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

// ADD LISTENER
refs.form.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMorePictures);
let gallery = new SimpleLightbox('.gallery a');

// COUNTERS
let pageNow = 1;
let preValueInput = '';

function onSearch(e) {
  e.preventDefault();

  let inputValue = e.target.elements.searchQuery.value;

  refs.loadMore.style.display = 'block';

  if (preValueInput === inputValue) {
    onLoadMorePictures();
  }
  // Новый запрос
  pageNow = 1;
  fetchImage(inputValue, pageNow)
    .then(fetchData => {
      const { hits: arr, totalHits } = fetchData.data;
      console.log(fetchData);

      if (arr.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      if (totalHits - 40 * pageNow < 1) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
      refs.gallery.innerHTML = createMarkup(arr);
      gallery.refresh();
      preValueInput = inputValue;
      refs.loadMore.style.display = 'block';
    })
    .catch(e => console.log(e));
}

function onLoadMorePictures(e) {
  pageNow += 1;

  fetchImage(preValueInput, pageNow)
    .then(fetchData => {
      const { hits: arr } = fetchData.data;
      if (arr.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      refs.gallery.insertAdjacentHTML('beforeend', createMarkup(arr));
      gallery.refresh();
    })
    .catch(console.log);
  return;
}

function createMarkup(arr) {
  return arr
    .map(el => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = el;

      return `<div class="gallery__item">
        <a class="gallery__link" href="${largeImageURL}"><img class="gallery__image" src=${webformatURL} alt="${tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info-item">
            <b>Likes:</b> ${likes}
          </p>
          <p class="info-item">
            <b>Views:</b> ${views}
          </p>
          <p class="info-item">
            <b>Comments:</b> ${comments}
          </p>
          <p class="info-item">
            <b>Downloads:</b> ${downloads}
          </p>
        </div>
      </div>`;
    })
    .join('');
}
