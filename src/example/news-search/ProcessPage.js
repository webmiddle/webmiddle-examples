import WebMiddle, { PropTypes } from 'webmiddle';
import Pipe from 'webmiddle-service-pipe';
import ArrayMap from 'webmiddle-service-arraymap';
import Filter from './Filter';
import Merge from './Merge';

const createEmptyArticleDetails = () => ({
  name: 'articleDetails',
  contentType: 'application/json',
  content: {},
});

function ProcessPage({
  site, query, startYear, endYear, pageNumber, filters,
  webmiddle, options, ...rest,
}) {
  const SearchArticles = site.service('SearchArticles');
  const ArticleDetails = site.service('ArticleDetails');

  return (
    <Pipe>
      <SearchArticles
        {...rest}
        name="articles"
        query={query}
        startYear={startYear}
        endYear={endYear}
        pageNumber={pageNumber}
      />

      {({ articles }) =>
        <Filter
          name="filteredArticles"
          articles={articles}
          filters={filters}
        />
      }

      {({ filteredArticles }) =>
        <ArrayMap
          name="mergedArticleResources"
          array={filteredArticles.content}
          limit={1}
          callback={articleContent => (
            <Pipe>
              <ArticleDetails
                {...rest}
                name="articleDetails"
                url={articleContent.url}
                options={{
                  catch: createEmptyArticleDetails,
                }}
              />

              {() => ({
                name: 'article',
                contentType: 'application/json',
                content: articleContent,
              })}

              {({ article, articleDetails }) =>
                <Merge
                  name="mergedArticle"
                  sources={[article, articleDetails]}
                />
              }
            </Pipe>
          )}
        />
      }

      {/* Flatten the resource of resources */}
      {({ mergedArticleResources }) => ({
        name: 'mergedArticles',
        contentType: 'application/json',
        content: mergedArticleResources.content.map(r => r.content),
      })}

      {({ mergedArticles }) =>
        <Filter
          name="finalArticles"
          articles={mergedArticles}
          filters={filters}
        />
      }
    </Pipe>
  );
}

ProcessPage.propTypes = {
  site: PropTypes.object.isRequired,
  query: PropTypes.string.isRequired,
  startYear: PropTypes.number,
  endYear: PropTypes.number,
  pageNumber: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  webmiddle: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
};

export default ProcessPage;
