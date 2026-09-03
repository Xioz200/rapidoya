// pago.js

function procesarPago(monto, datosCliente) {
    return new Promise((resolve, reject) => {

        // Espera aleatoria entre 1500 y 3000 ms
        const tiempo = Math.floor(Math.random() * 1501) + 1500;

        setTimeout(() => {

            // 25% de posibilidad de que falle
            const probabilidad = Math.random();

            if (probabilidad < 0.25) {
                const errores = [
                    "Fondos insuficientes",
                    "Tarjeta bloqueada",
                    "Tiempo de espera agotado"
                ];

                const error = errores[Math.floor(Math.random() * errores.length)];

                reject(new Error(error));
                return;
            }

            // Pago exitoso
            const idTransaccion = "TX-" + Date.now();

            resolve({
                exitoso: true,
                idTransaccion: idTransaccion,
                monto: monto,
                cliente: datosCliente
            });

        }, tiempo);
    });
}

module.exports = { procesarPago };