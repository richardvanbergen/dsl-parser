import moo from "https://esm.sh/moo@0.5.1";

const lexer = moo.compile({
  WS:        /[ \t]+/,
  number:    /-?\d+\.?\d*/,
  string: [
    { match: /"""[^]*?"""/, lineBreaks: true, value: x => x.slice(3, -3) },
    { match: /"(?:\\["\\rn]|[^"\\])*?"/, lineBreaks: true, value: x => x.slice(1, -1) },
    { match: /'(?:\\['\\rn]|[^'\\])*?'/, lineBreaks: true, value: x => x.slice(1, -1) },
  ],
  formula:    '=',
  plus:       '+',
  minus:      '-',
  times:      '*',
  divide:     '/',
  exponent:   '^',
  lparen:     '(',
  rparen:     ')',
  separator:  ',',
  boolean:    ['true', 'false'],
  identifier: /[a-zA-Z][a-zA-Z_0-9]+/,
  NL:         { match: /\n/, lineBreaks: true },
})

export default lexer