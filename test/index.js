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
      assert.deepEqual(res, expected);
      done();
    });
  });

  it('Can get file size', (done) => {
    const schema = generateSchema(typeDefinition, resolveFunctions);
    const query = '{ file(path: "./test/sample.txt"){ size } }'; 
    const expected = { data: { file: { size: 13 } } };
    graphql(schema, query).then( (res) => {
      assert.deepEqual(res, expected);
      done();
    });
  });

  it('Can get name and path', (done) => {
    const schema = generateSchema(typeDefinition, resolveFunctions);
    const query = '{ file(path: "./test/sample.txt"){ name, path } }'; 
    const path = '/Users/helfer/workspace/helfer/graphql-fs/test/sample.txt';
    const expected = { data: { file: { name: 'sample.txt', path: path } } };
    graphql(schema, query).then( (res) => {
      assert.deepEqual(res, expected);
      done();
    });
  });
});

describe('Reading directories', () => {
  it('Can find a directory and get the path and name', (done) => {
    const schema = generateSchema(typeDefinition, resolveFunctions);
    const query = '{ dir(path: "./test/"){ path name} }'; 
    const path = '/Users/helfer/workspace/helfer/graphql-fs/test/';
    const expected = { data: { dir: { path: path, name: 'test' } } };
    graphql(schema, query).then( (res) => {
      assert.deepEqual(res, expected);
      done();
    });
  });

  it('Can find a directory and list its contents', (done) => {
    const schema = generateSchema(typeDefinition, resolveFunctions);
    const query = '{ dir(path: "./test/"){ files { name }, subdirectories { name } } }'; 
    const path = '/Users/helfer/workspace/helfer/graphql-fs/test/';
    const expected = { data: 
      { dir: 
        { 
          files: [
            { name: 'babel-index.js' },
            { name: 'index.js' },
            { name: 'sample.txt' },
          ],
          subdirectories: [
            { name: 'uga' },
          ]
        },
      } 
    };
    graphql(schema, query).then( (res) => {
      assert.deepEqual(res, expected);
      done();
    });
  });
});
