const fs = require('fs');

const files = [
  'src/components/UtpPadiCalculator.jsx',
  'src/components/TokoBangunanCalculator.jsx',
  'src/components/TernakKambingCalculator.jsx',
  'src/components/IndustriTempeCalculator.jsx',
  'src/components/AirIsiUlangCalculator.jsx',
  'src/components/WarungCalculator.jsx',
  'src/components/GenericBusinessCalculator.jsx',
  'src/components/QuickCalculator.jsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Replace the broken name logic
  content = content.replace(
    /namaDraft: status === 'draft' \? namaDraft : \(typeof namaResponden !== 'undefined' \? namaResponden : ''\),\s*namaResponden: typeof namaResponden !== 'undefined' \? namaResponden : '',/,
    `namaDraft: namaDraft || (typeof namaResponden !== 'undefined' ? namaResponden : ''),\n      namaResponden: namaDraft || (typeof namaResponden !== 'undefined' ? namaResponden : ''),`
  );

  fs.writeFileSync(file, content);
  console.log('Fixed names in ' + file);
});
