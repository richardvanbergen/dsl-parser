import {Grammar, Parser} from "https://deno.land/x/nearley@2.19.7-deno/lib/nearley.js";
import grammar from "./grammar.ts";

export interface ParsedGrammar {
  type: 'boolean' | 'number' | 'formula' | 'operator'
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

export interface ParsedOperator extends ParsedGrammar {
  type: 'operator'
  value: '+' | '-' | '*' | '/'
}

export type ParsedPrimitive = ParsedBoolean | ParsedNumber

export type ParsedArithmetic = {
  left: ParsedPrimitive
  symbol: ParsedOperator
  right: ParsedPrimitive
}

export interface ParsedFormula extends ParsedGrammar {
  type: "formula"
  value: ParsedNumber | ParsedArithmetic
}

export type Parsed = ParsedPrimitive | ParsedFormula

export function isParsedFormula(parsed: unknown): parsed is ParsedFormula {
  return Array.isArray(parsed) && parsed?.[0].type === "formula"
}

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