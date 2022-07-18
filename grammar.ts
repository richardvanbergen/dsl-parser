// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var formula: any;
declare var operator: any;
declare var number: any;
declare var boolean: any;

import lexer from "./lexer.ts"

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "main", "symbols": ["boolean"]},
    {"name": "main", "symbols": ["number"]},
    {"name": "main", "symbols": ["formula"]},
    {"name": "formula", "symbols": ["formula_identifier", "number"]},
    {"name": "formula", "symbols": ["formula_identifier", "arithmetic"]},
    {"name": "formula_identifier", "symbols": [(lexer.has("formula") ? {type: "formula"} : formula)], "postprocess": id},
    {"name": "arithmetic", "symbols": ["number", "_", "operator", "_", "number"], "postprocess":  data => {
            return {
                left: data[0],
                symbol: data[2],
                right: data[4]
            }
        } },
    {"name": "operator", "symbols": [(lexer.has("operator") ? {type: "operator"} : operator)], "postprocess": id},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess":  data => {
            const parsed = data[0]
            if (parsed) {
                parsed.value = Number(parsed.text)
                return parsed
            }
        } },
    {"name": "boolean", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)], "postprocess":  data => {
            const parsed = data[0]
            if (parsed) {
                parsed.value = parsed.text === "true"
                return parsed
            }
        } }
  ],
  ParserStart: "main",
};

export default grammar;
