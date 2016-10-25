import WebMiddle, { PropTypes } from 'webmiddle';
import Parent from '../../../sites/foxnews.com/services/SearchArticles';
import Pipe from 'webmiddle-service-pipe';

function SearchArticles({ webmiddle, options, ...rest }) {
  return (
    <Pipe>
      <Parent
        {...rest}
        name="page"
      />

      {({ page }) => ({
        name: 'searchArticles',
        contentType: 'application/json',
        content: page.content.root.articles.map(article => article.article),
      })}
    </Pipe>
  );
}

SearchArticles.propTypes = {
  webmiddle: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
};

export default SearchArticles;
