const _DEBOUGMODE = true;

const loteIncidentes = [
    { id: 101, descripcion: "Gato atrapado en un árbol", gravedad: 1, resuelta: false },
    { id: 102, descripcion: "Falsa alarma de humo en local", gravedad: 1, resuelta: true },
    { id: 103, descripcion: "Incendio estructural en bloque de viviendas", gravedad: 5, resuelta: false },
    { id: 104, descripcion: "Contenedor ardiendo en la vía pública", gravedad: 3, resuelta: false },
    { id: 105, descripcion: "Inundación leve de un sótano", gravedad: 2, resuelta: true },
    { id: 106, descripcion: "Accidente de tráfico múltiple en la A-4", gravedad: 5, resuelta: false },
    { id: 107, descripcion: "Rescate en ascensor bloqueado", gravedad: 2, resuelta: false },
];

function registrarLog(mensaje) {
    if (_DEBOUGMODE) {
        console.log(mensaje);
    }
}

function calcularRecursos(nivelGravedad) {
    const gravedadNumerica = Number.parseInt(String(nivelGravedad), 10);
    switch (garvedadNumerica) {
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

function procesarIncidente(incidente, recursoRestantes) {
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

function gestionarParqueEmergencias(listaIncidentes, totalRecursosIniciales) {
    let recursosDisponibles = Number(totalRecursosIniciales);

    registrarLog(
        `[SISTEMA INICIADO] Flota inicial disponible: ${recursosDisponibles} dotaciones\n`
    );

    for (let i = 0; i < listaIncidentes.length; i++) {
        const actual = listaIncidentes[i];

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