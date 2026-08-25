// js/app.js
import { appData, setAppData, currentMonthKey, defaultMonthData } from './state.js';
import { initFirebase, saveToFirebase, initAuth } from './firebase-sync.js';
import { renderCharts } from './charts.js';

const firebaseConfig = {
  apiKey: "AIzaSyC0QOu3nCH_Cri95OFK9asm3Ow3X13nWHA",
  authDomain: "finanzas-hogar-edba8.firebaseapp.com",
  projectId: "finanzas-hogar-edba8",
  storageBucket: "finanzas-hogar-edba8.firebasestorage.app",
  messagingSenderId: "114386378204",
  appId: "1:114386378204:web:8c5ea935cc813b9c158319"
};

window.addEventListener('DOMContentLoaded', () => {
  const local = localStorage.getItem('hogarDataV8');
  if (local) {
    try { setAppData(JSON.parse(local)); } catch(e) {}
  } else {
    appData.meses[currentMonthKey()] = defaultMonthData();
  }

  initFirebase(firebaseConfig, () => {
    syncUIFromState();
    renderAll();
  });

  initAuth((uid, role) => {
    console.log(`Usuario conectado como Rol [${role}] con UID: ${uid}`);
  });

  syncUIFromState();
  renderAll();
});

export function renderAll() {
  const mKey = appData.mesActivo || currentMonthKey();
  if (!appData.meses[mKey]) appData.meses[mKey] = defaultMonthData();
  const mes = appData.meses[mKey];

  // Renderizar tabla de gastos fijos / alquiler
  const tbody = document.getElementById('fixedExpensesTable');
  if (tbody) {
    tbody.innerHTML = '';
    if (mes.alquiler && mes.alquiler.length > 0) {
      mes.alquiler.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><input type="text" value="${item.nombre}" oninput="updateFixedExpense(${index}, 'nombre', this.value)" style="border:none; background:transparent; font-size:1rem; width:100%;"></td>
          <td><input type="number" value="${item.importe}" oninput="updateFixedExpense(${index}, 'importe', this.value)" style="width:100px; padding:0.3rem;"></td>
          <td><input type="checkbox" ${item.compartido ? 'checked' : ''} onchange="updateFixedExpense(${index}, 'compartido', this.checked)"></td>
          <td><button class="btn btn-sm" onclick="removeFixedExpense(${index})">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  // Renderizar gráficos de distribución
  renderCharts(mes.ingresosA, mes.ingresosB, 1200, 970);
}

function syncUIFromState() {
  const mKey = appData.mesActivo || currentMonthKey();
  if (!appData.meses[mKey]) appData.meses[mKey] = defaultMonthData();
  const mes = appData.meses[mKey];

  const ingA = document.getElementById('ingresosA');
  const ingB = document.getElementById('ingresosB');
  const split = document.getElementById('splitMode');
  const metaAhorro = document.getElementById('metaAhorro');

  if (ingA) ingA.value = mes.ingresosA;
  if (ingB) ingB.value = mes.ingresosB;
  if (split) split.value = mes.splitMode;
  if (metaAhorro) metaAhorro.value = mes.metaAhorro;
}

function syncStateFromUI() {
  const mKey = appData.mesActivo || currentMonthKey();
  if (!appData.meses[mKey]) appData.meses[mKey] = defaultMonthData();
  const mes = appData.meses[mKey];

  const ingA = document.getElementById('ingresosA');
  const ingB = document.getElementById('ingresosB');
  const split = document.getElementById('splitMode');
  const metaAhorro = document.getElementById('metaAhorro');

  if (ingA) mes.ingresosA = parseFloat(ingA.value) || 0;
  if (ingB) mes.ingresosB = parseFloat(ingB.value) || 0;
  if (split) mes.splitMode = split.value;
  if (metaAhorro) mes.metaAhorro = parseFloat(metaAhorro.value) || 0;
}

let timeout = null;
window.debouncedSave = function() {
  syncStateFromUI();
  renderAll();
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    localStorage.setItem('hogarDataV8', JSON.stringify(appData));
    saveToFirebase();
  }, 400);
};

window.addFixedExpense = function() {
  const mKey = appData.mesActivo || currentMonthKey();
  if (!appData.meses[mKey]) appData.meses[mKey] = defaultMonthData();
  appData.meses[mKey].alquiler.push({ id: 'g-' + Date.now(), nombre: 'Nuevo Gasto', importe: 50, compartido: true });
  window.debouncedSave();
};

window.updateFixedExpense = function(index, field, value) {
  const mKey = appData.mesActivo || currentMonthKey();
  const mes = appData.meses[mKey];
  if (field === 'importe') value = parseFloat(value) || 0;
  mes.alquiler[index][field] = value;
  window.debouncedSave();
};

window.removeFixedExpense = function(index) {
  const mKey = appData.mesActivo || currentMonthKey();
  const mes = appData.meses[mKey];
  mes.alquiler.splice(index, 1);
  window.debouncedSave();
};

window.addDebt = function() {
  alert('Apartado de deudas listo para configurar.');
};
