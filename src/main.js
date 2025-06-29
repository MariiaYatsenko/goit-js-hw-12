import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more-btn');
const input = form.elements['search-text'];
const per_page = 15;
let query = '';
let page = 1;
let totalHits = 0;

form.addEventListener('submit', async e => {
  e.preventDefault();
  query = input.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Enter a search term',
      position: 'topRight',
    });
    input.value = '';
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'No images found for this query',
        position: 'topRight',
      });
      input.select();
      return;
    }

    createGallery(data.hits);
    input.value = '';

    
    if (data.hits.length < per_page || totalHits <= per_page) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      hideLoadMoreButton();
    } else {
      showLoadMoreButton();
    }

  } catch {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    const { height: cardHeight } = document
      .querySelector('.gallery .gallery-item')
      .getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    
    if (page * per_page >= totalHits || data.hits.length < per_page) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      hideLoadMoreButton();
    } else {
      showLoadMoreButton();
    }

  } catch {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});
