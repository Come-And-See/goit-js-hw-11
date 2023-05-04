import './css/styles.css';
import API from './js/fetchCountries';
import { Notify } from 'notiflix';

import countrysFunction from './templates/countrys.hbs';
import countrysFunctionFull from './templates/countrysFull.hbs';

const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onTEST, DEBOUNCE_DELAY));

function onTEST(e) {
  if (e.target.value.trim().length === 0) {
    return onClearHTML();
  }

  API.fetchCountries(`${e.target.value.trim()}`)
    .then(country => {
      if (country.length > 10) {
        return onAlert();
      } else if (country.length !== 1) {
        return onCountryAll(country);
      }
      onCountryOne(country);
    })
    .catch(() => {
      onErrorCountry();
    });
}

function onAlert() {
  Notify.info('Too many matches found. Please enter a more specific name.');
  onClearHTML();
}

function onCountryAll(country) {
  onClearHTML();
  const CountryAll = countrysFunction(country);
  refs.countryInfo.insertAdjacentHTML('beforeend', CountryAll);
}

function onCountryOne(country) {
  onClearHTML();
  const CountryOne = countrysFunctionFull(country);
  refs.countryInfo.insertAdjacentHTML('beforeend', CountryOne);
}

function onClearHTML() {
  refs.countryInfo.innerHTML = '';
}

function onErrorCountry() {
  Notify.failure('Oops, there is no country with that name');
  onClearHTML();
}
