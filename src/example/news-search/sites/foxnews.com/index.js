import WebMiddle from 'webmiddle';
import parentConfig from '../../../sites/foxnews.com/config';
import Meta from './Meta';
import SearchArticles from './SearchArticles';
import ArticleDetails from './ArticleDetails';

export default new WebMiddle({
  name: 'foxnews.com',
  settings: parentConfig,
  services: {
    Meta,
    SearchArticles,
    ArticleDetails,
  },
});
