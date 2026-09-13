async function loadRows() {
  const res = await fetch('https://raw.githubusercontent.com/GavnPro/Chiphisaubanhang/main/data.json');
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

loadRows().then((ROWS) => {


const fmt = n => (n||0).toLocaleString('vi-VN') + ' ₫';
const COLORS = ['#3d7eff','#f59e0b','#22c55e','#f43f5e','#a78bfa','#14b8a6'];
const tick = { color:'#93a0b8' };
const grid = { color:'#1c2942' };

new Chart(document.getElementById('cMonth'), {
  type: 'bar',
  data: {
    labels: ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"],
    datasets: [
      { label: 'Phân xưởng 1', data: [63517551, 198986296, 66846424, 71075552, 199861505, 73895052, 68248586, 200442377], backgroundColor: '#3d7eff', borderRadius: 4 },
      { label: 'Phân xưởng 2', data: [59685293, 75812215, 17890000, 12134340, 120044535, 98926516, 85080401, 29130159], backgroundColor: '#f59e0b', borderRadius: 4 }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#c9d4ea' } },
      tooltip: { callbacks: { label: c => c.dataset.label + ': ' + fmt(c.parsed.y) } }
    },
    scales: {
      x: { stacked: true, ticks: tick, grid: grid },
      y: { stacked: true, ticks: { color:'#93a0b8', callback: v => (v/1e6).toFixed(0)+' tr' }, grid: grid }
    }
  }
});

new Chart(document.getElementById('cLoai'), {
  type: 'doughnut',
  data: { labels: ["Bể vỡ", "Lệch màu", "Ố vàng", "Lệch kích thước", "Lỗi men", "Cong mo, nhầm gạch, Lỗi khác"], datasets: [{ data: [608720773, 301469126, 284764281, 101143575, 60079951, 85399096], backgroundColor: COLORS, borderColor: '#121a2b', borderWidth: 2 }] },
  options: {
    plugins: {
      legend: { position: 'right', labels: { color: '#c9d4ea', boxWidth: 12 } },
      tooltip: { callbacks: { label: c => c.label + ': ' + fmt(c.parsed) } }
    }
  }
});

new Chart(document.getElementById('cPlant'), {
  type: 'bar',
  data: {
    labels: ['Phân xưởng 1','Phân xưởng 2'],
    datasets: [{ label: 'Chi phí', data: [942873343,498703459], backgroundColor: ['#3d7eff','#f59e0b'], borderRadius: 6 }]
  },
  options: {
    indexAxis: 'y',
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => fmt(c.parsed.x) } } },
    scales: {
      x: { ticks: { color:'#93a0b8', callback: v => (v/1e6).toFixed(0)+' tr' }, grid: grid },
      y: { ticks: tick, grid: grid }
    }
  }
});

new Chart(document.getElementById('cTop'), {
  type: 'bar',
  data: {
    labels: ["DL273 — CÔNG TY CỔ PHẦN TẬP ĐOÀN UNIS", "DL217 — CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ VẬ", "DL354 ĐQ — CÔNG TY CỔ PHẦN KIẾN HƯNG BÌNH T", "DL603 — CÔNG TY TNHH THƯƠNG MẠI XNK TÂY ", "DL669 — CÔNG TY TNHH FALUS VN", "DL373DQ — CÔNG TY CỔ PHẦN TAM MÃ (ĐQ)", "DL289 — CÔNG TY TNHH LINH NHƠN", "DL404DQ — CÔNG TY TNHH HƯƠNG TÀI (ĐQ)", "DL308 — CÔNG TY TNHH THƯƠNG MẠI HIỂN NGA", "DL331 — CÔNG TY CỔ PHẦN GẠCH ỐP LÁT HÒA ", "DL518 — CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH ", "131CONGTHANH — HỘ KINH DOANH VÕ CHÍ CÔNG", "DL563 — CÔNG TY CỔ PHẦN TẬP ĐOÀN SHIFU V", "DL661 — CÔNG TY TNHH TOPAZ CERAMIC", "DL326 — CÔNG TY TNHH THƯƠNG MẠI PHÚ CƯỜN"],
    datasets: [{ label: 'Chi phí', data: [152315638, 111401521, 106064565, 91029591, 89530624, 72792514, 55876837, 43726728, 39212240, 37301353, 34035500, 32448000, 32378131, 31280760, 28915072], backgroundColor: '#60a5fa', borderRadius: 4 }]
  },
  options: {
    indexAxis: 'y',
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => fmt(c.parsed.x) } } },
    scales: {
      x: { ticks: { color:'#93a0b8', callback: v => (v/1e6).toFixed(0)+' tr' }, grid: grid },
      y: { ticks: { color:'#c9d4ea', font: { size: 10 } }, grid: grid }
    }
  }
});

let sortKey = 'ngay', sortDir = 1, page = 0, pageSize = 40;
function filtered() {
  const q = document.getElementById('q').value.toLowerCase();
  const px = document.getElementById('fPx').value;
  const loai = document.getElementById('fLoai').value;
  const thang = document.getElementById('fThang').value;
  return ROWS.filter(r => {
    if (px && r.px !== px) return false;
    if (loai && r.loai !== loai) return false;
    if (thang && r.thang !== thang) return false;
    if (q) {
      const blob = (r.ma+' '+r.ten+' '+r.dien+' '+r.nhom).toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  }).sort((a,b) => {
    let va=a[sortKey], vb=b[sortKey];
    if (sortKey==='tien') return (va-vb)*sortDir;
    return String(va).localeCompare(String(vb),'vi')*sortDir;
  });
}
function render() {
  const rows = filtered();
  const pages = Math.max(1, Math.ceil(rows.length/pageSize));
  if (page >= pages) page = pages-1;
  const slice = rows.slice(page*pageSize, (page+1)*pageSize);
  const tb = document.getElementById('tbody');
  tb.innerHTML = slice.map(r => `<tr>
    <td class="${r.px.includes('1')?'px1':'px2'}">${r.px}</td>
    <td>${r.nhom}</td><td>${r.ma}</td><td>${r.ten}</td>
    <td>${r.ngay.split('-').reverse().join('/')}</td>
    <td>${r.dien}</td>
    <td class="num">${fmt(r.tien)}</td>
    <td>${r.loai}</td>
  </tr>`).join('');
  const sum = rows.reduce((s,r)=>s+r.tien,0);
  document.getElementById('fltStat').textContent =
    rows.length + ' dòng · ' + fmt(sum);
  document.getElementById('pageinfo').textContent =
    'Trang ' + (page+1) + '/' + pages;
}
document.getElementById('q').addEventListener('input', () => { page=0; render(); });
document.getElementById('fPx').addEventListener('change', () => { page=0; render(); });
document.getElementById('fLoai').addEventListener('change', () => { page=0; render(); });
document.getElementById('fThang').addEventListener('change', () => { page=0; render(); });
document.getElementById('prev').onclick = () => { if (page>0) { page--; render(); } };
document.getElementById('next').onclick = () => { page++; render(); };
document.querySelectorAll('th[data-k]').forEach(th => {
  th.onclick = () => {
    const k = th.dataset.k;
    if (sortKey===k) sortDir *= -1; else { sortKey=k; sortDir=1; }
    render();
  };
});
render();

}).catch((err) => {
  document.body.innerHTML = '<pre style="padding:24px;font:14px/1.4 system-ui">Không tải được dữ liệu dashboard.\n' + String(err) + '</pre>';
  console.error(err);
});
