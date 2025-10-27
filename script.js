// script.js — fetches sales.csv, parses it and computes sum of sales where category <= 26

function parseCSVRow(row){
  // Robust CSV row parser that handles quoted fields and commas inside quotes
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for(let i=0;i<row.length;i++){
    const ch = row[i];
    if(ch === '"'){
      // handle double-quote escape ""
      if(inQuotes && row[i+1] === '"'){
        cur += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if(ch === ',' && !inQuotes){
      fields.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}

function showStatus(msg){
  const s = document.getElementById('status');
  if(s) s.textContent = msg;
}

function showTotal(value){
  const el = document.getElementById('total-sales');
  if(el) el.textContent = value;
}

async function computeTotal(){
  try{
    showStatus('Fetching sales.csv…');
    const res = await fetch('sales.csv');
    if(!res.ok) throw new Error('Failed to fetch sales.csv: ' + res.status + ' ' + res.statusText);
    const text = await res.text();
    showStatus('Parsing CSV…');

    const rows = text.split(/\r?\n/).filter(r=>r.trim().length>0);
    if(rows.length === 0) throw new Error('CSV is empty');

    const header = parseCSVRow(rows[0]);
    const lower = header.map(h=>h.trim().toLowerCase());
    const catIdx = lower.indexOf('category');
    const salesIdx = lower.indexOf('sales');
    if(catIdx === -1 || salesIdx === -1) throw new Error('CSV missing required columns');

    let sum = 0;
    for(let i=1;i<rows.length;i++){
      const fields = parseCSVRow(rows[i]);
      // skip malformed rows
      if(fields.length <= Math.max(catIdx,salesIdx)) continue;
      const catRaw = fields[catIdx].trim();
      const salesRaw = fields[salesIdx].trim();
      const cat = Number(catRaw);
      const sales = Number(salesRaw);
      if(Number.isFinite(cat) && Number.isFinite(sales)){
        if(cat <= 26) sum += sales;
      }
    }

    // Round to 2 decimals and display
    const rounded = sum.toFixed(2);
    showTotal(rounded);
    showStatus('Done');
  }catch(err){
    console.error(err);
    showStatus('Error: ' + err.message);
    showTotal('N/A');
  }
}

window.addEventListener('DOMContentLoaded', ()=>{
  computeTotal();
});
