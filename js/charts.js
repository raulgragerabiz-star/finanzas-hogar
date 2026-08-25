// js/charts.js
let chartInstance = null;

export function renderCharts(ingresosA, ingresosB, gastosA, gastosB) {
  const ctx = document.getElementById('chartPersonales');
  if (!ctx) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Raul', 'Marta'],
      datasets: [
        {
          label: 'Ingresos (€)',
          data: [ingresosA, ingresosB],
          backgroundColor: '#3b82f6',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
