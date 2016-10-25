import parentConfig from '../../../sites/foxnews.com/config';
import Meta from './Meta';
import SearchArticles from './SearchArticles';
import ArticleDetails from './ArticleDetails';

export default {
  name: 'foxnews.com',
  config: parentConfig,
  services: {
    Meta,
    SearchArticles,
    ArticleDetails,
  },
};
