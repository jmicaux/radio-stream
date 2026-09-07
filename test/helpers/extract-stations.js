'use strict';

// Pull the `const STATIONS = [ ... ];` array literal out of a source file and
// evaluate it. The block is a plain array of object literals in both
// background.js and index.html, so evaluating is safe and avoids writing a
// parser for two different formattings of the same data.
function extractFromJs(source) {
  const start = source.indexOf('const STATIONS = [');
  if (start === -1) {
    throw new Error('no `const STATIONS = [` block found');
  }
  const open = source.indexOf('[', start);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === '[') depth += 1;
    if (source[i] === ']') {
      depth -= 1;
      if (depth === 0) {
        const literal = source.slice(open, i + 1);
        return new Function('return ' + literal)();
      }
    }
  }
  throw new Error('unterminated STATIONS block');
}

module.exports = { extractFromJs };
