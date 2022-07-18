import { assertEquals, assertThrows } from "https://deno.land/std@0.148.0/testing/asserts.ts";
import lexer from "./lexer.ts";

Deno.test("can lex booleans", () =>
{
  const trueBool = lexer.reset("true").next()
  assertEquals(
    trueBool?.text,
    "true"
  )

  assertEquals(
    trueBool?.type,
    "boolean"
  )

  const falseBool = lexer.reset("false").next()
  assertEquals(
    falseBool?.text,
    "false"
  )

  assertEquals(
    falseBool?.type,
    "boolean"
  )
})

Deno.test("can lex a formula", () => {
  const result = lexer.reset(`=`).next()
  assertEquals(result?.type, 'formula')
})

Deno.test("can match numbers", () => {
  const int = lexer.reset(`123`).next()
  assertEquals(int?.type, 'number')

  const zero = lexer.reset(`123`).next()
  assertEquals(zero?.type, 'number')

  const decimal = lexer.reset(`123.4`).next()
  assertEquals(decimal?.type, 'number')

  const decimalMinus = lexer.reset(`-123.4`).next()
  assertEquals(decimalMinus?.type, 'number')

  const zeroSingleDigit = lexer.reset(`0`).next()
  assertEquals(zeroSingleDigit?.type, 'number')

  const zeroWithMinusOperator = lexer.reset(`-0`).next()
  assertEquals(zeroWithMinusOperator?.type, 'number')

  const minusOne = lexer.reset(`-1`).next()
  assertEquals(minusOne?.type, 'number')

  const oneSingleDigit = lexer.reset(`1`).next()
  assertEquals(oneSingleDigit?.type, 'number')
})

Deno.test("can match addition", () => {
  const result = lexer.reset(`+`).next()
  assertEquals(result?.type, 'plus')
})

Deno.test("can match subtraction", () => {
  const result = lexer.reset(`-`).next()
  assertEquals(result?.type, 'minus')
})

Deno.test("can match multiplication", () => {
  const result = lexer.reset(`*`).next()
  assertEquals(result?.type, 'times')
})

Deno.test("can match division", () => {
  const result = lexer.reset(`/`).next()
  assertEquals(result?.type, 'divide')
})

Deno.test("can match identifier", () => {
  const result = lexer.reset(`FuNcTiOn`).next()
  assertEquals(result?.type, 'identifier')
})

Deno.test("can have strings as either single or double quotes but not mixed", () => {
  const double = lexer.reset(`"my string"`).next()
  assertEquals(double?.type, 'string')

  const single = lexer.reset(`'my string'`).next()
  assertEquals(single?.type, 'string')

  assertThrows(() => {
    lexer.reset(`"my string'`).next()
  }, "Error: invalid syntax at line 1 col 1:")
})
