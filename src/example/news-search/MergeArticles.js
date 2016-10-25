import WebMiddle, { PropTypes } from 'webmiddle';
import _ from 'lodash';

function MergeArticles({ articlesBySite }) {
  const articlesContent = [];

  _.forEach(articlesBySite.content, (siteArticles, siteName) => {
    const articlesContentToPush = siteArticles.content.map(articleContent => ({
      ...articleContent,
      source: siteName,
    }));
    articlesContent.push(...articlesContentToPush);
  });

  return {
    name: 'articles',
    contentType: 'application/json',
    content: articlesContent,
  };
}

MergeArticles.propTypes = {
  articlesBySite: PropTypes.object.isRequired, // of resources
};

export default MergeArticles;
