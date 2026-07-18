const fs = require('fs');

const files = [
  'src/components/UtpPadiCalculator.jsx',
  'src/components/TokoBangunanCalculator.jsx',
  'src/components/TernakKambingCalculator.jsx',
  'src/components/IndustriTempeCalculator.jsx',
  'src/components/AirIsiUlangCalculator.jsx',
  'src/components/WarungCalculator.jsx',
  'src/components/GenericBusinessCalculator.jsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let lines = fs.readFileSync(file, 'utf8').split('\n');

  let incomeStart = -1;
  let expenseStart = -1;
  let layoutEnd = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.toLowerCase().includes('{/* kolom pendapatan') || line.toLowerCase().includes('{/* kolom pemasukan')) {
      incomeStart = i;
    }
    if (line.toLowerCase().includes('{/* kolom pengeluaran')) {
      expenseStart = i;
    }
    // Assume the layout ends at the first </div> that aligns with the opening <div className="grid-layout">
    // Actually, usually it's just the start of `<div className="summary-card"` or a known string.
    if (expenseStart !== -1 && i > expenseStart && (line.includes('className="summary-card"') || line.includes('<div className="summary-card"'))) {
      // Step back a bit to find the closing div of grid-layout
      let j = i - 1;
      while (j > expenseStart && !lines[j].includes('</div>')) {
        j--;
      }
      layoutEnd = j + 1; 
      break;
    }
  }

  if (incomeStart !== -1 && expenseStart !== -1 && layoutEnd !== -1 && incomeStart < expenseStart) {
    console.log(`Reordering ${file}`);
    const before = lines.slice(0, incomeStart);
    const incomeBlock = lines.slice(incomeStart, expenseStart);
    const expenseBlock = lines.slice(expenseStart, layoutEnd);
    const after = lines.slice(layoutEnd);

    // Swap incomeBlock and expenseBlock
    lines = [...before, ...expenseBlock, ...incomeBlock, ...after];
    
    // Now, let's inject expenseDetails to BusinessConclusion
    let content = lines.join('\n');
    
    let expenseDetailsStr = `expenseDetails={[]}`;
    
    if (file.includes('UtpPadiCalculator')) {
      expenseDetailsStr = `expenseDetails={[{name: 'Benih', value: expenses?.benih || 0}, {name: 'Pupuk', value: expenses?.pupuk || 0}, {name: 'Pestisida', value: expenses?.pestisida || 0}, {name: 'Sewa Traktor', value: expenses?.sewaTraktor || 0}, {name: 'Upah Buruh', value: expenses?.upahBuruh || 0}, {name: 'Irigasi', value: expenses?.irigasi || 0}]}`;
    } else if (file.includes('WarungCalculator')) {
      expenseDetailsStr = `expenseDetails={modeBiaya === 'Global' ? [{name: 'Modal Operasional', value: modalGlobal}] : [{name: 'Belanja Barang', value: belanjaHarian * hariBukaBulan}, {name: 'Listrik, Air & Gas', value: listrikBulan}, {name: 'Transport/Bensin', value: transportBulan}, {name: 'Upah Karyawan', value: gajiKaryawan}]}`;
    } else if (file.includes('AirIsiUlangCalculator')) {
      expenseDetailsStr = `expenseDetails={modeBiaya === 'Global' ? [{name: 'Modal Operasional', value: modalGlobal}] : [{name: 'Air Tangki', value: (parseFloat(hargaTangki||0)/parseFloat(kapasitasTangki||1))*jumlahGalonBulan}, {name: 'Tutup & Tisu Galon', value: (parseFloat(hargaTutupGalon||0)/parseFloat(isiTutupGalon||1))*jumlahGalonBulan}, {name: 'Listrik', value: parseFloat(listrikBulan||0)}, {name: 'Transport', value: parseFloat(transportBulan||0)}, {name: 'Gaji Karyawan', value: parseFloat(gajiKaryawan||0)}]}`;
    } else if (file.includes('GenericBusinessCalculator')) {
      expenseDetailsStr = `expenseDetails={[{name: 'Biaya Bahan Baku/Kulakan', value: parseFloat(biayaBahanBaku||0)}, {name: 'Biaya Operasional (Listrik, Air, Gas, dll)', value: parseFloat(biayaOperasional||0)}, {name: 'Gaji Karyawan', value: parseFloat(biayaGajiKaryawan||0)}, {name: 'Biaya Sewa Tempat', value: parseFloat(biayaSewa||0)}]}`;
    } else if (file.includes('IndustriTempeCalculator')) {
      expenseDetailsStr = `expenseDetails={[{name: 'Kedelai', value: expenses?.kedelai || 0}, {name: 'Ragi', value: expenses?.ragi || 0}, {name: 'Plastik/Daun', value: expenses?.plastik || 0}, {name: 'Kayu Bakar/Gas', value: expenses?.kayuBakar || 0}, {name: 'Listrik & Air', value: expenses?.listrikAir || 0}, {name: 'Transportasi', value: expenses?.transportasi || 0}, {name: 'Gaji Karyawan', value: expenses?.karyawan || 0}]}`;
    } else if (file.includes('TernakKambingCalculator')) {
      expenseDetailsStr = `expenseDetails={[{name: 'Pakan', value: expenses?.pakan || 0}, {name: 'Obat & Vitamin', value: expenses?.obat || 0}, {name: 'Pemeliharaan Kandang', value: expenses?.kandang || 0}, {name: 'Gaji Anak Kandang', value: expenses?.gaji || 0}, {name: 'Listrik & Air', value: expenses?.listrik || 0}, {name: 'Transportasi', value: expenses?.transport || 0}]}`;
    } else if (file.includes('TokoBangunanCalculator')) {
      expenseDetailsStr = `expenseDetails={modeBiaya === 'Global' ? [{name: 'Modal Operasional', value: modalGlobal}] : [{name: 'Kulakan Semen', value: expenses?.kulakanSemen || 0}, {name: 'Kulakan Pasir/Besi', value: expenses?.kulakanBahan || 0}, {name: 'Gaji Karyawan', value: expenses?.karyawan || 0}, {name: 'Listrik & Telepon', value: expenses?.listrik || 0}, {name: 'Transport/Kuli', value: expenses?.transport || 0}]}`;
    }

    content = content.replace(
      /<BusinessConclusion totalIncome={([^}]+)} totalExpense={([^}]+)} netProfitTahunan={([^}]+)} \/>/,
      `<BusinessConclusion namaResponden={typeof namaResponden !== 'undefined' ? namaResponden : ''} namaUsaha={typeof activeKbli !== 'undefined' && activeKbli?.name ? activeKbli.name : 'usaha ini'} totalIncome={$1} totalExpense={$2} netProfitTahunan={$3} ${expenseDetailsStr} />`
    );
    
    // Some files might have different formatting for BusinessConclusion (like line breaks)
    // So let's also do a general replace:
    if (!content.includes('expenseDetails=')) {
      content = content.replace(
        /<BusinessConclusion([\s\S]*?)\/>/,
        `<BusinessConclusion namaResponden={typeof namaResponden !== 'undefined' ? namaResponden : ''} namaUsaha={typeof activeKbli !== 'undefined' && activeKbli?.name ? activeKbli.name : 'usaha ini'} $1 ${expenseDetailsStr} />`
      );
    }

    fs.writeFileSync(file, content);
  } else {
    console.log(`Failed to find blocks in ${file} (I:${incomeStart} E:${expenseStart} L:${layoutEnd})`);
  }
});

// For QuickCalculator, just replace the conclusion
let qcContent = fs.readFileSync('src/components/QuickCalculator.jsx', 'utf8');
qcContent = qcContent.replace(
  /<BusinessConclusion([^>]+)\/>/,
  `<BusinessConclusion namaResponden={typeof namaResponden !== 'undefined' ? namaResponden : ''} namaUsaha={typeof activeKbli !== 'undefined' && activeKbli?.name ? activeKbli.name : 'usaha ini'} $1 expenseDetails={[{name: 'Pengeluaran/Biaya Operasional', value: parseFloat(pengeluaran || 0) * (periode === 'Hari' ? 30 : (periode === 'Minggu' ? 4 : 1)) }]} />`
);
fs.writeFileSync('src/components/QuickCalculator.jsx', qcContent);
