// OUTDATED!

import h from 'virtual-element'; // REQUIRED!
import PropTypes from 'proptypes';
import Service from 'w4-converter-service'; // TODO
import HttpRequest from 'w4-converter-httpRequest'; // TODO
import HtmlToXml from 'w4-converter-htmlToXml'; // TODO

function Poc({ query, cfid, cftoken, __atuvc, pageNumber }) {
  return (
    <Service name={`searchResult_${pageNumber}`}>
      <HttpRequest
        name="rawHtml"
        contentType="text/html"
        url=""
        method="GET"
        body={{ query, 'Go.x': 34, 'Go.y': 16 }}
        cookies={{
          CFID: cfid,
          CFTOKEN: cftoken,
          DEEPCHK: 1,
          __atuvc,
        }}
      />

      <HtmlToXml name="output" from="rawHtml">
        <articles el=".articles">
          {(el) => {
            const newData = `something_${el.id}`;

            return (
              <div>{newData}</div>
            );
          }}
        </articles>
      </HtmlToXml>
    </Service>
  );
}

Poc.propTypes = {
  query: PropTypes.string,
  cfid: PropTypes.string,
  cftoken: PropTypes.string,
  __atuvc: PropTypes.string,
  pageNumber: PropTypes.number,
};

export default Poc;
