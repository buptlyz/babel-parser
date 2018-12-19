import fs               from 'fs';

import * as babelParser from '@babel/parser';

/**
 * Default babel parser options applying most available plugins.
 *
 * Caveats include:
 * - that both decorators and decorators-legacy can not be used simultaneously.
 * - that both 'flow' and 'typescript' can not be used simultaneously
 *
 * @type {{plugins: string[]}}
 * @ignore
 */
const s_DEFAULT_BABELPARSER_OPTIONS =
{
   plugins: ['asyncGenerators', 'bigInt', 'classProperties', 'classPrivateProperties', 'classPrivateMethods',
    ['decorators', { decoratorsBeforeExport: false }], 'doExpressions', 'dynamicImport',
     'exportDefaultFrom', 'exportNamespaceFrom',  'functionBind', 'functionSent', 'importMeta',
      'jsx', 'logicalAssignment', 'nullishCoalescingOperator', 'numericSeparator', 'objectRestSpread',
       'optionalCatchBinding', 'optionalChaining', ['pipelineOperator', { proposal: 'minimal' }], 'throwExpressions',
        'typescript']
};

/**
 * Provides a convenience wrapper around Babel parser.
 */
export default class BabelParser
{
   /**
    * Load and parse source code with Babel parser.
    *
    * @param {string}   filePath - source code file path.
    * @param {object}   [options] - Overrides default babel parser options.
    * @param {object}   [override] - Provides helper directives to override options to simplify modification of default
    *                                Babel parser options.
    *
    * @returns {object} AST of source code.
    */
   static parseFile(filePath, options = void 0, override = void 0)
   {
      return BabelParser.parseSource(fs.readFileSync(filePath, { encode: 'utf8' }).toString(), options, override);
   }

   /**
    * Parses the given source with Babel parser.
    *
    * @param {string}   source - Javascript source code to parse.
    * @param {object}   [options] - Overrides default babel parser options.
    * @param {object}   [override] - Provides helper directives to override options to simplify modification of default
    *                                Babel parser options.
    *
    * @returns {object}
    */
   static parseSource(source, options = void 0, override = void 0)
   {
      options = typeof options === 'object' ? options : JSON.parse(JSON.stringify(s_DEFAULT_BABELPARSER_OPTIONS));
      options.sourceType = typeof options.sourceType === 'string' ? options.sourceType : 'unambiguous';

      if (typeof override === 'object' && typeof Array.isArray(options.plugins))
      {
         // If flow is enabled as an override 'typescript' must be removed and 'flow' added.
         if (typeof override.flow === 'boolean' && override.flow)
         {
            const index = options.plugins.indexOf('typescript');
            if (index > -1)
            {
               options.plugins.splice(index, 1);
            }

            options.plugins.push('flow');
         }
      }

      return babelParser.parse(source, options);
   }
}

/**
 * Wires up BabelParser on the plugin eventbus. The following event bindings are available:
 *
 * `typhonjs:babel:parser:file:parse`: Invokes `parseFile`.
 * `typhonjs:babel:parser:source:parse`: Invokes `parseSource`.
 *
 * @param {PluginEvent} ev - The plugin event.
 * @ignore
 */
export function onPluginLoad(ev)
{
   const eventbus = ev.eventbus;

   eventbus.on('typhonjs:babel:parser:file:parse', BabelParser.parseFile, BabelParser);
   eventbus.on('typhonjs:babel:parser:source:parse', BabelParser.parseSource, BabelParser);
}

