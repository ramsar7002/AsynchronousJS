'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = (data, className = '') => {
  const html = ` <article class="country ${className}">
   <img class="country__img" src="${data.flag}" />
   <div class="country__data">
     <h3 class="country__name">${data.name}</h3>
     <h4 class="country__region">${data.region}</h4>
     <p class="country__row"><span>👫</span>${+(
       data.population / 1000000
     ).toFixed(1)} people</p>
     <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
     <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
   </div>
 </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};

///////////////////////////////////////
//xml http requst - the old way
const getCountryAndNighboorData = country => {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);

  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);
    renderCountry(data);
  });
};

///////////////////////////////////////
//xml http requst - the newer way - promise
const fetchData = (url, err) => {
  return fetch(url).then(res => {
    if (!res.ok) throw new Error(err);
    return res.json();
  });
};

const renderError = msg => {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

const getCountriesNewerWay = country => {
  let url = `https://restcountries.eu/rest/v2/name/${country}`;
  let err = `Country not found`;
  fetchData(url, err)
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];
      if (!neighbour) throw new Error(`No neighbour found`);

      //country 2
      let url = `https://restcountries.eu/rest/v2/alpha/${neighbour}`;
      let err = `Neighbour not found`;
      return fetchData(url, err);
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(
        renderError(`Something went wrong. ${err.message}. Try again!`)
      );
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

let country = 'france';
btn.addEventListener('click', () => {
  getCountriesNewerWay(country);
});
