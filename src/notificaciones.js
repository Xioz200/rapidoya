// Simula una espera de tiempo aleatorio
function esperarTiempo() {
    const tiempo = Math.floor(Math.random() * (1000 - 300 + 1)) + 300;

    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, tiempo);
    });
}

// Simula una posibilidad de fallo
function tieneError() {
    return Math.random() < 0.30; // 30% de probabilidad
}

// Enviar correo
async function enviarCorreo(cliente) {
    await esperarTiempo();

    if (tieneError()) {
        throw new Error("No se pudo enviar el correo");
    }

    return `Correo enviado correctamente a ${cliente.correo}`;
}

// Enviar SMS
async function enviarSMS(cliente) {
    await esperarTiempo();

    if (tieneError()) {
        throw new Error("No se pudo enviar el SMS");
    }

    return `SMS enviado correctamente al número ${cliente.telefono}`;
}

// Enviar notificación Push
async function enviarPush(cliente) {
    await esperarTiempo();

    if (tieneError()) {
        throw new Error("No se pudo enviar la notificación Push");
    }

    return `Notificación Push enviada correctamente a ${cliente.nombre}`;
}

// Ejecutar las tres notificaciones simultáneamente
async function notificarCliente(cliente) {

    console.log("\n📢 Enviando notificaciones al cliente...");

    const resultados = await Promise.allSettled([
        enviarCorreo(cliente),
        enviarSMS(cliente),
        enviarPush(cliente)
    ]);

    resultados.forEach((resultado, index) => {

        const tipos = ["📧 Correo", "📱 SMS", "🔔 Push"];

        if (resultado.status === "fulfilled") {
            console.log(`✅ ${tipos[index]}: ${resultado.value}`);
        } else {
            console.log(`❌ ${tipos[index]}: ${resultado.reason.message}`);
        }
    });

    return resultados;
}

// Exportar funciones
module.exports = {
    enviarCorreo,
    enviarSMS,
    enviarPush,
    notificarCliente
};