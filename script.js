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
btn?.addEventListener('click', () => {
  getCountriesNewerWay(country);
});

const findLocation = loc => {
  const { latitude, longitude } = loc.coords;
  fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json`)
    .then(res => res.json())
    .then(data => getCountriesNewerWay(data.country));
};

//const loc = navigator.geolocation.getCurrentPosition(findLocation, () =>
//  console.log('cant')
//);
/*
const whereAmI = ()=>{
  getPosition().then(res=>findLocation(res));
}
*/


////////////////////////////////////////////////////////////////////////
//The Event Loop in Practice
//Always: Regular functions -> Promises -> Events(dom events)
//console.log('Test start');
setTimeout(() => {
  //console.log('0 sec timer');
}, 0);
//Promise.resolve('Resolved promise 1').then(res=>console.log(res))

Promise.resolve('Resolved promise 2'). then(res=>{
  for(let i=0; i<100000000; i++){
    i=i;
  }

  //console.log(res);
})
//console.log('Test end');


////////////////////////////////////////////////////////////////////////
//building a simple promise
/*
const lotteryPromise = new Promise(function(resolve, reject){
  console.log('Lottery draw is happening')
  setTimeout(() => {
    if(Math.random()>=0.5){
      resolve('You win!');
    }
    else{
      reject(new Error('You lost your money'));
    }
  }, 2000);
});

//lotteryPromise.then(res=> console.log(res)).catch(err=>console.error(err.message))
*/



////////////////////////////////////////////////////////////////////////
//Promisifying setTimeout
/*
const wait = function(seconds){
  return new Promise((resolve)=>setTimeout(resolve, seconds*1000))
}

wait(2).then(()=>{
  console.log('I waited for 2 seconds')
  return wait(1)
}).then(()=> console.log('i waited for 1 second'));

Promise.resolve('abc').then(res=>console.log(res));
Promise.reject('abc').catch(err=>new Error(err));
*/



////////////////////////////////////////////////////////////////////////
//Promisifying the Geolocation API

const getPosition= function(){
  return new Promise(function(resolve, reject){
    //navigator.geolocation.getCurrentPosition(position=>resolve(position), err=> reject(err));
    navigator.geolocation.getCurrentPosition(resolve, reject)
  });
}
//whereAmI();

/*
const wait = function(seconds){
  return new Promise((resolve)=>setTimeout(resolve, seconds*1000))
}
const imgContainer = document.querySelector('.images');
const createImage = (imgPath)=>{
  return new Promise(function(resolve,reject){
    const img = document.createElement('img');
    img.src=imgPath;

    img.addEventListener('load',()=>{
      imgContainer.append(img);
      resolve(img)
    });

    img.addEventListener('error',()=>{
      reject(new Error('Image not found'))
    })
  });
};

let currentImg;
createImage('https://ec.europa.eu/programmes/horizon2020/sites/default/files/newsroom/29_05_17_small_22078.jpg').then(img=>{
  currentImg=img;
  console.log('Image 1 loaded');
  return wait(2)
}).then(()=>{
  currentImg.style.display='none';
  return createImage('https://img.jakpost.net/c/2020/05/01/2020_05_01_94194_1588330417._large.jpg')
}).catch(err=>console.log(err));
*/

//Consuming Promises with Async/Await
const whereAmI = async function(country){
  await navigator.geolocation.getCurrentPosition();
  const res = await fetch(`https://restcountries.eu/rest/v2/name/${country}`);
  const [data] = await res.json();
  renderCountry(data);
  countriesContainer.style.opacity = 1;
}
//whereAmI('israel');

//Try / catch