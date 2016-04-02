// Include the tests here...
import { generateSchema } from '../../../apollo/apollo-server/src';
import resolveFunctions from '../src/resolvers.js';
import { assert } from 'chai';
import { graphql } from '../../../apollo/apollo-server/node_modules/graphql';

import { readFileSync } from 'fs';
const typeDefinition = readFileSync('./src/schema.gql');


describe('Reading files', () => {
  it('Can read a simple file', (done) => {
    const schema = generateSchema(typeDefinition, resolveFunctions);
    const query = '{ file(path: "./test/sample.txt"){ content } }'; 
    const expected = { data: { file: { content: "Hello world!\n" } } };
    graphql(schema, query).then( (res) => {
      console.log(res);
      assert.deepEqual(res, expected);
      done();
    });
  });
});
