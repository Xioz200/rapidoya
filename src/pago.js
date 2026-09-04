// ============================================
// MÓDULO DE PAGO - Corregido
// ============================================

// Exportación moderna (ES Modules)
export const procesarPago = (monto, datosCliente) => {
    return new Promise((resolve, reject) => {
        // Espera aleatoria entre 1500 y 3000 ms[cite: 1]
        const tiempo = Math.floor(Math.random() * (3000 - 1500 + 1)) + 1500;

        setTimeout(() => {
            // 25% de posibilidad conjunta de que falle[cite: 1]
            const probabilidad = Math.random();

            if (probabilidad < 0.25) {
                const errores = [
                    "Fondos insuficientes",
                    "Tarjeta bloqueada",
                    "Tiempo de espera agotado"
                ];
                
                // Selecciona la causa exacta del fallo aleatoriamente
                const causaError = errores[Math.floor(Math.random() * errores.length)];

                // RF-7: Objeto de error enriquecido para el equipo de soporte[cite: 1]
                const error = new Error(`El banco rechazó la transacción: ${causaError}`);
                error.etapa = "Procesamiento de Pago";
                error.causa = causaError;
                error.datos = { monto: monto, cliente: datosCliente };
                
                reject(error);
                return;
            }

            // Pago exitoso
            const idTransaccion = "TX-" + Date.now();

            resolve({
                exitoso: true,
                idTransaccion: idTransaccion,
                monto: monto,
                cliente: datosCliente,
                mensaje: `Pago de $${monto} aprobado. TX: ${idTransaccion}`
            });

        }, tiempo);
    });
};

// NUEVA FUNCIÓN: Lógica de compensación requerida por RF-4[cite: 1]
// Esta función será llamada por el orquestador principal si la asignación de repartidor falla.
export const reversarPago = (idTransaccion) => {
    return new Promise((resolve) => {
        // Simulamos un tiempo rápido de respuesta del banco para la devolución (500 a 1000 ms)
        const tiempoReversion = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
        
        console.log(`\n🔄 [Módulo Pago] Iniciando reversión de la transacción ${idTransaccion}...`);
        
        setTimeout(() => {
            console.log(`✅ [Módulo Pago] Reversión exitosa. Fondos devueltos al método de pago original.`);
            resolve({
                reversado: true,
                idTransaccion: idTransaccion,
                mensaje: "Transacción reversada por falta de repartidores"
            });
        }, tiempoReversion);
    });
};