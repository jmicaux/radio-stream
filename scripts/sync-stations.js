'use strict';
const fs = require('node:fs');
const path = require('node:path');

const ORDER = ['id', 'name', 'mark', 'streamUrl', 'siteUrl', 'color', 'textColor'];
const root = path.join(__dirname, '..');

const quote = (value) => "'" + String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const fields = (station) => ORDER.filter((key) => station[key] !== undefined);

// background.js: one field per line, objects indented by 2, fields by 4.
function renderExpanded(stations) {
  const body = stations.map((station) => {
    const lines = fields(station).map((key) => `    ${key}: ${quote(station[key])}`);
    return '  {\n' + lines.join(',\n') + '\n  }';
  });
  return 'const STATIONS = [\n' + body.join(',\n') + '\n];\n';
}

// index.html: one station per line, indented by 6 inside the inline script.
function renderCompact(stations) {
  const body = stations.map((station) => {
    const pairs = fields(station).map((key) => `${key}: ${quote(station[key])}`);
    return '      { ' + pairs.join(', ') + ' }';
  });
  return 'const STATIONS = [\n' + body.join(',\n') + '\n    ];\n';
}

// Finds the end of the `const STATIONS = [ ... ];` block by counting `[`/`]`
// characters. Like extractFromJs (test/helpers/extract-stations.js), this
// does not account for brackets inside string literals (e.g. a streamUrl
// containing `[` or `]`) — safe for today's data, but a latent limitation.
function replaceBlock(source, block) {
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
        const semi = source.indexOf(';', i);
        if (semi === -1) {
          throw new Error('no `;` found after STATIONS array closing bracket');
        }
        const newline = source.indexOf('\n', semi);
        if (newline === -1) {
          throw new Error('no trailing newline found after `const STATIONS = [...];` statement');
        }
        const end = newline + 1;
        return source.slice(0, start) + block + source.slice(end);
      }
    }
  }
  throw new Error('unterminated STATIONS block');
}

function sync() {
  const stations = JSON.parse(fs.readFileSync(path.join(root, 'shared/stations.json'), 'utf8'));
  for (const [file, render] of [['background.js', renderExpanded], ['index.html', renderCompact]]) {
    const full = path.join(root, file);
    fs.writeFileSync(full, replaceBlock(fs.readFileSync(full, 'utf8'), render(stations)));
    console.log('synced', file);
  }
}

module.exports = { renderExpanded, renderCompact, replaceBlock, sync };

if (require.main === module) {
  sync();
}
