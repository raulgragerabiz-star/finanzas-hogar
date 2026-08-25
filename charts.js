// js/charts.js
let charts = {};

export function renderCharts(gRaul, gMarta, totalCuenta, gastosComunes) {
  const canvas1 = document.getElementById('chartPersonales');
  const canvas2 = document.getElementById('chartCuenta');
  if (!canvas1 || !canvas2) return;

  if (charts.per) charts.per.destroy();
  charts.per = new Chart(canvas1, {
    type: 'doughnut',
    data: {
      labels: ['Raul', 'Marta'],
      datasets: [{ data: [gRaul, gMarta], backgroundColor: ['#3b82f6', '#ec4899'], borderWidth: 2, borderColor: '#fff' }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, cutout: '65%' }
  });

  if (charts.cue) charts.cue.destroy();
  charts.cue = new Chart(canvas2, {
    type: 'bar',
    data: {
      labels: ['Aportado', 'Gastos comunes', 'Restante'],
      datasets: [{ label: '€', data: [totalCuenta, gastosComunes, totalCuenta - gastosComunes], backgroundColor: ['#10b981', '#ef4444', '#6366f1'], borderRadius: 8 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
}
