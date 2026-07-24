import fs from 'fs';

const url = 'https://briktra.com/app/main.dart.js';
const t = await (await fetch(url)).text();
const m = t.match(/\$\.b3t\s*=\s*[^;]{0,100}/g);
console.log('b3t assigns', m);
const m2 = [...t.matchAll(/B\.i\.a9\("([^"]{0,80})"\)/g)].slice(0, 20).map((x) => x[1]);
console.log('sample a9 strings near secret init');
const idx = t.indexOf('$.b3t=B.i.a9');
console.log('context', t.slice(idx, idx + 80));
fs.writeFileSync('docs/role-exploration/_secret-check.txt', `idx=${idx}\nctx=${t.slice(Math.max(0,idx-40), idx+100)}\n`);
