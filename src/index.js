const axios = require('axios').default;

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onSearch);

let gallery = new SimpleLightbox('.gallery a');

function onSearch(e) {
  e.preventDefault();

  let inputValue = e.target.elements.searchQuery.value;

  fetchImage(inputValue);
}

function fetchImage(value) {
  const KEY_API = `31678159-88f5618da94fdea3c5da1a6bf`;
  const BASE_URL = `https://pixabay.com/api/`;
  //
  return axios
    .get(
      `${BASE_URL}?key=${KEY_API}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true`
    )
    .then(r => {
      createMarkup(r.data.hits);
    });
}

function createMarkup(arr) {
  refs.gallery.innerHTML = arr.map(el => {
    const {
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = el;

    return `<div class="photo-card">
        <a class="gallery__item" href="${largeImageURL}"><img class="gallery__image" src=${webformatURL} alt="${tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info-item">
            <b>${likes}</b>
          </p>
          <p class="info-item">
            <b>${views}</b>
          </p>
          <p class="info-item">
            <b>${comments}</b>
          </p>
          <p class="info-item">
            <b>${downloads}</b>
          </p>
        </div>
      </div>`;
  });

  gallery.refresh();
}
