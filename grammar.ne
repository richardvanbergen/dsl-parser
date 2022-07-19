@{%
import lexer from "./lexer.ts"
%}

@lexer lexer
@preprocessor typescript
@builtin "whitespace.ne"

main -> _ value _ {% data => data[1] %}
value -> formula

formula -> formula_identifier boolean {% data => ({ ...data[0], value: data[1] }) %}
         | formula_identifier arithmetic {% data => ({ ...data[0], value: data[1] }) %}

formula_identifier -> %formula {% id %}

arithmetic -> addition_subtraction {% id %}

addition_subtraction -> addition_subtraction _ plus _ multiplication_division
                        {% data => ({ type: "arithmetic", operation: { left: data[0], operator: data[2], right: data[4] } }) %}
                      | addition_subtraction _ minus _ multiplication_division
                        {% data => ({ type: "arithmetic", operation: { left: data[0], operator: data[2], right: data[4] } }) %}
                      | multiplication_division
                        {% id %}

multiplication_division -> multiplication_division _ times _ exponent
                           {% data => ({ type: "arithmetic", operation: { left: data[0], operator: data[2], right: data[4] } }) %}
                         | multiplication_division _ divide _ exponent
                           {% data => ({ type: "arithmetic", operation: { left: data[0], operator: data[2], right: data[4] } }) %}
                         | exponent
                           {% id %}

exponent -> parens _ exponent _ exponent
          | parens {% id %}

parens -> "(" _ arithmetic _ ")" {% data => data[2] %}
        | number {% id %}

plus -> %plus {% id %}
minus -> %minus {% id %}
times -> %times {% id %}
divide -> %divide {% id %}
exponent -> %exponent {% id %}

number -> %number
    {% data => {
        const parsed = data[0]
        if (parsed) {
            parsed.value = Number(parsed.text)
            return parsed
        }
    } %}
    | function {% id %}

function -> identifier _ "(" _ function_param:* _ ")"
    {% data => {
        data[0].type = "function"
        data[0].value = {
            name: data[0].text,
            params: data[4]
        }

        return data[0]
     }%}

function_param
    -> arithmetic _ "," _ function_param
        {% data => {
            const funcParam = Array.isArray(data[4]) ? data[4] : [data[4]]
            return [data[0], ...funcParam]
         }%}
    | boolean _ "," _ function_param
        {% data => {
            const funcParam = Array.isArray(data[4]) ? data[4] : [data[4]]
            return [data[0], ...funcParam]
         }%}
    | arithmetic {% id %}
    | boolean {% id %}

identifier -> %identifier {% id %}

boolean -> %boolean
    {% data => {
        const parsed = data[0]
        if (parsed) {
            parsed.value = parsed.text === "true"
            return parsed
        }
    } %}
