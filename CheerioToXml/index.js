import { PropTypes, isVirtual } from 'webmiddle';
import cheerio from 'cheerio';

// Note: virtual.type must be a string
async function processVirtual(virtual, sourceEl, source, context) {
  let el = virtual.attributes.el;
  if (!el) {
    el = sourceEl;
  } else if (typeof el === 'string') {
    el = sourceEl.find(el);
  }

  const condition = virtual.attributes.condition;
  if (condition) {
    if (typeof condition !== 'function') {
      throw new Error(`condition must be a function: ${JSON.stringify(condition)}`);
    }
    el.filter((i, currDomEl) => condition(source(currDomEl)));
  }

  const childrenRawXml = await Promise.all(
    virtual.children.map(child => process(child, el, source, context))
  );

  return `
    <${virtual.type}>
      ${childrenRawXml.join('\n')}
    </${virtual.type}>
  `;
}

// @return raw xml conversion of value
async function process(value, sourceEl, source, context) {
  let result = await context.extend({
    expectResource: false,
    functionParameters: [sourceEl, source],
  }).evaluate(value);

  if (isVirtual(result)) {
    // virtual type is not a function,
    // otherwise it would have been evaluated
    result = await processVirtual(result, sourceEl, source, context);
  } else if (Array.isArray(result)) {
    // recursion
    result = await Promise.all(
      result.map(r => process(r, sourceEl, source, context))
    );
    // treat each element as a separate child
    result = result.join('\n');
  } else if (typeof result === 'object' && result !== null) {
    throw new Error(`Objects are not supported: ${result}`);
  } else {
    // keep result as is (stringified)
    if (typeof result === 'undefined') result = null;
    result = JSON.stringify(result);

    // split cdata end sequence
    // http://stackoverflow.com/a/223782
    result = '<![CDATA[' + result.split(']]>').join(']]"]]><![CDATA[">') + ']]>';
  }

  return result;
}

const CheerioToXml =
async ({ name, from, children }, context) => {
  // parse html or xml
  const source = cheerio.load(from.content, {
    xmlMode: from.contentType === 'text/xml',
  });

  const childrenRawXml = await Promise.all(
    children.map(child => process(child, source.root(), source, context))
  );

  const target = cheerio.load(`
    <${name}>
      ${childrenRawXml.join('\n')}
    </${name}>
  `, {
    xmlMode: true,
  });

  return { name, contentType: 'text/xml', content: target.xml().trim() };
};

CheerioToXml.propTypes = {
  name: PropTypes.string.isRequired,
  from: PropTypes.object.isRequired, // resource
};

export default CheerioToXml;
