const { readFileSync } = require('fs');
const { join } = require("path");
// we must convert the file Buffer to a UTF-8 string
const typeDefs = readFileSync(join(__dirname, 'schema.gql')).toString('utf-8');
exports.default = typeDefs;