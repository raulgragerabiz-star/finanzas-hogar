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

// Inicialización de la aplicación al cargar la ventana
window.addEventListener('DOMContentLoaded', () => {
  // Cargar respaldo local si existe
  const local = localStorage.getItem('hogarDataV8');
  if (local) {
    try { setAppData(JSON.parse(local)); } catch(e) {}
  } else {
    appData.meses[currentMonthKey()] = defaultMonthData();
  }

  // Inicializar Firebase y Sincronización en Tiempo Real
  initFirebase(firebaseConfig, () => {
    renderAll();
  });

  initAuth((uid, role) => {
    console.log(`Usuario conectado como Rol [${role}] con UID: ${uid}`);
  });

  renderAll();
});

export function renderAll() {
  // Aquí ejecutas las funciones que pintan las tablas, estadísticas y llaman a renderCharts()
  // Ejemplo:
  // updateMonthLabel();
  // recalcAll();
}

// Función global de guardado con debounce para eventos de input
let timeout = null;
window.debouncedSave = function() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    localStorage.setItem('hogarDataV8', JSON.stringify(appData));
    saveToFirebase();
  }, 400);
}
