const fs = require('fs');

const origMobile = JSON.parse(fs.readFileSync('.project/analysis/audit/lighthouse/report_murrplastik_mobile_protools.com.vn-20261011T223638.json', 'utf8'));
const origDesktop = JSON.parse(fs.readFileSync('.project/analysis/audit/lighthouse/report_murrplastik_desktop_protools.com.vn-20261011T223638.json', 'utf8'));

function compare(label, orig, next) {
  console.log(`\n================== ${label} ==================`);
  console.log('Category Scores:');
  for (const [k, v] of Object.entries(orig.categories)) {
    const origScore = Math.round(v.score * 100);
    const nextCat = next.categories[k];
    const nextScore = nextCat ? Math.round(nextCat.score * 100) : 'N/A';
    const diff = nextScore !== 'N/A' ? (nextScore - origScore) : 0;
    const sign = diff > 0 ? `(+${diff})` : diff < 0 ? `(${diff})` : '(=)';
    console.log(`  * ${v.title.padEnd(16)}: ${origScore} -> ${nextScore} ${sign}`);
  }

  console.log('\nKey Performance Metrics:');
  const metrics = [
    'first-contentful-paint',
    'largest-contentful-paint',
    'total-blocking-time',
    'speed-index',
    'cumulative-layout-shift'
  ];
  for (const m of metrics) {
    const oM = orig.audits[m];
    const nM = next.audits[m];
    console.log(`  * ${m.padEnd(26)}: ${oM ? oM.displayValue : 'N/A'} -> ${nM ? nM.displayValue : 'N/A'}`);
  }

  console.log('\nBest Practices Failing Audits:');
  for (const ref of next.categories['best-practices'].auditRefs) {
    const a = next.audits[ref.id];
    if (a && a.score !== null && a.score < 1) {
      console.log(`  ! [${ref.id}] score=${a.score}: ${a.title}`);
      if (a.displayValue) console.log(`      value: ${a.displayValue}`);
      if (a.details && a.details.items) console.log(`      items count: ${a.details.items.length}`);
    }
  }
}

if (fs.existsSync('.project/analysis/audit/lighthouse/report_verify_mobile.json')) {
  const newMobile = JSON.parse(fs.readFileSync('.project/analysis/audit/lighthouse/report_verify_mobile.json', 'utf8'));
  compare('MOBILE VERIFICATION', origMobile, newMobile);
}

if (fs.existsSync('.project/analysis/audit/lighthouse/report_verify_desktop.json')) {
  const newDesktop = JSON.parse(fs.readFileSync('.project/analysis/audit/lighthouse/report_verify_desktop.json', 'utf8'));
  compare('DESKTOP VERIFICATION', origDesktop, newDesktop);
}
