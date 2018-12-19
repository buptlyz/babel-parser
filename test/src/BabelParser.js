import { assert } from 'chai';

import BabelParser from '../../src/BabelParser';

suite('babel-parser:', () =>
{
   suite('BabelParser:', () =>
   {
      test('parse function is exported', () =>
      {
         assert.isFunction(BabelParser.parse);
      });

      test('parse - ES6', () =>
      {
         const ast = BabelParser.parse('export default class Foo { constructor() { } }');
         assert.isObject(ast);
         assert.strictEqual(ast.type, 'File');
      });

      test('parse - Typescript', () =>
      {
         const ast = BabelParser.parse('function fooGood<T extends { x: number }>(obj: T): T { console.log(Math.abs(obj.x)); return obj; }');
         assert.isObject(ast);
         assert.strictEqual(ast.type, 'File');
      });

      test('parse - Decorator before export throws', () =>
      {
         assert.throws(() =>
         {
            BabelParser.parse('@decorator export class MyClass {}');
         });
      });

      test('parse - Decorator before export with override', () =>
      {
         const ast = BabelParser.parse('@decorator export class MyClass {}', void 0, { decoratorsBeforeExport: true });
         assert.isObject(ast);
         assert.strictEqual(ast.type, 'File');
      });

      test('parse - No decorators legacy override', () =>
      {
         assert.throws(() =>
         {
            BabelParser.parse('class MyClass { @getDecorators().methods[name] foo() {} }');
         });
      });

      test('parse - Decorators legacy override', () =>
      {
         const ast = BabelParser.parse('class MyClass { @getDecorators().methods[name] foo() {} }', void 0, { decoratorsLegacy: true });
         assert.isObject(ast);
         assert.strictEqual(ast.type, 'File');
      });

      test('parse - No flow override', () =>
      {
         assert.throws(() =>
         {
            BabelParser.parse('function fooGood<T: { x: number }>(obj: T): T { console.log(Math.abs(obj.x)); return obj; }');
         });
      });

      test('parse - Flow override', () =>
      {
         const ast = BabelParser.parse('function fooGood<T: { x: number }>(obj: T): T { console.log(Math.abs(obj.x)); return obj; }', void 0, { flow: true });
         assert.isObject(ast);
         assert.strictEqual(ast.type, 'File');
      });
   });
});
