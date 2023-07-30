import '../styles/modern-normalize.css';
import '../styles/style.css';
import Swiper from 'swiper';
import 'swiper/css';

const global = {
	currentPage: window.location.pathname,
	api: {
		key: '61e02808a626232c79b0a3f0606bdefa',
		url: 'https://api.themoviedb.org/3',
	},
	search: {
		term: '',
		page: 1,
		totalPages: 1,
		totalResults: 0,
	},
};

// Search Data From API
async function search() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	global.search.term = urlParams.get('search-term');

	if (global.search.term !== '' && global.search.term !== null) {
		const { results, total_pages, page, total_results } = await searchMovies();
		global.search.totalResults = total_results;
		global.search.page = page;
		global.search.totalPages = total_pages;

		if (results.length === 0) {
			showAlert('No matching results found!', 'alert-error');
			return;
		}

		showSearchResults(results);
	} else {
		showAlert('Please enter a movie title to search.', 'alert-error');
	}
}

function showSearchResults(results) {
	document.querySelector('.search-results').innerHTML = '';
	document.querySelector('#pagination').innerHTML = '';
	results.forEach((movie) => {
		const div = document.createElement('div');
		div.classList.add('card');

		div.innerHTML = `
			<a href="movie-details.html?id=${movie.id}">
			${
				movie.poster_path
					? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />`
					: `<img src="/no-image.jpg" alt="${movie.title}" />`
			}
		</a>
		<h4 class="swiper-rating">
		<i class="fa-solid fa-star" style="color: #d59a1a;"></i> ${movie.vote_average.toFixed(
			1
		)} / 10
		</h4>
		`;

		document.getElementById('search_results_heading').innerHTML = `
			<h2>${results.length} of ${global.search.totalResults} Results for "${global.search.term}"</h2>
		`;

		document.querySelector('.search-results').appendChild(div);
	});
	showPagination();
}

// show pagination
function showPagination() {
	const div = document.createElement('div');
	div.classList.add('pagination');
	div.innerHTML = `
		<button id="prev" class="btn">Prev</button>
		<button id="next" class="btn">Next</button>
		<div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
	`;
	document.getElementById('pagination').appendChild(div);

	// disable prev on first page
	if (global.search.page === 1) {
		document.getElementById('prev').disabled = true;
	}
	// disable next on last page
	if (global.search.page === global.search.totalPages) {
		document.getElementById('next').disabled = true;
	}

	// go to next page
	document.getElementById('next').addEventListener('click', async () => {
		global.search.page++;
		const { results, total_pages } = await searchMovies();
		showSearchResults(results);
	});

	// go to prev page
	document.getElementById('prev').addEventListener('click', async () => {
		global.search.page--;
		const { results, total_pages } = await searchMovies();
		showSearchResults(results);
	});
}

// Search Data From API
async function searchMovies() {
	const API_KEY = global.api.key;
	const API_URL = global.api.url;

	showSpinner();

	const response = await fetch(
		`${API_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
	);

	const data = await response.json();

	hideSpinner();

	return data;
}

// Show NOW-PLaying on Slider
async function showNowPlaying() {
	const { results } = await fetchData('movie/now_playing');
	results.forEach((movie) => {
		const div = document.createElement('div');
		div.classList.add('swiper-slide', 'card');

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

		document.querySelector('.swiper-now-playing-wrapper').appendChild(div);

		initSwiper('.swiper-now-playing');
	});
}

// Show Coming up this week
async function showComingThisWeek() {
	const { results } = await fetchData('movie/upcoming');

	results.forEach((movie) => {
		const div = document.createElement('div');
		div.classList.add('swiper-slide', 'card');

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

		document.querySelector('.swiper-coming-this-week-wrapper').appendChild(div);
		initSwiper('.swiper-coming-this-week');
	});
}

// Show Popular
async function showPopular() {
	const { results } = await fetchData('movie/popular');

	results.forEach((movie) => {
		const div = document.createElement('div');
		div.classList.add('swiper-slide', 'card');

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

		document.querySelector('.swiper-popular-wrapper').appendChild(div);
		initSwiper('.swiper-popular');
	});
}

// Show Similar
async function showSimilar(movieID) {
	const { results } = await fetchData(`movie/${movieID}/similar`);

	results.forEach((movie) => {
		const div = document.createElement('div');
		div.classList.add('swiper-slide', 'card');

		div.innerHTML = `
			<a href="movie-details.html?id=${movie.id}">
			${
				movie.poster_path
					? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />`
					: `<img src="/no-image.jpg" alt="${movie.title}" />`
			}
		</a>
		<h4 class="swiper-rating">
		<i class="fa-solid fa-star" style="color: #d59a1a;"></i> ${movie.vote_average.toFixed(
			1
		)} / 10
		</h4>
		`;

		document.querySelector('.swiper-similar-wrapper').appendChild(div);
		initSwiper('.swiper-similar');
	});
}

// initiliaze swiper
function initSwiper(targetEl) {
	const swiper = new Swiper(targetEl, {
		slidesPerView: 1,
		spaceBetween: 25,
		loop: true,
		autoPlay: {
			delay: 2000,
		},
		breakpoints: {
			400: {
				slidesPerView: 1,
			},
			500: {
				slidesPerView: 2,
			},
			700: {
				slidesPerView: 3,
			},
			1200: {
				slidesPerView: 5,
			},
		},
	});
}

// Show Movie Details
async function showMovieDetails() {
	const movieID = window.location.search.split('=')[1];
	const movie = await fetchData(`movie/${movieID}`);
	showActors(movieID);

	showBackDrop('movie', movie.backdrop_path);

	const div = document.createElement('div');

	div.innerHTML = `
	<div class="movie-details__top">
      <h4>${movie.tagline}</h4>
      <h1>${movie.title}</h1>
      <ul class="genres">
        ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <ul class="info">
        <li>
				<div class="vertical-text">
					<p>rating</p>
				</div>
				${movie.vote_average.toFixed(1)}
				</li>
        <li>
				<div class="vertical-text">
					<p>release</p>
				</div>
				${formatDate(movie.release_date)}
				</li>
				<li>
				<div class="vertical-text">
					<p>budget</p>
				</div>
				$${formatBudget(addCommas(movie.budget))}
				</li>
				<li>
				<div class="vertical-text">
					<p>length</p>
				</div>
				${movie.runtime} min
				</li>
        
      </ul>
    </div>
    <div class="movie-details__bottom">
      <div class="desc-wrapper">
        <div>
          <h2>description</h2>
          <p>${movie.overview}</p>
        </div>
      </div>
      <h2>notable cast</h2>
      <div class="cast-wrapper">
        ${showActors(movieID)}
      </div>
			
	`;

	document.getElementById('movie-details').appendChild(div);
	// await showMoviePics(movieID);
	showSimilar(movieID);
}

// Show actors
async function showActors(movieID) {
	const { cast } = await fetchData(`movie/${movieID}/credits`);

	const actorsHtml = cast
		.slice(0, 3)
		.map(
			(actor) => `
      <div class="actor">
        <div class="avatar">
				<img src="https://image.tmdb.org/t/p/w500${actor.profile_path}" alt="${actor.name}">
				</div>
        ${actor.name}
      </div>
    `
		)
		.join('');

	const castWrapper = document.querySelector('.cast-wrapper');
	castWrapper.innerHTML = actorsHtml;
}

// Show BackDrop
function showBackDrop(type, backDropPath) {
	const backDropDiv = document.createElement('div');
	// backDropDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backDropPath})`;
	backDropDiv.style.backgroundImage = `linear-gradient(to bottom, rgba(5, 22, 30, 0), rgba(5, 22, 30, 1)), url(https://image.tmdb.org/t/p/original/${backDropPath})`;
	backDropDiv.style.backgroundSize = 'cover';
	backDropDiv.style.backgroundPosition = 'cover';
	backDropDiv.style.backgroundRepeat = 'no-repeat';
	backDropDiv.style.height = '55vh';
	backDropDiv.style.width = '100vw';
	backDropDiv.style.position = 'absolute';
	backDropDiv.style.top = '0';
	backDropDiv.style.left = '0';
	backDropDiv.style.zIndex = '-1';
	backDropDiv.style.opacity = '1';

	if (type === 'movie') {
		document.getElementById('movie-details').appendChild(backDropDiv);
	} else {
		document.getElementById('tv-show-details').appendChild(backDropDiv);
	}
}

// Fetch Data From API
async function fetchData(endpoint) {
	const API_KEY = global.api.key;
	const API_URL = global.api.url;

	showSpinner();

	const response = await fetch(
		`${API_URL}/${endpoint}?api_key=${API_KEY}&language=en-US`
	);

	const data = await response.json();

	hideSpinner();

	return data;
}

// Highlight active link
function activeLink() {
	const links = document.querySelectorAll('.nav-link');
	links.forEach((link) => {
		if (link.getAttribute('href') === global.currentPage) {
			link.classList.add('active');
		}
	});
}

function showAlert(text, className) {
	const div = document.createElement('div');
	div.classList.add('alert', className);
	div.appendChild(document.createTextNode(text));
	document.querySelector('.alert').appendChild(div);

	setTimeout(() => {
		div.remove();
	}, 2000);
}

// show/hide spinner
function showSpinner() {
	document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
	document.querySelector('.spinner').classList.remove('show');
}

// add commas to numbers
const addCommas = (number) =>
	number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// Format Date
function formatDate(inputDate) {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const [year, month, day] = inputDate.split('-');
	const monthIndex = parseInt(month, 10) - 1;
	const formattedDate = `${months[monthIndex]} ${parseInt(day, 10)}, ${year}`;

	return formattedDate;
}

// Format budget
function formatBudget(budget) {
	const billion = 1000000000;
	const million = 1000000;

	// Remove any non-numeric characters from the budget string
	const numericBudget = parseInt(budget.replace(/\D/g, ''), 10);

	if (numericBudget >= billion) {
		return `${(numericBudget / billion).toFixed(0)}B`;
	} else if (numericBudget >= million) {
		return `${(numericBudget / million).toFixed(0)}M`;
	} else {
		return `${numericBudget}`;
	}
}

// initialize app
function init() {
	switch (global.currentPage) {
		case '/':
		case '/index.html':
			showNowPlaying();
			showComingThisWeek();
			showPopular();
			break;

		case '/movie-details.html':
			showMovieDetails();
			break;

		case '/search.html':
			search();
			break;

		case '/tv-shows.html':
			console.log('tv shows page');
			break;

		case '/tv-show-details.html':
			console.log('tv shows details');
			break;
	}

	activeLink();
}

document.addEventListener('DOMContentLoaded', init);
