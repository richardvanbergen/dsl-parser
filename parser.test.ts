import {
  parse,
  ParsedArithmetic,
  ParsedBoolean,
  ParsedFormula,
  ParsedFunction,
  ParsedNumber,
  ParsedOperation
} from "./parser.ts"
import {assertEquals} from "https://deno.land/std@0.148.0/testing/asserts.ts";

Deno.test("parse false", () => {
  const result = parse("=false") as ParsedFormula[]
  const formula = result?.[0] as ParsedFormula
  const value = formula.value as ParsedBoolean
  assertEquals(formula.type, "formula")
  assertEquals(value.type, "boolean")
  assertEquals(value.value, false)
})

Deno.test("parse true", () => {
  const result = parse("=true") as ParsedFormula[]
  const formula = result?.[0] as ParsedFormula
  const value = formula.value as ParsedBoolean
  assertEquals(formula.type, "formula")
  assertEquals(value.type, "boolean")
  assertEquals(value.value, true)
})

Deno.test("parse numbers", () => {
  const zero = parse("=0")?.[0] as ParsedFormula
  const zValue = zero.value as ParsedNumber
  assertEquals(zValue.type, "number")
  assertEquals(zValue.value, 0)

  const decimal = parse("=0.123")?.[0] as ParsedFormula
  const dValue = decimal.value as ParsedNumber
  assertEquals(dValue.type, "number")
  assertEquals(dValue.value, 0.123)

  const minus = parse("=-1")?.[0] as ParsedFormula
  const mValue = minus.value as ParsedNumber
  assertEquals(mValue.type, "number")
  assertEquals(mValue.value, -1)

  const big = parse("=1232893434")?.[0] as ParsedFormula
  const bValue = big.value as ParsedNumber
  assertEquals(bValue.type, "number")
  assertEquals(bValue.value, 1232893434)
})

Deno.test("multiplication order", () => {
  const result = parse("=1 - 2 * 3")?.[0] as ParsedFormula
  const value = result.value as ParsedArithmetic
  const left = value.operation.left as ParsedNumber
  const right = value.operation.right as ParsedArithmetic

  const left2 = right.operation.left as ParsedNumber
  const right2 = right.operation.right as ParsedNumber

  assertEquals(left.value, 1)
  assertEquals(value.operation.operator.value, "-")
  assertEquals(left2.value, 2)
  assertEquals(right.operation.operator.value, "*")
  assertEquals(right2.value, 3)
})

Deno.test("division order", () => {
  const result = parse("=1 + 2 - 3 / 4")?.[0] as ParsedFormula
  const value = result.value as ParsedArithmetic
  const left = value.operation.left as ParsedArithmetic
  const operator = value.operation.operator
  const right = value.operation.right as ParsedArithmetic

  const left1 = left.operation.left as ParsedNumber
  const operator1 = left.operation.operator
  const right1 = left.operation.right as ParsedNumber

  const left2 = right.operation.left as ParsedNumber
  const operator2 = right.operation.operator
  const right2 = right.operation.right as ParsedNumber

  assertEquals(left1.value, 1)
  assertEquals(operator1.value, "+")
  assertEquals(right1.value, 2)
  assertEquals(operator.value, "-")
  assertEquals(left2.value, 3)
  assertEquals(operator2.value, '/')
  assertEquals(right2.value, 4)
})

Deno.test("parse addition", () => {
  const result = parse("=1 + 2 - 3")?.[0] as ParsedFormula
  const value = result.value as ParsedArithmetic
  const left = value.operation.left as ParsedArithmetic
  const right = value.operation.right as ParsedNumber

  const left2 = left.operation.left as ParsedNumber
  const operator2 = left.operation.operator as ParsedOperation
  const right2 = left.operation.right as ParsedNumber

  assertEquals(left2.value, 1)
  assertEquals(operator2.value, "+")
  assertEquals(right2.value, 2)
  assertEquals(value.operation.operator.value, "-")
  assertEquals(right.value, 3)
})

Deno.test("parse parens", () => {
  const result = parse("=1 + (2 - 3)")?.[0] as ParsedFormula
  const value = result.value as ParsedArithmetic
  const left = value.operation.left as ParsedNumber
  const right = value.operation.right as ParsedArithmetic

  const left2 = right.operation.left as ParsedNumber
  const right2 = right.operation.right as ParsedNumber

  assertEquals(left.value, 1)
  assertEquals(value.operation.operator.value, "+")
  assertEquals(left2.value, 2)
  assertEquals(right.operation.operator.value, "-")
  assertEquals(right2.value, 3)
})

Deno.test("functions", () => {
  const result = parse("=func()")?.[0] as ParsedFormula
  const value = result.value as ParsedFunction
  assertEquals(value.type, "identifier")
  assertEquals(value.value.params, [])
})

// Deno.test("functions with a parameter", () => {
//   const result = parse("=func_single(1)")?.[0] as ParsedFormula
//   const value = result.value as ParsedIdentifier
//   assertEquals(value.type, "identifier")
//   const number = value.value.params?.[0] as ParsedNumber
//   assertEquals(number.value, 1)
// })
//
// Deno.test("functions with a parameter sum", () => {
//   const result = parse("=func(1 + 2)")?.[0] as ParsedFormula
//   const value = result.value as ParsedIdentifier
//   assertEquals(value.type, "identifier")
//
//   const sum = value.value.params?.[0] as ParsedArithmetic
//   const left = sum.operation.left as ParsedNumber
//   const operator = sum.operation.operator
//   const right = sum.operation.right as ParsedNumber
//
//   assertEquals(value.value.name, "func")
//   assertEquals(left.value, 1)
//   assertEquals(operator.value, '+')
//   assertEquals(right.value, 2)
// })
//
// Deno.test("functions with a nested function as param", () => {
//   const result = parse("=func(nested(1))")?.[0] as ParsedFormula
//   const value = result.value as ParsedIdentifier
//   assertEquals(value.type, "identifier")
//   const identifier = value.value.params?.[0] as ParsedIdentifier
//   assertEquals(identifier.value.name, "nested")
//   const params = identifier.value.params?.[0] as ParsedNumber
//   assertEquals(params.value, 1)
// })
//
// Deno.test("functions with multiple params", () => {
//   const result = parse("=func_multiple(1, 2, 3)")?.[0] as ParsedFormula
//   const value = result.value as ParsedIdentifier
//   assertEquals(value.type, "identifier")
//   assertEquals(value.value.params.length, 2)
//   assertEquals((value.value.params[0] as ParsedNumber).value, 1)
//   assertEquals((value.value.params[1] as ParsedNumber).value, 2)
// })
//
// Deno.test("more then two params", () => {
//
// })

// Deno.test("functions with multiple nested params and arithmetic", () => {
//   const result = parse("=func_party(nest1(100), 2, 4 / 2, nest2(42, 69))")?.[0] as ParsedFormula
//   const value = result.value as ParsedIdentifier
//   assertEquals(value.value.name, "func")
//   const [nested1, number, arithmetic, nested2] = value.value.params as [ParsedIdentifier, ParsedNumber, ParsedArithmetic, ParsedIdentifier]
//   const [left, operator, right] = arithmetic as [ParsedNumber, ParsedOperation, ParsedNumber]
//   const nested1NumberParams = nested1.value.params?.[0] as ParsedNumber
//   const nested2ArithmeticParams = nested2.value.params as [ParsedNumber, ParsedNumber]
//
//   assertEquals(nested1.value.name, "nest1")
//   assertEquals(nested1NumberParams.value, 100)
//   assertEquals(number.value, 2)
//   assertEquals(left.value, 4)
//   assertEquals(operator.value, '/')
//   assertEquals(right.value, 2)
//   assertEquals(nested2ArithmeticParams[0].value, 42)
//   assertEquals(nested2ArithmeticParams[1].value, 69)
// })
