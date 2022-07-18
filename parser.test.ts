import {parse, ParsedArithmetic, ParsedFormula, ParsedNumber, ParsedPrimitive} from "./parser.ts"
import { assertEquals } from "https://deno.land/std@0.148.0/testing/asserts.ts";

Deno.test("parse false", () => {
  const results = parse("false") as ParsedPrimitive[]
  assertEquals(results?.length, 1)
  assertEquals(results?.[0].type, "boolean")
  assertEquals(results?.[0].value, false)
})

Deno.test("parse true", () => {
  const results = parse("true") as ParsedPrimitive[]
  assertEquals(results?.length, 1)
  assertEquals(results?.[0].type, "boolean")
  assertEquals(results?.[0].value, true)
})

Deno.test("parse numbers", () => {
  const zero = parse("0") as ParsedPrimitive[]
  assertEquals(zero?.length, 1)
  assertEquals(zero?.[0].type, "number")
  assertEquals(zero?.[0].value, 0)

  const decimal = parse("0.123") as ParsedPrimitive[]
  assertEquals(decimal?.length, 1)
  assertEquals(decimal?.[0].type, "number")
  assertEquals(decimal?.[0].value, 0.123)

  const minus = parse("-1") as ParsedPrimitive[]
  assertEquals(minus?.length, 1)
  assertEquals(minus?.[0].type, "number")
  assertEquals(minus?.[0].value, -1)

  const big = parse("1232893434") as ParsedPrimitive[]
  assertEquals(big?.length, 1)
  assertEquals(big?.[0].type, "number")
  assertEquals(big?.[0].value, 1232893434)
})

Deno.test("begin parsing formulas with primitives", () => {
  const result = parse("=1")
  const formula = result?.[0] as ParsedFormula
  const value = formula.value as ParsedNumber
  assertEquals(formula.type, "formula")
  assertEquals(value.type, "number")
  assertEquals(value.value, 1)
})

Deno.test("parse addition formula", () => {
  const parsed = parse("=1 + 2")
  const formula = parsed?.[0] as ParsedFormula
  const value = formula.value as ParsedArithmetic

  assertEquals(formula.type, "formula")

  assertEquals(value.left.type, "number")
  assertEquals(value.left.value, 1)

  assertEquals(value.symbol.type, "operator")
  assertEquals(value.symbol.value, "+")

  assertEquals(value.right.type, "number")
  assertEquals(value.right.value, 2)
})

Deno.test("parse subtraction formula", () => {
  const parsed = parse("=2 - 1")
  const formula = parsed?.[0] as ParsedFormula
  const value = formula.value as ParsedArithmetic

  assertEquals(formula.type, "formula")

  assertEquals(value.left.type, "number")
  assertEquals(value.left.value, 2)

  assertEquals(value.symbol.type, "operator")
  assertEquals(value.symbol.value, "-")

  assertEquals(value.right.type, "number")
  assertEquals(value.right.value, 1)
})
