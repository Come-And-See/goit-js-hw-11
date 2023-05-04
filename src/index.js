import './css/styles.css';
import { Notify } from 'notiflix';
import photoCard from './templates/photoCard.hbs';
import axios from 'axios';

// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '11680265-49a2c7c2ef17772c90d3b7b54';
let PAGE = 1;

const refs = {
  input: document.querySelector('input[name="searchQuery"]'),
  button: document.querySelector('button[type="submit"]'),
  gallery: document.querySelector('.gallery'),
  target: document.querySelector('#sent'),
};

refs.button.addEventListener('click', onSearchPhoto);

function onSearchPhoto(e) {
  e.preventDefault();

  if (refs.input.value !== '') {
    onNewSearch();
    axioPhoto(refs.input.value);
  }
}

async function axioPhoto(q) {
  if (q === '') {
    return;
  }

  try {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${PAGE}`
    );
    creatCardPhoto(response);
    PAGE += 1;

    if (response.data.hits.length === 0) {
      throw 'error';
    } else {
      Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    }
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function creatCardPhoto(r) {
  refs.gallery.insertAdjacentHTML('beforeend', photoCard(r));

  const simple = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: '250',
  });
  simple.refresh();
}

function onNewSearch() {
  refs.gallery.innerHTML = '';
  PAGE = 1;
}

const callback = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && refs.input.value !== '' && PAGE >= 2) {
      axioPhoto(refs.input.value);
    }
  });
};

const options = {
  rootMargin: '370px',
};
const observer = new IntersectionObserver(callback, options);

observer.observe(refs.target);
