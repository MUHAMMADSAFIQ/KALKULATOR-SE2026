const fs = require('fs');
const path = require('path');

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
  if (!fs.existsSync(file)) {
    console.log(`Skipping ${file}`);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');

  // 1. Add Imports
  if (!content.includes('ActionMenu')) {
    content = content.replace(
      /import \{ formatCurrency[^\}]*\} from '\.\.\/utils';/,
      `import { formatCurrency, saveToArchive } from '../utils';\nimport ActionMenu from './ActionMenu';\nimport BusinessConclusion from './BusinessConclusion';`
    );
  }

  // 2. Change Signature
  content = content.replace(
    /export default function ([A-Za-z]+)\(\{\s*([^\}]+)\s*\}\)\s*\{/,
    'export default function $1({ $2, initialData, onSaved }) {'
  );
  if (!content.includes('initialData')) {
    content = content.replace(
      /export default function ([A-Za-z]+)\(\)\s*\{/,
      'export default function $1({ initialData, onSaved }) {'
    );
  }

  // 3. Inject states from initialData
  const stateRegex = /const \[([a-zA-Z0-9_]+),\s*([a-zA-Z0-9_]+)\] = useState\(([^)]+)\);/g;
  content = content.replace(stateRegex, (match, varName, setVarName, defVal) => {
    if (defVal.includes('initialData')) return match;
    return `const [${varName}, ${setVarName}] = useState(initialData?.rawState?.${varName} ?? ${defVal});`;
  });

  // 4. Gather raw state variables
  const stateVars = [...content.matchAll(/const \[([a-zA-Z0-9_]+),\s*[a-zA-Z0-9_]+\] = useState/g)].map(m => m[1]);
  const rawStateStr = stateVars.join(', ');
  
  const actionMenuStr = `
  const getRawState = () => ({ ${rawStateStr} });

  const buildRecord = (status, catatan = '', namaDraft = '') => {
    const defaultTotalIncome = typeof totalIncome !== 'undefined' ? totalIncome : (typeof netProfitTahunan !== 'undefined' ? netProfitTahunan : (typeof panenGabah !== 'undefined' ? panenGabah * frekuensiPanen : (typeof income !== 'undefined' ? income : 0)));
    const defaultTotalExpense = typeof totalExpense !== 'undefined' ? totalExpense : (typeof expense !== 'undefined' ? expense : 0);
    const defaultNetTahunan = typeof netProfitTahunan !== 'undefined' ? netProfitTahunan : (typeof labaTahun !== 'undefined' ? labaTahun : 0);
    
    return {
      status, // 'draft' | 'final'
      catatan,
      namaDraft: status === 'draft' ? namaDraft : (typeof namaResponden !== 'undefined' ? namaResponden : ''),
      namaResponden: typeof namaResponden !== 'undefined' ? namaResponden : '',
      kbliCode: (typeof activeKbli !== 'undefined' && activeKbli?.code) ? activeKbli.code : '00000',
      namaUsaha: (typeof activeKbli !== 'undefined' && activeKbli?.name) ? activeKbli.name : 'Usaha',
      kbliId: (typeof activeKbli !== 'undefined' && activeKbli?.id) ? activeKbli.id : 'unknown',
      total_pendapatan: defaultTotalIncome,
      total_pengeluaran: defaultTotalExpense,
      labaBersihBulan: Math.round(defaultNetTahunan / 12),
      labaBersihTahun: defaultNetTahunan,
      rawState: getRawState()
    };
  };

  const handleSaveDraft = (namaDraft) => {
    saveToArchive(buildRecord('draft', '', namaDraft), initialData?.id);
    if(onSaved) onSaved();
  };

  const handleSaveFinal = (namaRecord, catatan) => {
    saveToArchive(buildRecord('final', catatan, namaRecord), initialData?.id);
    if(onSaved) onSaved();
  };
  `;

  // Safely replace the button
  const parts = content.split('Simpan Data ke Arsip');
  if (parts.length > 1) {
    const beforeText = parts[0];
    const lastButtonIndex = beforeText.lastIndexOf('<button');
    
    const afterText = parts[1];
    const nextButtonEnd = afterText.indexOf('</button>') + '</button>'.length;
    
    const originalSaveButtonStr = beforeText.substring(lastButtonIndex) + 'Simpan Data ke Arsip' + afterText.substring(0, nextButtonEnd);
    
    let conclusionVars = '';
    // Customize Conclusion logic based on component
    if (file.includes('UtpPadiCalculator')) {
      conclusionVars = `<BusinessConclusion totalIncome={panenGabah * frekuensiPanen} totalExpense={totalExpense * frekuensiPanen} netProfitTahunan={netProfitTahunan} />`;
    } else if (content.includes('netProfitTahunan') && content.includes('totalExpense')) {
      conclusionVars = `<BusinessConclusion totalIncome={totalIncome} totalExpense={totalExpense} netProfitTahunan={netProfitTahunan} />`;
    } else if (file.includes('QuickCalculator')) {
      conclusionVars = `<BusinessConclusion totalIncome={income} totalExpense={expense} netProfitTahunan={labaTahun} />`;
    }
    
    const replacement = `
      <>
        ${conclusionVars}
        <ActionMenu onSaveDraft={handleSaveDraft} onSaveFinal={handleSaveFinal} />
        {/* INJECTED_FUNCTIONS_PLACEHOLDER */}
      </>
    `;
    
    content = content.replace(originalSaveButtonStr, replacement);
    
    // Inject the functions right before the return statement inside the component
    // Find the last return (
    const lastReturnIndex = content.lastIndexOf('return (');
    if (lastReturnIndex !== -1) {
      content = content.substring(0, lastReturnIndex) + actionMenuStr + '\n  ' + content.substring(lastReturnIndex);
    }
  }

  fs.writeFileSync(file, content);
  console.log('Upgraded ' + file);
});
