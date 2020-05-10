import createDOMNode from './utils/createDOMNode';
import cards from './cards';
import fetching from './fetching';

export default {
  value: '',
  field: null,
  clearBtn: null,
  button: null,
  spinner: null,
  errorBox: null,
  isLoading: false,
  init(parent) {
    this.field = createDOMNode('input', 'search__field', null, null, ['placeholder', 'Search movie'], ['autocomplete', 'off'], ['autofocus', '']);
    this.clearBtn = createDOMNode('div', 'search__clear-btn', 'Clear', null);
    this.button = createDOMNode('button', 'search__btn', 'Search', null, ['type', 'submit']);
    this.spinner = createDOMNode('div', 'search__spinner search__spinner_hide', createDOMNode('div', 'loader'));

    const searchBox = createDOMNode('div', 'search__box', [
      this.field,
      this.spinner,
      this.clearBtn,
      this.button]);
    this.errorBox = createDOMNode('div', 'search__err');

    createDOMNode('div', 'search', [
      searchBox,
      this.errorBox], parent);
    this.addHandlers();
  },
  addHandlers() {
    this.field.addEventListener('input', (e) => {
      this.value = e.target.value;
    });
    this.field.addEventListener('keyup', (e) => {
      if (e.code === 'Enter') {
        this.page = 1;
        this.getMovies(this.value);
      }
    });
    this.button.addEventListener('click', () => {
      this.page = 1;
      this.getMovies(this.value);
    });
    this.clearBtn.addEventListener('click', () => {
      this.value = '';
      this.field.value = '';
    });
  },
  async getMovies(value) {
    if (!this.isLoading && value !== '') {
      let searchText = value;

      if (/[а-я]/i.test(value)) {
        searchText = await fetching.getTranslate(value);
      }

      cards.clearWrapper();

      this.isLoading = true;
      this.spinner.classList.remove('search__spinner_hide');
      cards.container.classList.add('movies_hide');

      const data = await fetching.getMoviesData(searchText, 1);

      this.isLoading = false;
      this.spinner.classList.add('search__spinner_hide');

      if (data.Search) {
        const movies = await this.getMoviesRate(data.Search);
        cards.setSearchTextAndPage(searchText);
        cards.setMovies(movies);
        this.errorBox.innerHTML = `Showing results for ${searchText}`;

        cards.container.classList.remove('movies_hide');
      } else {
        this.errorBox.innerHTML = `No results for ${searchText}`;
      }
    }
  },
  async getMoviesRate(movies) {
    const promises = movies.map(async (movie) => {
      const data = await fetching.getMovieRate(movie.imdbID);

      return {
        ...movie,
        Rate: data.imdbRating,
      };
    });
    const newMovies = await Promise.all(promises);
    return newMovies;
  },
};
