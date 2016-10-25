// OUTDATED!

import h from 'virtual-element';
import PropTypes from 'proptypes';

function Poc({ query, cfid, cftoken, atuvc, pageNumber, resources }) {
  return (
    <service name={`searchResult_${pageNumber}`}>
      <resources>
        <item name="rawHtml" contentType="text/html" handler='network'>
          <url></url>
          <method>GET</method>
          <body contentType="application/x-www-form-urlencoded">
              <item>
                  <name>query</name>
                  <value>{query}</value>
              </item>
              <item>
                  <name>Go.x</name>
                  <value>34</value>
              </item>
              <item>
                  <name>Go.y</name>
                  <value>16</value>
              </item>
          </body>
          <cookies>
              <item>
                  <name>CFID</name>
                  <value>{cfid}</value>
              </item>
              <item>
                  <name>CFTOKEN</name>
                  <value>{cftoken}</value>
              </item>
              <item>
                  <name>DEEPCHK</name>
                  <value>1</value>
              </item>
              <item>
                  <name>__atuvc</name>
                  <value>{atuvc}</value>
              </item>
          </cookies>
        </item>
        <item name="output" contentType="text/xml" from={resources.rawHtml}>
          <articles el=".articles">
            {(el) => {
              const newData = `something_${el.id}`;

              return (
                <div>{newData}</div>
              );
            }}
          </articles>
        </item>
      </resources>
    </service>
  );
}

Poc.propTypes = {
  pageNumber: PropTypes.number,
  resources: PropTypes.array.isRequired,
};

export default Poc;
