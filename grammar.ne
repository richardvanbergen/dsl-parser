@{%
import lexer from "./lexer.ts"
%}

@lexer lexer
@preprocessor typescript
@builtin "whitespace.ne"

main -> boolean | number | formula

formula -> formula_identifier number {% data => ({ formula: data[1] }) %}
         | formula_identifier arithmetic {% data => ({ formula: data[1] }) %}

formula_identifier -> %formula {% id %}

arithmetic -> number _ operator _ number
    {% data => {
        return {
            left: data[0],
            symbol: data[2],
            right: data[4]
        }
    } %}

operator -> %operator {% id %}

number -> %number
    {% data => {
        const parsed = data[0]
        if (parsed) {
            parsed.value = Number(parsed.text)
            return parsed
        }
    } %}

boolean -> %boolean
    {% data => {
        const parsed = data[0]
        if (parsed) {
            parsed.value = parsed.text === "true"
            return parsed
        }
    } %}
