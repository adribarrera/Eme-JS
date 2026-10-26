/**
 * @file app.js
 * @description Sistema central de gestión y despacho de emergencias.
 * Simula el procesamiento de incidencias, asignación de dotaciones y el control de saturación.
 * @version 1.0.0
 */

/**
 * Global para habilitar o silenciar la salida detallada en consola.
 * @type {boolean}
 */
const _DEBUGMODE = true;

/**
 * @typedef {Object} Incidente
 * @property {number} id - Identificador único de la incidencia.
 * @property {string} descripcion - Resumen del siniestro.
 * @property {number} gravedad - Nivel de urgencia de 1 a 5.
 * @property {boolean} resuelta - Estado del incidente (true si ya se ha solucionado).
 */

/**
 * Lote de incidentes a procesar.
 * @type {Incidente[]}
 */
const loteIncidentes = [
    { id: 101, descripcion: "Gato atrapado en un árbol", gravedad: 1, resuelta: false },
    { id: 102, descripcion: "Falsa alarma de humo en local", gravedad: 1, resuelta: true },
    { id: 103, descripcion: "Incendio estructural en bloque de viviendas", gravedad: 5, resuelta: false },
    { id: 104, descripcion: "Contenedor ardiendo en la vía pública", gravedad: 3, resuelta: false },
    { id: 105, descripcion: "Inundación leve de un sótano", gravedad: 2, resuelta: true },
    { id: 106, descripcion: "Accidente de tráfico múltiple en la A-4", gravedad: 5, resuelta: false },
    { id: 107, descripcion: "Rescate en ascensor bloqueado", gravedad: 2, resuelta: false },
];

/**
 * Emite un log en la consola si el modo DEBUG está activo.
 * @param {string} mensaje - Cadena de texto formateada para mostrar.
 * @returns {void}
 */
function registrarLog(mensaje) {
    if (_DEBUGMODE) {
        console.log(mensaje);
    }
}

/**
 * Calcula el número de dotaciones necesarias dependiendo del nivel de gravedad.
 * Aplica un parseo para asegurar un cálculo entero.
 * @param {number|string} nivelGravedad - Nivel de urgencia (1-5).
 * @returns {number} Cantidad de vehículos de respuesta asignados.
 */
function calcularRecursos(nivelGravedad) {
    const gravedadNumerica = Number.parseInt(String(nivelGravedad), 10);
    switch (gravedadNumerica) {
        case 1:
            return 1;
        case 2:
            return 1;
        case 3:
            return 2;
        case 4:
            return 2;
        case 5:
            return 3;
        default:
            return 1;
    }
}

/**
 * Procesa un incidente, descuenta dotaciones y emite alertas de prioridad.
 * @param {Incidente} incidente - Objeto que representa la emergencia actual.
 * @param {number} recursosRestantes - Número actual de unidades operativas en base.
 * @returns {number} Dotaciones consumidas por esta incidencia concreta.
 */
function procesarIncidente(incidente, recursosRestantes) {
    const recursosRequeridos = calcularRecursos(incidente.gravedad);

    if (incidente.gravedad === 5) {
        console.error(
            `[ALERTA MÁXIMA CÓDIGO ROJO] -> Incidente #${incidente.id}: "${incidente.descripcion}" (Nivel: ${incidente.gravedad})`
        );
    }

    registrarLog(
        `[DESPACHO ASIGNADO] -> Incidente #${incidente.id} consume ${recursosRequeridos} dotación/es. Unidades en base antes del envío: ${recursosRestantes}.`
    );

    return recursosRequeridos;
}

/**
 * Bucle central del parque de emergencias.
 * Itera el lote de incidencias gestionando 'continue' para descartes y 'break' para fin de recursos.
 * @param {Incidente[]} listaIncidentes - Array con las incidencias a evaluar.
 * @param {number} totalRecursosIniciales - Capacidad operativa de vehículos del parque.
 * @returns {void}
 */
function gestionarParqueEmergencias(listaIncidentes, totalRecursosIniciales) {
    let recursosDisponibles = Number(totalRecursosIniciales);

    registrarLog(
        `[SISTEMA INICIADO] Flota inicial disponible: ${recursosDisponibles} dotaciones\n`
    );

    for (let i = 0; i < listaIncidentes.length; i++) {
        const actual = listaIncidentes[i];

        debugger; // Para la inspección del DevTools

        if (actual.resuelta === true) {
            registrarLog(
                `[OMITIDO] Incidente #${actual.id} ("${actual.descripcion}") ya fue resuelto previamente. Pasando al siguiente.`
            );
            continue;
        }

        if (recursosDisponibles <= 0) {
            console.error(
                `[SISTEMA COLAPSADO - BREAK] Recursos agotados (quedan: ${recursosDisponibles}). Se detiene el procesamiento de la cola de emergencias.`
            );
            break;
        }

        const asignados = procesarIncidente(actual, recursosDisponibles);
        recursosDisponibles -= asignados;

        registrarLog(
            `[ESTADO DEL PARQUE] Dotaciones restantes en base: ${Math.max(0, recursosDisponibles)}`
        );

        if (recursosDisponibles <= 0) {
            console.error(
                `[FLOTA AGOTADA - BREAK] El parque se ha quedado sin dotaciones tras el incidente #${actual.id}. Deteniendo servicio.`
            );
            break;
        }
    }

    registrarLog(
        `[FIN DEL PARTE] Cierre de turno. Recursos finales libres: ${Math.max(0, recursosDisponibles)}\n`
    );
}

gestionarParqueEmergencias(loteIncidentes, 6);