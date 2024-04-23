const global = {
  APIKEY: 'd6c10f24015cc39bf03a1e592bc74b90',
  posterImgBaseUrl: 'https://image.tmdb.org/t/p/w500',
  currentPath: window.location.pathname,
};

const initSwiper = () => {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 10,
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 50,
      },
    },
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });
};

const fetchSomething = async (url) => {
  const response = await fetch(`${url}api_key=${global.APIKEY}`);
  const data = await response.json();
  return data;
};

const highlightLinks = () => {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPath) {
      link.classList.add('active');
    }
  });
};

const displayBackgroundIMG = (type, imgURL) => {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${imgURL})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.2';
  overlayDiv.style.maskImage =
    'linear-gradient(rgba(0, 0, 0, 1) 60%, transparent';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
};

const getNowPlaying = () => {
  const nowPlaying = fetchSomething(
    'https://api.themoviedb.org/3/movie/now_playing?'
  );

  nowPlaying.then((result) => {
    result.results.forEach((result) => {
      const imgURL = global.posterImgBaseUrl + result.poster_path;
      const swiperSlide = document.createElement('div');
      swiperSlide.classList.add('swiper-slide');
      swiperSlide.innerHTML = `
      <a href="movie-details.html?id=${result.id}">
        <img src="${imgURL}" alt="${result.original_title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${result.vote_average.toFixed(
          1
        )} / 10
      </h4>
      `;
      document.querySelector('.swiper-wrapper').append(swiperSlide);
    });
  });
};

const getPopularMovies = () => {
  const popularMovies = fetchSomething(
    'https://api.themoviedb.org/3/movie/popular?'
  );

  popularMovies.then((results) => {
    results.results.forEach((result) => {
      const movieCard = document.createElement('div');
      const imgURL = global.posterImgBaseUrl + result.poster_path;
      movieCard.classList.add('card');
      movieCard.innerHTML = `
        <a href="movie-details.html?id=${result.id}">
          <img src="${imgURL}" class="card-img-top" alt="Movie Title" />
        </a>
        <div class="card-body">
          <h5 class="card-title">${result.original_title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${result.release_date}</small>
          </p>
        </div>
      `;
      document.querySelector('#popular-movies').append(movieCard);
    });
  });
};

const getPopularShows = () => {
  const popularShows = fetchSomething(
    'https://api.themoviedb.org/3/tv/popular?'
  );

  popularShows.then((results) => {
    results.results.forEach((result) => {
      console.log(result);
      const movieCard = document.createElement('div');
      const imgURL = global.posterImgBaseUrl + result.poster_path;
      movieCard.classList.add('card');
      movieCard.innerHTML = `
        <a href="tv-details.html?id=${result.id}">
          <img src="${imgURL}" class="card-img-top" alt="Movie Title" />
        </a>
        <div class="card-body">
          <h5 class="card-title">${result.name}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${result.first_air_date}</small>
          </p>
        </div>
      `;
      document.querySelector('#popular-shows').append(movieCard);
    });
  });
};

const getMovieDetails = () => {
  const movieID = window.location.href.split('id=')[1];

  const movieDetails = fetchSomething(
    `https://api.themoviedb.org/3/movie/${movieID}?`
  );

  movieDetails.then((results) => {
    displayBackgroundIMG('movie', results.backdrop_path);
    const poster_path = results.belongs_to_collection
      ? results.belongs_to_collection.poster_path
      : results.poster_path;
    const imgURL = global.posterImgBaseUrl + poster_path;
    const movieDetails = document.createElement('div');
    movieDetails.innerHTML = `
      <div class="details-top">
        <div>
          <img
            src="${imgURL}"
            class="card-img-top"
            alt="${results.original_title}"
          />
        </div>
        <div>
          <h2>${results.original_title}</h2>
          <p>
            <i class="fas fa-star text-primary"></i>
            ${results.vote_average.toFixed(1)} / 10
          </p>
          <p class="text-muted">Release Date: ${results.release_date}</p>
          <p>
            ${results.overview}
          </p>
          <h5>Genres</h5>
          <ul class="list-group">
            ${results.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
          </ul>
          <a href="${
            results.homepage
          }" target="_blank" class="btn">Visit Movie Homepage</a>
        </div>
      </div>
      <div class="details-bottom">
        <h2>Movie Info</h2>
        <ul>
          <li><span class="text-secondary">Budget:</span> $${results.budget.toLocaleString(
            'en-US'
          )}</li>
          <li><span class="text-secondary">Revenue:</span> $${results.revenue.toLocaleString(
            'en-US'
          )}</li>
          <li><span class="text-secondary">Runtime:</span> ${
            results.runtime
          } minutes</li>
          <li><span class="text-secondary">Status:</span> ${results.status}</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">${results.production_companies
          .map((product_company) => `<span>${product_company.name}</span>`)
          .join(', ')}</div>
      </div>
    `;
    document.querySelector('#movie-details').append(movieDetails);
  });
};

const getShowDetails = () => {
  const showID = window.location.href.split('id=')[1];

  const showDetails = fetchSomething(
    `https://api.themoviedb.org/3/tv/${showID}?`
  );

  showDetails.then((results) => {
    console.log(results);
    displayBackgroundIMG('show', results.backdrop_path);
    const poster_path = results.belongs_to_collection
      ? results.belongs_to_collection.poster_path
      : results.poster_path;
    const imgURL = global.posterImgBaseUrl + poster_path;
    const showDetails = document.createElement('div');
    showDetails.innerHTML = `
    <div class="details-top">
      <div>
        <img
          src="${imgURL}"
          class="card-img-top"
          alt="${results.name}"
        />
      </div>
    <div>
      <h2>${results.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        8 / 10
      </p>
      <p class="text-muted">Release Date: ${results.first_air_date}</p>
      <p>
        ${results.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${results.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${
        results.homepage
      }" target="_blank" class="btn">Visit Show Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number Of Episodes:</span> ${
        results.number_of_episodes
      }</li>
      <li>
        <span class="text-secondary">Last Episode To Air:</span> ${
          results.last_episode_to_air.episode_number
        } , Season: ${results.last_episode_to_air.season_number}
      </li>
      <li><span class="text-secondary">Status:</span> ${results.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${results.production_companies
      .map((production_company) => `<span>${production_company.name}</span>`)
      .join(', ')}</div>
  </div>
    `;
    document.querySelector('#show-details').append(showDetails);
  });
};

const fetchTermByPage = (page, term, prevBtn, nextBtn, type) => {
  const returnedData = fetchSomething(
    `https://api.themoviedb.org/3/search/${type}?query=${term}&page=${page}&`
  );
  returnedData.then((results) => {
    const currentPage = results.page;
    const totalPages = results.total_pages;
    const pageCounter = document.querySelector('.page-counter');
    pageCounter.innerText = `Page ${currentPage} of ${totalPages}`;
    if (totalPages === 1) {
      prevBtn.disabled = true;
      nextBtn.disabled = true;
    }
    if (currentPage === 1) {
      prevBtn.disabled = true;
    } else if (currentPage > 1) {
      prevBtn.disabled = false;
    }
    if (currentPage === totalPages) {
      nextBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
    }

    results.results.forEach((result) => {
      const imgURL = result.poster_path
        ? global.posterImgBaseUrl + result.poster_path
        : '../images/no-image.jpg';
      const name = result.original_title
        ? result.original_title
        : result.original_name;
      const release = result.release_date
        ? result.release_date
        : result.first_air_date;
      const resultCard = document.createElement('div');
      resultCard.classList.add('card');
      resultCard.innerHTML = `
      <a href="${type}-details.html?id=${result.id}">
       <img src="${imgURL}" class="card-img-top" alt="${name}" />
      </a>
      <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${release}</small>
        </p>
      </div>
      `;
      document.querySelector('#search-results').append(resultCard);
    });
  });
};

const searchTerm = () => {
  const searchQuery = window.location.search.split('&');
  const type = searchQuery[0].split('=')[1];
  const term = searchQuery[1].split('=')[1];
  const prevBtn = document.querySelector('#prev');
  const nextBtn = document.querySelector('#next');
  let page = 1;
  fetchTermByPage(page, term, prevBtn, nextBtn, type);
  nextBtn.addEventListener('click', function () {
    document.querySelector('#search-results').innerHTML = '';
    page++;
    fetchTermByPage(page, term, prevBtn, nextBtn, type);
  });
  prevBtn.addEventListener('click', function () {
    document.querySelector('#search-results').innerHTML = '';
    page--;
    fetchTermByPage(page, term, prevBtn, nextBtn, type);
  });
};

const initApp = () => {
  const currentPath = global.currentPath;
  highlightLinks();
  console.log(currentPath);
  switch (currentPath) {
    case '/':
    case '/index.html':
      initSwiper();
      getNowPlaying();
      getPopularMovies();
      break;
    case '/shows.html':
      getPopularShows();
      break;
    case '/movie-details.html':
      getMovieDetails();
      break;
    case '/tv-details.html':
      getShowDetails();
      break;
    case '/search.html':
      searchTerm();
  }
};

initApp();
