import { assert } from 'chai';

import BabelParser from '../../src/BabelParser';

suite('babel-parser:', () =>
{
   suite('BabelParser:', () =>
   {
      test('parseFile function is exported', () =>
      {
         assert.isFunction(BabelParser.parseFile);
      });

      test('parseSource function is exported', () =>
      {
         assert.isFunction(BabelParser.parseSource);
      });

      test('parseFile - ES6', () =>
      {
         const ast = BabelParser.parseFile('./test/fixture/es6.js');
         assert.isObject(ast);
         assert.strictEqual(ast.type, 'File');
      });

      test('parseFile - Typescript', () =>
      {
         const ast = BabelParser.parseFile('./test/fixture/typescript.ts');
         assert.isObject(ast);
         assert.strictEqual(ast.type, 'File');
      });

      test('parseFile - No flow override', () =>
      {
         assert.throws(() =>
         {
            BabelParser.parseFile('./test/fixture/flow.js');
         });
      });

      test('parseFile - Flow override', () =>
      {
         const ast = BabelParser.parseFile('./test/fixture/flow.js', void 0, { flow: true });
         assert.isObject(ast);
         assert.strictEqual(ast.type, 'File');
      });

      test('parseSource - ES6', () =>
      {
         const ast = BabelParser.parseSource('export default class Foo { constructor() { } }');
         assert.isObject(ast);
         assert.strictEqual(ast.type, 'File');
      });

      test('parseSource - Typescript', () =>
      {
         const ast = BabelParser.parseSource('function fooGood<T extends { x: number }>(obj: T): T { console.log(Math.abs(obj.x)); return obj; }');
         assert.isObject(ast);
         assert.strictEqual(ast.type, 'File');
      });

      test('parseSource - No flow override', () =>
      {
         assert.throws(() =>
         {
            BabelParser.parseSource('function fooGood<T: { x: number }>(obj: T): T { console.log(Math.abs(obj.x)); return obj; }');
         });
      });

      test('parseSource - Flow override', () =>
      {
         const ast = BabelParser.parseSource('function fooGood<T: { x: number }>(obj: T): T { console.log(Math.abs(obj.x)); return obj; }', void 0, { flow: true });
         assert.isObject(ast);
         assert.strictEqual(ast.type, 'File');
      });
   });
});
