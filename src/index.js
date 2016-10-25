// WebMiddle

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error instanceof Error ? error.stack : error);
});

import WebMiddle from 'webmiddle';

/*
async function evaluateVirtual(virtual, options = {}) {
  const parameters = options.parameters || {};

  let result;
  if (virtual.type === 'function') {
    // sub virtual module
    const subFactory = virtual.type;
    const resources = virtual.attributes.resources || parameters.resources || [];
    const w4 = virtual.attributes.w4 || parameters.w4; // TODO: required
    result = subFactory({ ...virtual.attributes, resources, w4 });
    // recursive
    result = await evaluateValue(result, {
      ...options,
      parameters: { ...parameters, resources, w4 },
    });
  } else {
    // as is
    result = virtual;
  }

  return result;
}

function evaluateValue(value, options = {}) {
  const parameters = options.parameters || {};

  let result;
  if (typeof value === 'function' && options.dontEvaluateFunctions !== true) {
    result = value(parameters);
  } else {
    result = value;
  }

  return Promise.resolve(result).then(result => {
    if (isVirtual(result)) {
      return evaluateVirtual(result, options);
    }

    return result;
  });
}

function evaluateAttribute(virtual, attributeName, options = {}) {
  const attributeValue = virtual.attributes[attributeName];
  return evaluateValue(attributeValue, options);
}

// @param path e.g. "resources.item"
function evaluateChildrenPath(virtual, path, options = {}) {
  const pathParts = path.split('.');

  let currentVirtual = virtual;
  for (const aPath of pathParts) {
    let nextVirtual;

    for (const aChildren of currentVirtual.children) {
      const childrenValue = evaluateValue(aChildren, options);
      if (isVirtual(childrenValue) && childrenValue.type === aPath) {
        // found!
        nextVirtual = childrenValue;
        break;
      }
    }

    if (!nextVirtual) return null; // not found
    currentVirtual = nextVirtual;
  }
}


import find from 'lodash.find';

async function findHandler(virtual, parameters) {
  const handlersSpec = parameters.w4.handlers;

  const handler = await evaluateAttribute(virtual, 'handler', {
    parameters,
    dontEvaluateFunctions: true,
  });

  if (typeof handler === 'function') {
    return handler;
  }

  let handlerSpec;

  if (typeof handler === 'string') {
    handlerSpec = find(handlersSpec, h => h[0].name === handler);
  } else {
    const fromResource = await evaluateAttribute(virtual, 'from', { parameters });
    if (fromResource) {
      const toContentType = await evaluateAttribute(virtual, 'contentType', { parameters });
      handlerSpec = find(handlersSpec, h =>
        h[0].from === fromResource.contentType && h[0].to === toContentType
      );
    }
  }

  return handlerSpec ? handlerSpec[1] : null;
}

// resource type
// { name : String, contentType : String, content : * }

// TODO

async function rootHandler(virtual, parameters) {
  const resourceVirtuals = virtual.children[0].children;
  for (const resourceVirtual of resourceVirtuals) {
    const handler = await findHandler(resourceVirtual, parameters);
    if (!handler) {
      return Promise.reject(
        new Error(`No handler for ${resourceVirtual.attributes['name']}`)
      );
    }

    const resource = await handler(resourceVirtual, parameters);
    if (resource) {
      // add resource
      parameters.resources[resource.name] = resource;
    }
  }

  return parameters.resources['output'] || null;
}

function networkConverter(virtual, parameters) {
  console.log('networkConverter', virtual.attributes['name'], JSON.stringify(virtual));
}
function htmlToXmlConverter(virtual, parameters) {}
function xmlToXmlConverter(virtual, parameters) {}

class W4 {
  constructor() {
    this.handlers = {};
    this.api = {};
  }

  call(endpoint, parameters) {
    const service = this.api[endpoint];
    if (typeof service === 'undefined') {
      return Promise.reject(new Error('The service does not exist.'));
    }

    parameters = {
      ...parameters,
      resources: parameters.resources || {},
      w4: this,
    };

    const serviceResult = service(parameters);
    return Promise.resolve(serviceResult).then(async serviceResult => {
      if (isVirtual(serviceResult)) {
        serviceResult = await rootHandler(serviceResult, {
          resources: parameters.resources,
          w4: parameters.w4,
        });
      }

      return serviceResult;
    });
  }
}
*/

// W4 USER

/*
import Poc from './services/poc';

const mySite = new W4();

mySite.handlers = [
  [{ from: 'text/html', to: 'text/xml' }, htmlToXmlConverter],
  [{ from: 'text/xml', to: 'text/xml' }, xmlToXmlConverter],
  [{ name: 'network' }, networkConverter],
];

mySite.api = {
  '/poc': Poc,
};
*/

// SITE USER

/*mySite.call('/poc', {
  pageNumber: 6,
})
.then(pocResource => {
  console.log('pocResource', pocResource);
});*/

import cheerio from 'cheerio';

const $ = cheerio.load(`
  <h2 class="title">Hello world</h2>
  <input type="text" value="Test input" />
  <input type="text" value="Other input" />
`);

$('h2.title').text('Hello there!');
$('h2').addClass('welcome');

function elMap(callback) {
  return (el, $) => el.map((i, currDomEl) => callback($(currDomEl)));
}
function elJoin(separator) {
  return el => el.get().join(separator);
}
function elPipe(tasks) {
  return (el, $) => tasks.reduce((currValue, task) => task(currValue, $), el);
}

let el = $("input[type='text']");

let mapTask = elMap(el => el.attr('type'));
let joinTask = elJoin(', ');
let task = elPipe([
  mapTask,
  joinTask,
]);

//console.log( task(el, $) );


//////

import HttpRequest from 'webmiddle-service-http-request';

/*HttpRequest({
  name: 'example',
  contentType: 'text/html',
  url: 'https://example.com/api/end/point?test=true',
  method: 'POST',
  body: { test: 2 },
})
.then(resource => {
  console.log('Resource', resource);
});*/

//////

import Browser from 'webmiddle-service-browser';

/*
Browser({
  name: 'example',
  contentType: 'text/html',
  url: 'https://example.com/',
  method: 'POST',
  body: { test: 2 },
  waitFor: 'h1',
})
.then(resource => {
  console.log('Resource', resource);
});*/

////

import Pipe from 'webmiddle-service-pipe';
import path from 'path';

// TODO: move this into the new-search (based on site)
const giveupErrorCodes = [410];
function isRetriable(err) {
  return !(err instanceof Error && err.name === 'HttpError') ||
    giveupErrorCodes.indexOf(err.statusCode) === -1;
}

const webmiddle = new WebMiddle({
  settings: {
    outputBasePath: path.resolve(__dirname, '../output'),
    verbose: false,
    network: {
      retries: (err) => {
        if (!isRetriable(err)) return 0;
        return -1;
      },
    },
  },
});

/*
webmiddle.evaluate((
  <Pipe>
    <HttpRequest
      name="example"
      contentType="text/html"
      url="https://example.com/"
      method="GET"
    />

    {({ example }) => (
      <Browser
        name="exampleWeb"
        contentType="text/html"
        url="https://example.com/"
        method="GET"
      />
    )}
  </Pipe>
))
.then(resource => {
  console.log('Resource', resource);
});*/

////

import Parallel from 'webmiddle-service-parallel';

/*
webmiddle.evaluate((
  <Pipe>
    <Parallel name="mySites">
      <Browser
        name="exampleWeb"
        contentType="text/html"
        url="https://example.com/"
        method="GET"
      />

      <HttpRequest
        name="example"
        contentType="text/html"
        url="https://example.com/"
        method="GET"
      />
    </Parallel>
  </Pipe>
))
.then(resource => {
  console.log('Resource', resource);
});
*/

////

//import HtmlToXml from './handlers/CheerioToXml';
//import elText from './handlers/CheerioToXml/helpers/elText';

/*
callVirtual((
  <Pipe>
    <HttpRequest
      name="example"
      contentType="text/html"
      url="https://example.com/"
      method="GET"
    />

    {({ example }) =>
      <HtmlToXml name="test" from={example}>
        <title el="h1">{elText()}</title>
      </HtmlToXml>
    }
  </Pipe>
))
.then(resource => {
  console.log('Resource', resource);
});*/

////

import ArticleDetails from './example/sites/foxnews.com/services/ArticleDetails';
import fs from 'fs';

/*webmiddle.evaluate((
  <ArticleDetails
    url="http://www.foxnews.com/science/2016/05/05/meteor-shower-spawned-by-halleys-comet-peaks-this-week.html"
  />
), {
  expectResource: true,
})
.then(resource => {
  console.log('Resource', resource);

  fs.writeFile('./output/articledetails.json', JSON.stringify(resource.content, null, 2), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  }); 

});*/

////

/*import SearchArticles from './example/sites/foxnews.com/services/SearchArticles';

webmiddle.evaluate((
  <SearchArticles
    name="searchArticles"
    query="science"
    pageNumber={0}
  />
), {
  expectResource: true,
})
.then(resource => {
  console.log('Resource', resource);

  fs.writeFile('./output/searchArticles.json', JSON.stringify(resource.content, null, 2), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  }); 

});*/

////

import SearchArticles from './example/sites/nytimes.com/services/SearchArticles';

const searchPrivateJson = JSON.parse(fs.readFileSync(
  path.resolve(__dirname, '../search.private.json')
));

/*webmiddle.evaluate((
  <SearchArticles
    name="searchArticles"
    query="science"
    pageNumber={0}
    startYear={2007}
    apiKey={searchPrivateJson.nytimesApiKey}
  />
), {
  expectResource: true,
})
.then(resource => {
  console.log('Resource', resource);

  fs.writeFile('./output/searchArticles.json', JSON.stringify(resource.content, null, 2), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
})*/

////

/*import JSONSelectToVirtual from 'webmiddle-service-jsonselect-to-virtual';
import JSONSelectToJson from 'webmiddle-service-jsonselect-to-json';

webmiddle.evaluate((
  <Pipe>
    <HttpRequest
      name="rawJson"
      contentType="application/json"
      url="https://raw.githubusercontent.com/tamingtext/book/master/apache-solr/example/exampledocs/books.json"
    />

    {({ rawJson }) =>
      <JSONSelectToJson
        name="virtual"
        from={rawJson}
        fullConversion="true"
      />
    }
  </Pipe>
), {
  expectResource: true,
})
.then(resource => {
  console.log('Resource', resource);

  fs.writeFile('./output/books.json', JSON.stringify(resource.content, null, 2), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
});
*/

////

import CheerioToVirtual from 'webmiddle-service-cheerio-to-virtual';
import CheerioToJson from 'webmiddle-service-cheerio-to-json';
import VirtualToJson from 'webmiddle-service-virtual-to-json';

/*
webmiddle.evaluate((
  <Pipe>
    <HttpRequest
      name="example"
      contentType="text/html"
      url="https://example.com/"
      method="GET"
    />

    {({ example }) =>
      <CheerioToJson name="json" from={example}>
        <title el="h1">{elText()}</title>
      </CheerioToJson>
    }
  </Pipe>
), {
  expectResource: true,
})
.then(resource => {
  console.log('Resource', resource);

  fs.writeFile('./output/json.json', JSON.stringify(resource.content, null, 2), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
});
*/

/*
import Main from './example/news-search/Main';

webmiddle.evaluate((
  <Main
    sites={['foxnews.com', 'nytimes.com']}
    query="genetic programming"
    startYear={2007}
    nytimesApiKey={searchPrivateJson.nytimesApiKey}
  />
), {
  expectResource: true,
})
.then(resource => {
  console.log('Resource', resource);

  fs.writeFile('./output/main.json', JSON.stringify(resource.content, null, 2), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
})
*/

import newsSearch from './example/news-search';

newsSearch();
