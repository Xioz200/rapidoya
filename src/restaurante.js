// 1. Función original con Callback
export const verificarRestaurante = (nombreRestaurante, callback) => {
    // Generar un tiempo de espera aleatorio entre 1 y 2 segundos (1000ms a 2000ms)
    const tiempoEspera = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;

    setTimeout(() => {
        // Generar un número aleatorio entre 0 y 1 para calcular el 20% de probabilidad de fallo
        const probabilidadFallo = Math.random();

        if (probabilidadFallo < 0.20) {
            // El patrón estándar en Node.js es: callback(error, data)
            callback(new Error(`El restaurante ${nombreRestaurante} está cerrado o fuera de cobertura.`), null);
        } else {
            const infoRestaurante = {
                nombre: nombreRestaurante,
                estado: "Disponible",
                tiempoEstimadoPreparacion: "15 min"
            };
            callback(null, infoRestaurante);
        }
    }, tiempoEspera);
};

// 2. Adaptador (Promisificación)
// Esta es la función que se exporta para que el Integrante 6 la consuma con async/await
export const verificarRestaurantePromise = (nombreRestaurante) => {
    return new Promise((resolve, reject) => {
        // Llamamos a la función original que usa callbacks
        verificarRestaurante(nombreRestaurante, (error, data) => {
            if (error) {
                reject(error); // Si hay error, rechazamos la promesa
            } else {
                resolve(data); // Si es exitoso, resolvemos la promesa con los datos
            }
        });
    });
};