import WebMiddle, { PropTypes } from 'webmiddle';
import _ from 'lodash';

// null, undefined or empty string
function isInvalid(value) {
  return _.isNil(value) || (_.isString(value) && _.isEmpty(value));
}

async function Merge({ sources, webmiddle, options }) {
  sources = await Promise.all(sources.map(s => webmiddle.evaluate(s, {
    ...options,
    expectResource: true,
  })));
  return {
    ...sources[0],
    content: _.mergeWith({}, ...sources.map(s => s.content), (objValue, srcValue) => {
      // don't override valid values with invalid values
      // RATIONALE EXAMPLE:
      // SearchArticles finds category, while ArticleDetails does not,
      // in such a case the found category would be replaced with null
      if (!isInvalid(objValue) && isInvalid(srcValue)) return objValue;
      return undefined; // default behaviour
    }),
  };
}

Merge.propTypes = {
  sources: PropTypes.array.isRequired, // of resources
  webmiddle: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
};

export default Merge;
