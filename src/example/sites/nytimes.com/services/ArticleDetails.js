import WebMiddle, { PropTypes } from 'webmiddle';
import Pipe from 'webmiddle-service-pipe';
import HttpRequest from 'webmiddle-service-http-request';
import HtmlToJson, { helpers } from 'webmiddle-service-cheerio-to-json';

const {
  elText, elAttr, elMap, elJoin, elPipe,
} = helpers;

function ArticleDetails({ url }) {
  return (
    <Pipe>
      <HttpRequest
        name="rawHtml"
        contentType="text/html"
        url={url}
      />

      {({ rawHtml }) =>
        <HtmlToJson name="articleDetails" from={rawHtml}>
          <article el="article">
            <category el="header .kicker-label">{elText()}</category>

            <title el="header #headline">{elText()}</title>
            <date el="header time">{elAttr('datetime')}</date>

            <text el=".story-body p">
              {elPipe([
                elMap(elText()),
                elJoin('\n\n'),
              ])}
            </text>
          </article>
        </HtmlToJson>
      }
    </Pipe>
  );
}

ArticleDetails.propTypes = {
  url: PropTypes.string.isRequired,
};

export default ArticleDetails;
