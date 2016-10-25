import parentConfig from '../../../sites/nytimes.com/config';
import Meta from './Meta';
import SearchArticles from './SearchArticles';
import ArticleDetails from './ArticleDetails';

export default {
  name: 'nytimes.com',
  config: parentConfig,
  services: {
    Meta,
    SearchArticles,
    ArticleDetails,
  },
};
