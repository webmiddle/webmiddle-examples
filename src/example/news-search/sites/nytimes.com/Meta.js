import WebMiddle, { PropTypes } from 'webmiddle';
import Parent from '../../../sites/nytimes.com/services/SearchArticles';
import Pipe from 'webmiddle-service-pipe';
import parentConfig from '../../../sites/nytimes.com/config';

function Meta({ nytimesApiKey, webmiddle, options, ...rest }) {
  return (
    <Pipe>
      <Parent
        {...rest}
        name="firstPage"
        pageNumber={0}
        apiKey={nytimesApiKey}
      />

      {({ firstPage }) => {
        const count = firstPage.content.root.response.meta.hits;
        return {
          name: 'meta',
          contentType: 'application/json',
          content: {
            count,
            numberOfPages: Math.ceil(count / parentConfig.resultsPerPage),
          },
        };
      }}
    </Pipe>
  );
}

Meta.propTypes = {
  nytimesApiKey: PropTypes.string.isRequired,
  webmiddle: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
};

export default Meta;
