import WebMiddle, { PropTypes } from 'webmiddle';
import Parent from '../../../sites/foxnews.com/services/SearchArticles';
import Pipe from 'webmiddle-service-pipe';

function Meta({ webmiddle, options, ...rest }) {
  return (
    <Pipe>
      <Parent
        {...rest}
        name="firstPage"
        pageNumber={0}
      />

      {({ firstPage }) => {
        const count = firstPage.content.root.count;
        return {
          name: 'meta',
          contentType: 'application/json',
          content: {
            count,
            numberOfPages: Math.ceil(count / webmiddle.setting('resultsPerPage')),
          },
        };
      }}
    </Pipe>
  );
}

Meta.propTypes = {
  webmiddle: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
};

export default Meta;
