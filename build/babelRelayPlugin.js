const getBabelRelayPlugin = require('babel-relay-plugin');
const schema = require('../server/graphql/schema.json');

module.exports = getBabelRelayPlugin(schema.data);
