// js/app.js
import { appData, setAppData, currentMonthKey, defaultMonthData } from './state.js';
import { initFirebase, saveToFirebase, initAuth } from './firebase-sync.js';
import { renderCharts } from './charts.js';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456",
  appId: "1:123456:web:abcdef"
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
  const mes = appData.meses[mKey] || defaultMonthData();
  
  // Renderizar gráficos de ejemplo (Gastos Raul vs Marta)
  renderCharts(750, 650, 1200, 970);
}

function syncUIFromState() {
  const mKey = appData.mesActivo || currentMonthKey();
  if (!appData.meses[mKey]) appData.meses[mKey] = defaultMonthData();
  const mes = appData.meses[mKey];

  const ingA = document.getElementById('ingresosA');
  const ingB = document.getElementById('ingresosB');
  const split = document.getElementById('splitMode');

  if (ingA) ingA.value = mes.ingresosA;
  if (ingB) ingB.value = mes.ingresosB;
  if (split) split.value = mes.splitMode;
}

function syncStateFromUI() {
  const mKey = appData.mesActivo || currentMonthKey();
  if (!appData.meses[mKey]) appData.meses[mKey] = defaultMonthData();
  const mes = appData.meses[mKey];

  const ingA = document.getElementById('ingresosA');
  const ingB = document.getElementById('ingresosB');
  const split = document.getElementById('splitMode');

  if (ingA) mes.ingresosA = parseFloat(ingA.value) || 0;
  if (ingB) mes.ingresosB = parseFloat(ingB.value) || 0;
  if (split) mes.splitMode = split.value;
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
}
