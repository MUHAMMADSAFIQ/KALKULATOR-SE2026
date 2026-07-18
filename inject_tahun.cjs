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

  // 1. Add Import
  if (!content.includes('TahunBerdiriSelector')) {
    content = content.replace(
      /import BusinessConclusion from '.\/BusinessConclusion';/,
      `import BusinessConclusion from './BusinessConclusion';\nimport TahunBerdiriSelector from './TahunBerdiriSelector';`
    );
  }

  // 2. Add State (find the start of the component function)
  if (!content.includes('tahunBerdiri')) {
    const compMatch = content.match(/export default function [a-zA-Z]+\(\{[^}]+\}\) \{/);
    if (compMatch) {
      const stateStr = `\n  const [tahunBerdiri, setTahunBerdiri] = useState(initialData?.rawState?.tahunBerdiri ?? '<=2025');\n  const [bulanBerdiri, setBulanBerdiri] = useState(initialData?.rawState?.bulanBerdiri ?? 1);\n  const bulanOperasi = tahunBerdiri === '2026' ? (12 - parseInt(bulanBerdiri) + 1) : 12;\n`;
      content = content.replace(compMatch[0], compMatch[0] + stateStr);
    }
  }

  // 3. UI Component Injection (after card-header)
  if (!content.includes('<TahunBerdiriSelector')) {
    const headerRegex = /<div className="card-header"[^>]*>[\s\S]*?<\/div>/;
    content = content.replace(headerRegex, (match) => {
      return match + `\n      <TahunBerdiriSelector tahunBerdiri={tahunBerdiri} setTahunBerdiri={setTahunBerdiri} bulanBerdiri={bulanBerdiri} setBulanBerdiri={setBulanBerdiri} />`;
    });
  }

  // 4. Update Business Conclusion props
  if (!content.includes('tahunBerdiri={tahunBerdiri}')) {
    content = content.replace(
      /<BusinessConclusion([\s\S]*?)\/>/g,
      (match, p1) => {
        return `<BusinessConclusion${p1} tahunBerdiri={tahunBerdiri} bulanBerdiri={bulanBerdiri} />`;
      }
    );
  }

  // 5. Update rawState in buildRecord
  if (!content.includes('...getRawState(), tahunBerdiri, bulanBerdiri')) {
    content = content.replace(
      /rawState: getRawState\(\)/g,
      `rawState: { ...getRawState(), tahunBerdiri, bulanBerdiri }`
    );
  }

  // 6. Update Average per Month UI divisions
  // Sometimes it's netProfit / 12, sometimes netProfitTahunan / 12, sometimes defaultNetTahunan / 12
  content = content.replace(/netProfit \/ 12\}/g, 'netProfit / bulanOperasi}');
  content = content.replace(/netProfitTahunan \/ 12\}/g, 'netProfitTahunan / bulanOperasi}');
  content = content.replace(/defaultNetTahunan \/ 12\}/g, 'defaultNetTahunan / bulanOperasi}');

  // 7. Special logic for QuickCalculator.jsx
  if (file.includes('QuickCalculator.jsx')) {
    content = content.replace(/const labaTahun = labaBulan \* 12;/g, 'const labaTahun = labaBulan * bulanOperasi;');
  }

  fs.writeFileSync(file, content);
  console.log('Injected into ' + file);
});
