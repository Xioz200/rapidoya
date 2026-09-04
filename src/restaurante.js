// 1. Módulo heredado (RF-1)
// Se mantiene la firma original con callback para simular un sistema antiguo (legacy)
// y cumplir con la restricción de diseño de caja negra estipulada en el requerimiento.
export const verificarRestaurante = (nombreRestaurante, callback) => {
  // Aviso nativo sin librerías externas para cumplir la restricción de "0 paquetes npm"
  console.log(
    `\n⏳ Verificando disponibilidad de: ${nombreRestaurante}...`,
  );

  const tiempoEspera = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;

  setTimeout(() => {
    const probabilidadFallo = Math.random();

    // Utilizamos el patrón Error-First Callback estándar de Node.js para propagar
    // limpiamente la excepción (20% de fallo simulado) hacia el adaptador superior.
    if (probabilidadFallo < 0.2) {
      callback(
        new Error(
          `El restaurante ${nombreRestaurante} está cerrado o fuera de cobertura.`,
        ),
        null,
      );
    } else {
      const infoRestaurante = {
        nombre: nombreRestaurante,
        estado: "Disponible",
        tiempoEstimadoPreparacion: "15 min",
      };
      callback(null, infoRestaurante);
    }
  }, tiempoEspera);
};

// 2. Adaptador de Promisificación
// Envolvemos el callback heredado en una Promise nativa. Esto permite que el orquestador principal (app.js)
// pueda consumirlo utilizando async/await y try/catch, unificando el control de flujo sin modificar la firma original.
export const verificarRestaurantePromise = (nombreRestaurante) => {
  return new Promise((resolve, reject) => {
    verificarRestaurante(nombreRestaurante, (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
};
