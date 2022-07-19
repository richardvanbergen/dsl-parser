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

function -> identifier _ "(" _ parameter_list:* _ ")"
    {% data => {
        data[0].type = "function"
        const params = data[4]?.[0] ?? []
        data[0].value = {
            name: data[0].text,
            params
        }

        return data[0]
     }%}

parameter_list
    -> function_param _ "," _ parameter_list
        {% data => {
            const funcParam = Array.isArray(data[4]) ? data[4] : [data[4]]
            return [data[0], ...funcParam]
        } %}
    | function_param

function_param -> arithmetic {% id %}
                | boolean  {% id %}
                | string {% id %}

identifier -> %identifier {% id %}

string -> %string {% id %}

boolean -> %boolean
    {% data => {
        const parsed = data[0]
        if (parsed) {
            parsed.value = parsed.text === "true"
            return parsed
        }
    } %}
