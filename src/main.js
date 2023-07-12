import '../styles/modern-normalize.css';
import '../styles/style.css';
import Swiper from 'swiper';
import 'swiper/css';

const global = {
	currentPage: window.location.pathname,
};

// Show NOW-PLaying on Slider
async function showNowPlaying() {
	const { results } = await fetchData('movie/now_playing');
	results.forEach((movie) => {
		const div = document.createElement('div');
		div.classList.add('swiper-slide');

		div.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            ${
							movie.poster_path
								? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />`
								: `<img src="/no-image.jpg" alt="${movie.title}" />`
						}
          </a>
          <h4 class="swiper-rating">
          <i class="fa-solid fa-star" style="color: #d59a1a;"></i> ${
						movie.vote_average
					} / 10
          </h4>
    `;

		document.querySelector('.swiper-wrapper').appendChild(div);

		initSwiper();
	});
}

// initiliaze swiper

function initSwiper() {
	const swiper = new Swiper('.swiper', {
		slidesPerView: 1,
		spaceBetween: 30,
		freeMode: true,
		loop: true,
		autoPlay: {
			delay: 4000,
			disableOnInteraction: false,
		},
		breakpoints: {
			500: {
				slidesPerView: 2,
			},
			700: {
				slidesPerView: 3,
			},
			1200: {
				slidesPerView: 4,
			},
		},
	});
}

// Show Movie Details

async function showMovieDetails() {
	const movieID = window.location.search.split('=')[1];
	console.log(movieID);
	const movie = await fetchData(`movie/${movieID}`);

	showBackDrop('movie', movie.backdrop_path);

	const div = document.createElement('div');

	div.innerHTML = `
	<div class="movie-details__top">
      <h4>Actor name, actor name</h4>
      <h1>${movie.title}</h1>
      <ul class="genres">
        ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <ul class="info">
        <li>${movie.vote_average}</li>
        <li>${movie.release_date}</li>
        <li>$${addCommas(movie.budget)}</li>
        <li>${movie.runtime} min</li>
      </ul>
    </div>
    <div class="movie-details__bottom">
      <div class="desc-wrapper">
        <div>
          <h2>description</h2>
          <p>${movie.overview}</p>
        </div>
        <div class="hype">
          <h2>hype</h2>
          <div class="stats-wrapper">
            <div class="stat">98%</div>
            <div class="stat">9.4/10</div>
            <div class="stat">84</div>
          </div>
        </div>
      </div>
      <h2>notable cast</h2>
      <div class="cast-wrapper">
        <div class="actor">
          <div class="avatar"></div>
          actor name
        </div>
        <div class="actor">
          <div class="avatar"></div>
          actor name
        </div>
        <div class="actor">
          <div class="avatar"></div>
          actor name
        </div>
      </div>
	`;

	document.getElementById('movie-details').appendChild(div);
}

// Show BackDrop
function showBackDrop(type, backDropPath) {
	const backDropDiv = document.createElement('div');
	backDropDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backDropPath})`;
	backDropDiv.style.backgroundSize = 'cover';
	backDropDiv.style.backgroundPosition = 'cover';
	backDropDiv.style.backgroundRepeat = 'no-repeat';
	backDropDiv.style.height = '55vh';
	backDropDiv.style.width = '100vw';
	backDropDiv.style.position = 'absolute';
	backDropDiv.style.top = '0';
	backDropDiv.style.left = '0';
	backDropDiv.style.zIndex = '-1';
	backDropDiv.style.opacity = '.5';

	if (type === 'movie') {
		document.getElementById('movie-details').appendChild(backDropDiv);
	} else {
		document.getElementById('tv-show-details').appendChild(backDropDiv);
	}
}

// Fetch Data From API
async function fetchData(endpoint) {
	const API_KEY = '61e02808a626232c79b0a3f0606bdefa';
	const API_URL = 'https://api.themoviedb.org/3';

	const response = await fetch(
		`${API_URL}/${endpoint}?api_key=${API_KEY}&language=en-US`
	);

	const data = await response.json();

	return data;
}

// add commas to numbers
const addCommas = (number) =>
	number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// initialize app
function init() {
	switch (global.currentPage) {
		case '/':
		case '/index.html':
			showNowPlaying();
			break;

		case '/movie-details.html':
			showMovieDetails();
			break;

		case '/tv-shows.html':
			console.log('tv shows page');
			break;

		case '/tv-show-details.html':
			console.log('tv shows details');
			break;
	}
}

document.addEventListener('DOMContentLoaded', init);
