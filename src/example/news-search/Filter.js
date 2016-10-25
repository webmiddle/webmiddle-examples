import WebMiddle, { PropTypes } from 'webmiddle';

function Filter({ articles, filters }) {
  return {
    ...articles,
    content: articles.content.filter(article => {
      if (!article.url) return false; // skip "fake" articles

      const year = parseInt(article.date.split(',')[1], 10); // "Jan 4, 2016" => 2016
      if (typeof year !== 'undefined') {
        if (typeof filters.startYear !== 'undefined' && year < filters.startYear) return false;
        if (typeof filters.endYear !== 'undefined' && year > filters.endYear) return false;
      }
      return true;
    }),
  };
}

Filter.propTypes = {
  articles: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
};

export default Filter;
