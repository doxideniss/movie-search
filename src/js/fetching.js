import keys from './keys/index';

const URL_OMDB = `https://www.omdbapi.com/?apikey=${keys.API_Key_OMDB}`;
const URL_YANDEX = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${keys.API_Key_YandexTranslate}`;

export default {
  async getMoviesData(searchText, page) {
    const url = `${URL_OMDB}&s=${searchText}&page=${page}`;

    const res = await fetch(url);
    const data = await res.json();

    return data;
  },
  async getMovieRate(id) {
    const url = `${URL_OMDB}&i=${id}`;

    const res = await fetch(url);
    const data = await res.json();

    return data;
  },
  async getTranslate(word) {
    const url = `${URL_YANDEX}&text=${word}&lang=ru-en`;

    const res = await fetch(url);
    const data = await res.json();

    return data.text[0];
  },
};
