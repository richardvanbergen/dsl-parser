import {Grammar, Parser} from "https://deno.land/x/nearley@2.19.7-deno/lib/nearley.js";
import grammar from "./grammar.ts";

export interface ParsedGrammar {
  type: 'boolean' | 'number' | 'formula' | 'function' | 'arithmetic' | 'plus' | 'minus' | 'times' | 'divide' | 'string'
  value: unknown
  text: string
  offset: number
  lineBreaks: number
  line: number
  col: number
}

export interface ParsedBoolean extends ParsedGrammar {
  type: 'boolean'
  value: boolean
}

export interface ParsedNumber extends ParsedGrammar {
  type: 'number'
  value: number
}

export interface ParsedPlus extends ParsedGrammar {
  type: 'number'
  value: '+'
}

export interface ParsedMinus extends ParsedGrammar {
  type: 'minus'
  value: '-'
}

export interface ParsedTimes extends ParsedGrammar {
  type: 'times'
  value: '*'
}

export interface ParsedDivide extends ParsedGrammar {
  type: 'divide'
  value: '/'
}

export interface ParsedString extends ParsedGrammar {
  type: 'string'
  value: string
}

export interface ParsedFunction extends ParsedGrammar {
  type: 'function'
  value: {
    name: string
    params: ParsedFormulaValue[]
  }
}

export type ParsedOperator = ParsedPlus | ParsedMinus | ParsedTimes | ParsedDivide
export type ParsedFormulaValue =
  ParsedArithmetic |
  ParsedBoolean |
  ParsedNumber |
  ParsedString |
  ParsedFunction

export type ParsedArithmetic = {
  type: "arithmetic",
  operation: {
    left: ParsedArithmetic | ParsedNumber,
    operator: ParsedOperator,
    right: ParsedArithmetic | ParsedNumber
  }
}

export interface ParsedFormula extends ParsedGrammar {
  type: "formula"
  value: ParsedArithmetic | ParsedBoolean | ParsedNumber | ParsedFunction
}

export type Parsed = ParsedFormula

export function parse(input: string) {
  const parserTest = new Parser(Grammar.fromCompiled(grammar));
  const results = parserTest.feed(input)?.results

  if (results) {
    if (results.length > 1) {
      throw new Error("Ambiguous grammar detected.")
    }

    if (results.length < 1) {
      throw new Error("Failed to parse input.")
    }

    return results?.[0] as Parsed[]
  }
}
