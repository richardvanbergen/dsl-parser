@{%
import lexer from "./lexer.ts"
%}

@lexer lexer
@preprocessor typescript
@builtin "whitespace.ne"

main -> boolean | number | formula

formula -> formula_identifier number

formula_identifier -> %formula {% id %}

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