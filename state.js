// js/state.js
export const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export function currentMonthKey() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}

export function defaultMonthData() {
  return {
    ingresosA: 1500, ingresosB: 1500, splitMode: '5050',
    aportaCuentaA: 700, aportaCuentaB: 500,
    alquiler: [
      { id: 'alq-1', nombre: 'Alquiler', importe: 900, compartido: true, aportaA: 0, aportaB: 0, estable: true },
      { id: 'alq-2', nombre: 'Luz', importe: 70, compartido: true, aportaA: 0, aportaB: 0, estable: true }
    ],
    suscripciones: [],
    fijos: [],
    alimentacion: [],
    ocio: [],
    delivery: [],
    ahorro: [],
    metaAhorro: 500
  };
}

export let appData = {
  meses: {},
  deudas: [],
  pagos: [],
  mesActivo: currentMonthKey()
};

export function setAppData(newData) {
  appData = newData;
}
