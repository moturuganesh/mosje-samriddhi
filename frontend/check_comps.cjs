const fs = require('fs');
const cp = require('child_process');

const comps = [
  './api',
  './components/Navbar',
  './components/Step1_Ingestion',
  './components/Step2_HITLForm',
  './components/Step3_SchemeMoratorium',
  './components/Step4_BranchMap',
  './components/SanctionDocketModal',
  './components/KioskVoiceAssistant',
  './components/AdminDashboard'
];


for (const c of comps) {
  fs.writeFileSync('src/main.jsx', `import ${JSON.stringify(c)};\nconsole.log('OKT');``);
  try {
    cp.execSync('npm run build', { stdio: 'ignore' });
    console.log('PASS:', c);
  } catch (err) {
    console.log('FAIL:', c);
  }
}
