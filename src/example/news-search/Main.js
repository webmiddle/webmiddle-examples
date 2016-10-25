import WebMiddle, { PropTypes } from 'webmiddle';
import Pipe from 'webmiddle-service-pipe';
import Parallel from 'webmiddle-service-parallel';
import MergeArticles from './MergeArticles';
import SiteMain from './SiteMain';
import siteHandlers from './sites';

function Main({ webmiddle, options, ...rest }) {
  const { sites } = rest;
  return (
    <Pipe>
      <Parallel name="articlesBySite">
        {sites.map(siteName => {
          const siteHandler = siteHandlers[siteName];
          return (
            <SiteMain {...rest} site={siteHandler} name={siteName} />
          );
        })}
      </Parallel>

      {({ articlesBySite }) =>
        <MergeArticles name="articles" articlesBySite={articlesBySite} />
      }
    </Pipe>
  );
}

Main.propTypes = {
  nytimesApiKey: PropTypes.string,
  sites: PropTypes.array.isRequired,
  query: PropTypes.string.isRequired,
  startYear: PropTypes.number,
  endYear: PropTypes.number,
  webmiddle: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
};

export default Main;
