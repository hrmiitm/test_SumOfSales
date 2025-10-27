document.addEventListener('DOMContentLoaded', () => {
  fetch('sales.csv')
    .then(resp => {
      if (!resp.ok) throw new Error('Network response was not ok');
      return resp.text();
    })
    .then(text => {
      const rows = parseCSV(text);
      if (rows.length === 0) throw new Error('No data');

      const header = rows[0].map(h => h.trim().toLowerCase());
      const catIdx = header.indexOf('category');
      const salesIdx = header.indexOf('sales');
      if (catIdx === -1 || salesIdx === -1) {
        throw new Error('Required columns not found');
      }

      let sum = 0;
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (!r) continue;
        const cat = r[catIdx] ? r[catIdx].trim() : '';
        const salesStr = r[salesIdx] ? r[salesIdx].trim() : '';
        const catNum = Number(cat);
        if (Number.isFinite(catNum) && catNum <= 26) {
          const salesNum = parseFloat(salesStr.replace(/[^0-9.-]+/g, ''));
          if (!Number.isNaN(salesNum)) sum += salesNum;
        }
      }

      const out = document.getElementById('total-sales');
      out.textContent = sum.toFixed(2);
    })
    .catch(err => {
      console.error(err);
      const out = document.getElementById('total-sales');
      out.textContent = 'Error';
    });
});

// Minimal CSV parser that supports quoted fields and double-quote escaping
function parseCSV(text) {
  const rows = [];
  let row = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i+1];
    if (inQuotes) {
      if (ch === '"') {
        if (next === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(cur);
        cur = '';
      } else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && next === '\n') continue;
        row.push(cur);
        rows.push(row);
        row = [];
        cur = '';
      } else {
        cur += ch;
      }
    }
  }
  // flush
  if (cur !== '' || inQuotes || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }
  // remove trailing empty row if present (e.g. final newline)
  if (rows.length && rows[rows.length-1].length === 1 && rows[rows.length-1][0] === '') rows.pop();
  return rows;
}
