// js/firebase-sync.js
import { appData, setAppData } from './state.js';

let db = null;
let isRemoteUpdating = false;

export function initFirebase(config, onSyncedCallback) {
  if (!config || config.apiKey === "TU_API_KEY") {
    console.warn("Firebase no configurado correctamente. Usando solo almacenamiento local.");
    updateSyncStatus('local', 'Modo Local (Sin Firebase)');
    return;
  }

  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    db = firebase.firestore();
    
    updateSyncStatus('syncing', 'Sincronizando...');

    // Escuchar cambios en tiempo real desde la nube
    db.collection('finanzas').doc('hogarData').onSnapshot((doc) => {
      if (doc.exists) {
        isRemoteUpdating = true;
        const remoteData = doc.data();
        setAppData(remoteData);
        localStorage.setItem('hogarDataV8', JSON.stringify(remoteData));
        if (typeof onSyncedCallback === 'function') onSyncedCallback();
        updateSyncStatus('ok', 'Sincronizado');
        isRemoteUpdating = false;
      } else {
        saveToFirebase(); // Crear documento inicial si no existe
      }
    }, (error) => {
      console.error("Error de Firestore:", error);
      updateSyncStatus('error', 'Error de conexión');
    });

  } catch (e) {
    console.error("Error inicializando Firebase:", e);
    updateSyncStatus('error', 'Fallo en Firebase');
  }
}

export function initAuth(onAuthChange) {
  try {
    if (!firebase.apps.length) return;
    firebase.auth().signInAnonymously().then((credential) => {
      if (typeof onAuthChange === 'function') {
        onAuthChange(credential.user.uid, 'admin');
      }
    }).catch((error) => {
      console.error("Error en autenticación anónima:", error);
    });
  } catch (e) {
    console.log("Auth no disponible o ya iniciada.");
  }
}

export function saveToFirebase() {
  if (isRemoteUpdating || !db) return;
  updateSyncStatus('syncing', 'Guardando...');
  
  db.collection('finanzas').doc('hogarData').set(appData)
    .then(() => {
      updateSyncStatus('ok', 'Sincronizado');
    })
    .catch((error) => {
      console.error("Error al guardar en Firestore:", error);
      updateSyncStatus('error', 'Error al guardar');
    });
}

function updateSyncStatus(status, text) {
  const statusEl = document.getElementById('syncStatus');
  const textEl = document.getElementById('syncText');
  if (!statusEl || !textEl) return;

  statusEl.className = `sync-status sync-${status}`;
  textEl.textContent = text;
}
