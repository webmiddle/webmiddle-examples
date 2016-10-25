import WebMiddle, { PropTypes } from 'webmiddle';
import Parent from '../../../sites/foxnews.com/services/ArticleDetails';
import Pipe from 'webmiddle-service-pipe';
import { getFormattedDate } from '../../utils';

function fixArticle(article) {
  return {
    ...article,
    date: getFormattedDate(new Date(article.date)),
  };
}

function ArticleDetails({ webmiddle, options, ...rest }) {
  return (
    <Pipe>
      <Parent
        {...rest}
        name="page"
      />

      {({ page }) => ({
        name: 'articleDetails',
        contentType: 'application/json',
        content: fixArticle(page.content.root.article),
      })}
    </Pipe>
  );
}

ArticleDetails.propTypes = {
  webmiddle: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
};

export default ArticleDetails;
