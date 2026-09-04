// Funciones auxiliares

// Mediante una función async/await procesamos el pago
async function procesarPago() {
  console.log("💳 [Pago] Procesando tarjeta del cliente...");
  await new Promise(resolve => setTimeout(resolve, 400));
  return { idTransaccion: "TXN-98765", estado: "Aprobado" };
}

// Mediante una función async/await regresamos el dinero al cliente al no haber repartidor disponible
async function regresarPago(idTransaccion) {
  console.log(`🔄 [Compensación] Regresando el pago ${idTransaccion}... devolviendo el dinero al cliente.`);
  await new Promise(resolve => setTimeout(resolve, 400));
  console.log("✅ [Compensación] Dinero devuelto con éxito.");
}

/* La función se encarga de encontrar al repartidor, simulando un retardo de red 
   y un porcentaje de fallo del 10% que activará la compensación en el orquestador */
function asignarRepartidor(zonaEntrega) {
  //  Crea un objeto Promise para manejar operaciones asíncronas antiguas (como setTimeout) con éxito (resolve) o error (reject).
  return new Promise((resolve, reject) => {
    const retardo = Math.floor(Math.random() * (2500 - 1000 + 1)) + 1000;

    setTimeout(() => {
      const fallo = Math.random() <= 0.10; 

      if (fallo) {
        // Cambia el estado de la promesa a "rechazada" pasando un Error, lo cual activa automáticamente el bloque catch del orquestador.
        reject(new Error(`No hay repartidores disponibles en la zona: ${zonaEntrega}`));
      } else {
        resolve({
          idRepartidor: "REP-456",
          zona: zonaEntrega,
          tiempoBusqueda: retardo + "ms"
        });
      }
    }, retardo);
  });
}


// ORQUESTADOR CENTRAL


async function procesarPedido(zona) {
  console.log(`\n----------------------------------------`);
  console.log(`📦 [Pedido] Nueva orden recibida para la zona: ${zona}`);
  
  /* Variable de estado transaccional: actúa como "bandera" para saber si 
     el dinero ya salió del banco del cliente y requerirá reembolso si algo falla.*/
  let idTransaccionActual = null;

  try {
    const transaccion = await procesarPago();
    idTransaccionActual = transaccion.idTransaccion;
    console.log(`✅ [Pago] Aprobado (ID: ${idTransaccionActual})`);

    console.log("🛵 [Repartidor] Buscando conductor en el área...");
    const repartidor = await asignarRepartidor(zona);
    
    console.log(`🎉 ¡Éxito! Repartidor ${repartidor.idRepartidor} asignado (Búsqueda tardó ${repartidor.tiempoBusqueda}).`);

  } catch (errorRepartidor) {
    console.log(`❌ [Alerta]: ${errorRepartidor.message}`);

    /* Patrón de compensación condicional: Si el pago se hizo pero la logística falló,
       ejecutamos la devolución de forma limpia. */
    if (idTransaccionActual) {
      await regresarPago(idTransaccionActual);
    }

    console.log("⚠️ [Resultado]: Pedido cancelado.");
  }
}

procesarPedido("Centro");