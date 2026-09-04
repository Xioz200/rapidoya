// ============================================
// MÓDULO DE REPARTIDOR - Corregido
// ============================================

// Exportación moderna (ES Modules)
export const asignarRepartidor = (zonaEntrega) => {
    return new Promise((resolve, reject) => {
        // Retardo simulado entre 1000 y 2500 ms
        const retardo = Math.floor(Math.random() * (2500 - 1000 + 1)) + 1000;

        setTimeout(() => {
            // 10% de probabilidad de fallo
            const fallo = Math.random() <= 0.10; 

            if (fallo) {
                // RF-7: Objeto de error enriquecido
                const error = new Error(`No hay repartidores disponibles en la zona: ${zonaEntrega}`);
                error.etapa = "Asignación de Repartidor";
                error.causa = "Alta demanda o lluvia en la zona";
                error.datos = { zona: zonaEntrega };
                
                reject(error);
            } else {
                resolve({
                    idRepartidor: "REP-" + Math.floor(Math.random() * 10000),
                    zona: zonaEntrega,
                    tiempoBusqueda: retardo
                });
            }
        }, retardo);
    });
};