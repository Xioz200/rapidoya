// ============================================================
// RAPIDOYA - PROYECTO INTEGRADOR
// ============================================================

// ============================================================
// MÓDULO: RESTAURANTE
// ============================================================

function verificarRestaurante(nombreRestaurante, callback) {
    console.log(
        `\n⏳ [Restaurante] Verificando disponibilidad de: ${nombreRestaurante}...`
    );

    const tiempoEspera =
        Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;

    setTimeout(() => {
        const probabilidadFallo = Math.random();

        if (probabilidadFallo < 0.2) {
            callback(
                new Error(
                    `El restaurante ${nombreRestaurante} está cerrado o fuera de cobertura.`
                ),
                null
            );
        } else {
            callback(null, {
                nombre: nombreRestaurante,
                estado: "Disponible",
                tiempoEstimadoPreparacion: "15 min"
            });
        }
    }, tiempoEspera);
}

function verificarRestaurantePromise(nombreRestaurante) {
    return new Promise((resolve, reject) => {
        verificarRestaurante(nombreRestaurante, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}


// ============================================================
// MÓDULO: INVENTARIO
// ============================================================

function consultarProducto(nombre, cantidad) {
    return new Promise((resolve, reject) => {
        const tiempoEspera =
            Math.floor(Math.random() * (1500 - 500 + 1)) + 500;

        setTimeout(() => {
            const probabilidadAgotado = Math.random() < 0.15;

            if (probabilidadAgotado) {
                reject(
                    new Error(`Producto "${nombre}" está AGOTADO`)
                );
            } else {
                const precio =
                    (Math.random() * 100 + 10).toFixed(2);

                resolve({
                    producto: nombre,
                    cantidad: cantidad,
                    precio: parseFloat(precio),
                    disponible: true,
                    mensaje:
                        `${cantidad} unidad(es) de "${nombre}" disponibles a $${precio} c/u`
                });
            }
        }, tiempoEspera);
    });
}

function validarInventario(productos) {
    console.log("\n📦 [Inventario] Verificando productos...");
    console.log(
        "🔄 Consultando todos los productos simultáneamente..."
    );

    const promesas = productos.map(producto =>
        consultarProducto(
            producto.nombre,
            producto.cantidad
        )
    );

    return Promise.all(promesas)
        .then(resultados => {
            console.log(
                "✅ Todos los productos están disponibles."
            );

            resultados.forEach((resultado, index) => {
                console.log(
                    `   ${index + 1}. ${resultado.mensaje}`
                );
            });

            return {
                exito: true,
                productos: resultados,
                mensaje: "Inventario confirmado"
            };
        })
        .catch(error => {
            console.log(
                `❌ Error en inventario: ${error.message}`
            );

            return {
                exito: false,
                error: error.message,
                mensaje: "Pedido cancelado - producto agotado"
            };
        });
}


// ============================================================
// MÓDULO: PAGO
// ============================================================

function procesarPago(monto, datosCliente) {
    return new Promise((resolve, reject) => {
        console.log("\n💳 [Pago] Procesando pago...");

        const tiempo =
            Math.floor(Math.random() * 1501) + 1500;

        setTimeout(() => {
            const probabilidad = Math.random();

            if (probabilidad < 0.25) {
                const errores = [
                    "Fondos insuficientes",
                    "Tarjeta bloqueada",
                    "Tiempo de espera agotado"
                ];

                const error =
                    errores[
                        Math.floor(
                            Math.random() * errores.length
                        )
                    ];

                reject(new Error(error));
                return;
            }

            const idTransaccion =
                "TX-" + Date.now();

            resolve({
                exitoso: true,
                idTransaccion: idTransaccion,
                monto: monto,
                cliente: datosCliente
            });
        }, tiempo);
    });
}


// ============================================================
// MÓDULO: REPARTIDOR
// ============================================================

function asignarRepartidor(zonaEntrega) {
    return new Promise((resolve, reject) => {
        const retardo =
            Math.floor(Math.random() * (2500 - 1000 + 1)) + 1000;

        console.log(
            "\n🛵 [Repartidor] Buscando conductor..."
        );

        setTimeout(() => {
            const fallo = Math.random() <= 0.10;

            if (fallo) {
                reject(
                    new Error(
                        `No hay repartidores disponibles en la zona: ${zonaEntrega}`
                    )
                );
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

async function regresarPago(idTransaccion) {
    console.log(
        `\n🔄 [Compensación] Devolviendo pago ${idTransaccion}...`
    );

    await new Promise(resolve =>
        setTimeout(resolve, 400)
    );

    console.log(
        "✅ [Compensación] Dinero devuelto con éxito."
    );
}


// ============================================================
// MÓDULO: NOTIFICACIONES
// ============================================================

function esperarTiempo() {
    const tiempo =
        Math.floor(Math.random() * (1000 - 300 + 1)) + 300;

    return new Promise(resolve => {
        setTimeout(resolve, tiempo);
    });
}

function tieneError() {
    return Math.random() < 0.30;
}

async function enviarCorreo(cliente) {
    await esperarTiempo();

    if (tieneError()) {
        throw new Error(
            "No se pudo enviar el correo"
        );
    }

    return `Correo enviado correctamente a ${cliente.correo}`;
}

async function enviarSMS(cliente) {
    await esperarTiempo();

    if (tieneError()) {
        throw new Error(
            "No se pudo enviar el SMS"
        );
    }

    return `SMS enviado correctamente al número ${cliente.telefono}`;
}

async function enviarPush(cliente) {
    await esperarTiempo();

    if (tieneError()) {
        throw new Error(
            "No se pudo enviar la notificación Push"
        );
    }

    return `Notificación Push enviada correctamente a ${cliente.nombre}`;
}

async function notificarCliente(cliente) {
    console.log(
        "\n📢 [Notificaciones] Enviando notificaciones..."
    );

    const resultados = await Promise.allSettled([
        enviarCorreo(cliente),
        enviarSMS(cliente),
        enviarPush(cliente)
    ]);

    const tipos = [
        "📧 Correo",
        "📱 SMS",
        "🔔 Push"
    ];

    resultados.forEach((resultado, index) => {
        if (resultado.status === "fulfilled") {
            console.log(
                `✅ ${tipos[index]}: ${resultado.value}`
            );
        } else {
            console.log(
                `❌ ${tipos[index]}: ${resultado.reason.message}`
            );
        }
    });

    return resultados;
}


// ============================================================
// DATOS DEL PEDIDO
// ============================================================

const cliente = {
    nombre: "Jerónimo",
    correo: "cliente@ejemplo.com",
    telefono: "3001234567"
};

const pedido = {
    restaurante: "RapidoYa",
    zonaEntrega: "Centro",

    productos: [
        {
            nombre: "Hamburguesa",
            cantidad: 2
        },
        {
            nombre: "Papas",
            cantidad: 1
        },
        {
            nombre: "Gaseosa",
            cantidad: 2
        }
    ],

    cliente: cliente
};


// ============================================================
// ORQUESTADOR PRINCIPAL
// ============================================================

async function procesarPedido(pedido) {

    console.log("\n");
    console.log("================================================");
    console.log("        🚀 RAPIDOYA - NUEVO PEDIDO");
    console.log("================================================");

    console.log(`👤 Cliente: ${pedido.cliente.nombre}`);
    console.log(`🏪 Restaurante: ${pedido.restaurante}`);
    console.log(`📍 Zona: ${pedido.zonaEntrega}`);

    let idTransaccion = null;

    try {

        // ----------------------------------------------------
        // 1. VERIFICAR RESTAURANTE
        // ----------------------------------------------------

        console.log("\n🔎 PASO 1: RESTAURANTE");

        const restaurante =
            await verificarRestaurantePromise(
                pedido.restaurante
            );

        console.log(
            `✅ Restaurante disponible: ${restaurante.nombre}`
        );

        console.log(
            `⏱️ Preparación estimada: ${restaurante.tiempoEstimadoPreparacion}`
        );


        // ----------------------------------------------------
        // 2. VERIFICAR INVENTARIO
        // ----------------------------------------------------

        console.log("\n🔎 PASO 2: INVENTARIO");

        const resultadoInventario =
            await validarInventario(
                pedido.productos
            );

        if (!resultadoInventario.exito) {
            throw new Error(
                resultadoInventario.error
            );
        }

        const total =
            resultadoInventario.productos.reduce(
                (acumulado, producto) =>
                    acumulado +
                    producto.precio *
                    producto.cantidad,
                0
            );

        console.log(
            `💰 Total del pedido: $${total.toFixed(2)}`
        );


        // ----------------------------------------------------
        // 3. PROCESAR PAGO
        // ----------------------------------------------------

        console.log("\n🔎 PASO 3: PAGO");

        const pago = await procesarPago(
            total,
            pedido.cliente
        );

        idTransaccion =
            pago.idTransaccion;

        console.log(
            `✅ Pago aprobado: ${idTransaccion}`
        );


        // ----------------------------------------------------
        // 4. ASIGNAR REPARTIDOR
        // ----------------------------------------------------

        console.log("\n🔎 PASO 4: REPARTIDOR");

        const repartidor =
            await asignarRepartidor(
                pedido.zonaEntrega
            );

        console.log(
            `✅ Repartidor asignado: ${repartidor.idRepartidor}`
        );

        console.log(
            `⏱️ Tiempo de búsqueda: ${repartidor.tiempoBusqueda}`
        );


        // ----------------------------------------------------
        // 5. ENVIAR NOTIFICACIONES
        // ----------------------------------------------------

        console.log("\n🔎 PASO 5: NOTIFICACIONES");

        await notificarCliente(
            pedido.cliente
        );


        // ----------------------------------------------------
        // PEDIDO FINALIZADO
        // ----------------------------------------------------

        console.log("\n");
        console.log("================================================");
        console.log("       🎉 PEDIDO PROCESADO CORRECTAMENTE");
        console.log("================================================");

        console.log(
            `👤 Cliente: ${pedido.cliente.nombre}`
        );

        console.log(
            `🏪 Restaurante: ${restaurante.nombre}`
        );

        console.log(
            `🛵 Repartidor: ${repartidor.idRepartidor}`
        );

        console.log(
            `💳 Transacción: ${idTransaccion}`
        );

        console.log(
            "📢 Notificaciones procesadas."
        );

        console.log("================================================");

    } catch (error) {

        // ----------------------------------------------------
        // MANEJO DE ERRORES
        // ----------------------------------------------------

        console.log("\n");
        console.log("================================================");
        console.log("           ❌ ERROR EN EL PEDIDO");
        console.log("================================================");

        console.log(
            `⚠️ Motivo: ${error.message}`
        );


        // ----------------------------------------------------
        // COMPENSACIÓN DEL PAGO
        // ----------------------------------------------------

        if (idTransaccion) {

            console.log(
                "\n🔄 El pago ya fue realizado."
            );

            await regresarPago(
                idTransaccion
            );

        } else {

            console.log(
                "\nℹ️ No se realizó ningún pago."
            );
        }

        console.log(
            "\n🛑 Pedido cancelado."
        );

        console.log("================================================");
    }
}


// ============================================================
// EJECUCIÓN DEL PROYECTO
// ============================================================

procesarPedido(pedido);