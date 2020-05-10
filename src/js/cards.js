import Swiper from 'swiper';
import createDOMNode from './utils/createDOMNode';
import fetching from './fetching';

const DEFAULT_PLACEHOLDER_IMAGE = 'https://748073e22e8db794416a-cc51ef6b37841580002827d4d94d19b6.ssl.cf3.rackcdn.com/not-found.png';

export default {
  container: null,
  wrapper: null,
  swiper: null,
  searchText: null,
  page: 1,
  init(parent) {
    this.wrapper = createDOMNode('div', 'movies__wrapper swiper-wrapper');
    this.container = createDOMNode('div', 'movies swiper-container', [
      this.wrapper,
      createDOMNode('div', 'swiper-pagination'),
      createDOMNode('div', 'swiper-button-prev'),
      createDOMNode('div', 'swiper-button-next'),
    ], parent);
    this.addHandlers();
  },
  clearWrapper() {
    this.wrapper.innerHTML = '';
  },
  addHandlers() {
    this.container.querySelector('.swiper-button-next').addEventListener('click', this.checkProgressSlides);
    this.container.querySelector('.swiper-wrapper').addEventListener('mouseup', () => {
      this.checkProgressSlides();
    });
    this.container.querySelector('.swiper-wrapper').addEventListener('touchend', () => {
      this.checkProgressSlides();
    });
    this.container.querySelector('.swiper-pagination').addEventListener('click', (e) => {
      if (e.target.classList.contains('swiper-pagination-bullet')) {
        this.checkProgressSlides();
      }
    });
  },
  async checkProgressSlides() {
    console.log(this.swiper.progress);
    if ((this.swiper.progress > 0.6 && this.swiper.slides.length < 30)
      || this.swiper.progress > 0.8) {
      this.loadManyMovies();
    }
  },
  async loadManyMovies() {
    this.page += 1;
    const data = await fetching.getMoviesData(this.searchText, this.page);
    if (data.Search) {
      const promises = data.Search.map(async (movie) => {
        const dataRate = await fetching.getMovieRate(movie.imdbID);

        return {
          ...movie,
          Rate: dataRate.imdbRating,
        };
      });
      const movies = await Promise.all(promises);

      this.setMovies(movies);
    }
  },
  setSearchTextAndPage(value) {
    this.searchText = value;
    this.page = 1;
  },
  setMovies(movies) {
    movies.forEach((movie) => {
      const poster = movie.Poster === 'N/A' ? DEFAULT_PLACEHOLDER_IMAGE : movie.Poster;
      createDOMNode('div', 'movies__element swiper-slide', [
        createDOMNode('h2', 'movies__title', createDOMNode('a', null, movie.Title, null, ['href', `https://www.imdb.com/title/${movie.imdbID}/videogallery/`])),
        createDOMNode('div', 'movies__img', createDOMNode('img', null, null, null, ['src', poster], ['alt', movie.Title])),
        createDOMNode('div', 'movies__year', movie.Year),
        createDOMNode('div', 'movies__rate', movie.Rate),
      ],
      this.wrapper);
    });
    if (this.swiper === null) {
      this.swiper = new Swiper('.swiper-container', {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 20,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        setWrapperSize: true,
        breakpoints: {
          320: {
            slidesPerView: 1,
            slidesPerGroup: 1,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 30,
            slidesPerGroup: 2,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 35,
            slidesPerGroup: 3,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
        },
      });
    } else {
      this.swiper.update();
    }
  },
};
