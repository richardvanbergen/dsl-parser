import {
  parse,
  ParsedArithmetic,
  ParsedBoolean,
  ParsedFormula,
  ParsedFunction,
  ParsedNumber,
  ParsedOperator, ParsedString
} from "./parser.ts"
import {assertEquals, assertThrows} from "https://deno.land/std@0.148.0/testing/asserts.ts";

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
  const decimal = parse("=0.123")?.[0] as ParsedFormula
  const dValue = decimal.value as ParsedNumber
  const minus = parse("=-1")?.[0] as ParsedFormula
  const mValue = minus.value as ParsedNumber
  const big = parse("=1232893434")?.[0] as ParsedFormula
  const bValue = big.value as ParsedNumber

  assertEquals(zValue.type, "number")
  assertEquals(zValue.value, 0)
  assertEquals(dValue.type, "number")
  assertEquals(dValue.value, 0.123)
  assertEquals(mValue.type, "number")
  assertEquals(mValue.value, -1)
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
  const operator2 = left.operation.operator as ParsedOperator
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

  assertEquals(value.type, "function")
  assertEquals(value.value.params, [])
})

Deno.test("functions with a parameter", () => {
  const result = parse("=func_single(1)")?.[0] as ParsedFormula

  const value = result.value as ParsedFunction
  const number = value.value.params?.[0] as ParsedNumber

  assertEquals(value.type, "function")
  assertEquals(number.value, 1)
})

Deno.test("functions with a parameter sum", () => {
  const result = parse("=func(1 + 2)")?.[0] as ParsedFormula
  const value = result.value as ParsedFunction
  const sum = value.value.params?.[0] as ParsedArithmetic
  const left = sum.operation.left as ParsedNumber
  const operator = sum.operation.operator
  const right = sum.operation.right as ParsedNumber

  assertEquals(value.type, "function")
  assertEquals(value.value.name, "func")
  assertEquals(left.value, 1)
  assertEquals(operator.value, '+')
  assertEquals(right.value, 2)
})

Deno.test("functions with a nested function as param", () => {
  const result = parse("=func(nested(1))")?.[0] as ParsedFormula
  const value = result.value as ParsedFunction
  const identifier = value.value.params?.[0] as ParsedFunction
  const params = identifier.value.params?.[0] as ParsedNumber

  assertEquals(value.type, "function")
  assertEquals(identifier.value.name, "nested")
  assertEquals(params.value, 1)
})

Deno.test("functions with multiple params", () => {
  const result = parse("=func_multiple(1, 2, 3)")?.[0] as ParsedFormula
  const value = result.value as ParsedFunction
  assertEquals(value.type, "function")
  assertEquals(value.value.params.length, 3)
  assertEquals(value.value.name, "func_multiple")
  assertEquals((value.value.params[0] as ParsedNumber).value, 1)
  assertEquals((value.value.params[1] as ParsedNumber).value, 2)
  assertEquals((value.value.params[2] as ParsedNumber).value, 3)
})

Deno.test("functions with strings", () => {
  const result = parse("=func_multiple(\"param1\", 'param2')")?.[0] as ParsedFormula
  const value = result.value as ParsedFunction
  assertEquals(value.type, "function")
  assertEquals(value.value.params.length, 2)
  assertEquals(value.value.name, "func_multiple")
  assertEquals((value.value.params[0] as ParsedString).value, "param1")
  assertEquals((value.value.params[1] as ParsedString).value, "param2")

  assertThrows(() => parse("=func_multiple(\"param1')"))
  assertThrows(() => parse("=func_multiple('param1\")"))
})

Deno.test("functions with boolean params", () => {
  const result = parse("=func_bool(true, false)")?.[0] as ParsedFormula
  const value = result.value as ParsedFunction
  assertEquals(value.type, "function")
  assertEquals(value.value.params.length, 2)
  assertEquals(value.value.name, "func_bool")
  assertEquals((value.value.params[0] as ParsedBoolean).value, true)
  assertEquals((value.value.params[1] as ParsedBoolean).value, false)
})

Deno.test("functions with the kitchen sink thrown at it", () => {
  const result = parse("=func_party(nest1(100), 2, 4 / 2, nest2(42, 69, 'nice'), 'string', true)")?.[0] as ParsedFormula
  const parsedFunction = result.value as ParsedFunction
  const [
    nest1,
    param2,
    param3,
    param4,
    param5,
    param6
  ] = parsedFunction.value.params as [ParsedFunction, ParsedNumber, ParsedArithmetic, ParsedFunction, ParsedString, ParsedBoolean]

  const left = param3.operation.left as ParsedNumber
  const right = param3.operation.right as ParsedNumber

  const [
    number1,
    number2,
    string3
  ] = param4.value.params as [ParsedNumber, ParsedNumber, ParsedString]

  assertEquals(parsedFunction.type, "function")
  assertEquals(nest1.value.name, "nest1")
  assertEquals((nest1.value.params[0] as ParsedNumber).value, 100)
  assertEquals(param2.value, 2)
  assertEquals(left.value, 4)
  assertEquals(param3.operation.operator.value, "/")
  assertEquals(right.value, 2)

  assertEquals(param4.value.name, "nest2")
  assertEquals(number1.value, 42)
  assertEquals(number2.value, 69)
  assertEquals(string3.value, 'nice')

  assertEquals(param5.value, 'string')
  assertEquals(param6.value, true)
})

Deno.test("functions whitespace test", () => {
  const result = parse(`
      =func_whitespace(
        2
      )
   `)?.[0] as ParsedFormula

  const parsedFunction = result.value as ParsedFunction

  assertEquals(parsedFunction.type, "function")
  assertEquals(parsedFunction.value.name, "func_whitespace")
  assertEquals((parsedFunction.value.params[0] as ParsedNumber).value, 2)
})

Deno.test("arithmetic whitespace test", () => {
  const result = parse(`
      =1
      / 4
      + 2
   `)?.[0] as ParsedFormula

  const parsedArithmetic = result.value as ParsedArithmetic
  const { left: leftOperation, operator, right } = parsedArithmetic.operation as { left: ParsedArithmetic, operator: ParsedOperator, right: ParsedNumber }


  assertEquals((leftOperation.operation.left as ParsedNumber).value, 1)
  assertEquals(leftOperation.operation.operator.value, "/")
  assertEquals((leftOperation.operation.right as ParsedNumber).value, 4)

  assertEquals(operator.value, "+")
  assertEquals(right.value, 2)
})
