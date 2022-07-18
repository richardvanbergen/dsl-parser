import { parse } from "./parser.ts"
import { assertEquals } from "https://deno.land/std@0.148.0/testing/asserts.ts";

Deno.test("it can parse true", () => {
  const results = parse("true")
  assertEquals(results?.length, 1)
  assertEquals(results?.[0].type, "boolean")
  assertEquals(results?.[0].value, true)
})

Deno.test("it can parse false", () => {
  const results = parse("false")
  assertEquals(results?.length, 1)
  assertEquals(results?.[0].type, "boolean")
  assertEquals(results?.[0].value, false)
})

Deno.test("it can parse numbers", () => {
  const zero = parse("0")
  assertEquals(zero?.length, 1)
  assertEquals(zero?.[0].type, "number")
  assertEquals(zero?.[0].value, 0)

  const decimal = parse("0.123")
  assertEquals(decimal?.length, 1)
  assertEquals(decimal?.[0].type, "number")
  assertEquals(decimal?.[0].value, 0.123)

  const minus = parse("-1")
  assertEquals(minus?.length, 1)
  assertEquals(minus?.[0].type, "number")
  assertEquals(minus?.[0].value, -1)

  const big = parse("1232893434")
  assertEquals(big?.length, 1)
  assertEquals(big?.[0].type, "number")
  assertEquals(big?.[0].value, 1232893434)
})

Deno.test("can parse formulas", () => {
  const result = parse("=1")
  const formula = result?.[0]
  assertEquals(result?.length, 1)
  assertEquals(formula?.length, 2)

  assertEquals(formula?.[0].type, "formula")
  assertEquals(formula?.[1].type, "number")
  assertEquals(formula?.[0].value, "=")
  assertEquals(formula?.[1].value, 1)
})
