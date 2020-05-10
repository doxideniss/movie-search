import search from './js/search';
import cards from './js/cards';
import createDOMNode from './js/utils/createDOMNode';

const START_VALUE = 'Dream';

const createHeader = (parent) => {
  const logo = createDOMNode('a', 'header__logo', 'Movie search', null, ['href', '/']);
  createDOMNode('header', 'header', logo, parent);
};

const createFooter = (parent) => {
  const githubLink = createDOMNode('a', 'footer__github-link', 'doxideniss', null, ['href', 'https://github.com/doxideniss']);
  createDOMNode('footer', 'footer', [
    createDOMNode('div', 'footer__copyright', 'RS School 2020q1'),
    createDOMNode('div', 'footer__github', githubLink),
  ], parent);
};

window.onload = () => {
  const content = createDOMNode('div', 'content');
  const wrapper = createDOMNode('div', 'wrapper');
  createHeader(wrapper);
  search.init(content);
  cards.init(content);
  search.getMovies(START_VALUE);
  wrapper.append(content);
  createFooter(wrapper);
  document.body.append(wrapper);
};
