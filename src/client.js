'use strict';

const createHttpClient = require('./http-client.js');
const createEntryLoader = require('./entry-loader.js');

const CDA = 'cdn';
const CPA = 'preview';

module.exports = createClient;

function createClient (config) {
  return {
    getContentTypes: function () {
      return createContentfulClient(CDA, config)
      .get('/content_types', {limit: 1000})
      .then(res => res.items);
    },
    createEntryLoader: function () {
      const api = config.preview ? CPA : CDA;
      return createEntryLoader(createContentfulClient(api, config));
    }
  };
}

function createContentfulClient (api, config) {
  const protocol = config.secure !== false ? 'https' : 'http';
  const domain = config.domain || 'contentful.com';

  const token = {
    [CDA]: config.cdaToken,
    [CPA]: config.cpaToken,
  }[api];

  const defaultParams = {};
  if ([CDA, CPA].includes(api) && config.locale) {
    defaultParams.locale = config.locale;
  }

  return createHttpClient({
    base: `${protocol}://${api}.${domain}/spaces/${config.spaceId}`,
    headers: {Authorization: `Bearer ${token}`},
    defaultParams
  });
}
