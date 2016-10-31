// - login (repeat every X minutes)
// - fetch first results page, extract number of articles and number of pages.
// - for each page
//   - get the articles (summary)
//   - filter the articles (e.g. based on year)
//   - get the article details for each remaining article
//   - merge articles with their details to get the full article data.
//   - filter the articles another time (now we have the full info)
// - merge the resulting articles from each page into a single list.

import WebMiddle, { PropTypes } from 'webmiddle';
import Pipe from 'webmiddle-service-pipe';
import ArrayMap from 'webmiddle-service-arraymap';
import ProcessPage from './ProcessPage';
import _ from 'lodash';
import Resume from 'webmiddle-service-resume';

function SiteMain({ webmiddle, options, ...rest }) {
  const { site } = rest;
  const Meta = site.service('Meta');

  return (
    <Pipe>
      {/*
      <Login />
      */}

      <Meta
        {...rest}
        name="meta"
      />

      {({ meta }) =>
        <ArrayMap
          name="articlesByPage"
          array={_.range(meta.content.numberOfPages)}
          limit={1}
          callback={i => (
            <Resume savePath={`./${site.name}/articles_${i}`}>
              <ProcessPage
                {...rest}
                name={i}
                pageNumber={i}
                filters={rest}
              />
            </Resume>
          )}
        />
      }

      {({ articlesByPage }) => ({
        name: 'articles',
        contentType: 'application/json',
        content: [].concat(...articlesByPage.content.map(r => r.content)),
      })}
    </Pipe>
  );
}

SiteMain.propTypes = {
  site: PropTypes.object.isRequired,
  query: PropTypes.string.isRequired,
  startYear: PropTypes.number,
  endYear: PropTypes.number,
  webmiddle: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
};

export default SiteMain;
