// ============================================
// MÓDULO DE NOTIFICACIONES - Corregido
// ============================================

// Funciones auxiliares internas (no necesitan exportarse)
const esperarTiempo = () => {
    const tiempo = Math.floor(Math.random() * (1000 - 300 + 1)) + 300;
    return new Promise(resolve => setTimeout(resolve, tiempo));
};

const tieneError = () => Math.random() < 0.30; // 30% de probabilidad de fallo[cite: 1]

// Exportaciones modernas (ES Modules)
export const enviarCorreo = async (cliente) => {
    await esperarTiempo();
    if (tieneError()) {
        const error = new Error("Fallo en el servicio de correo SMTP");
        // RF-7: Trazabilidad del error[cite: 1]
        error.etapa = "Notificación al cliente";
        error.causa = "Servidor de correo no responde";
        error.datos = { canal: "Correo", destino: cliente.correo };
        throw error;
    }
    return `Correo enviado a ${cliente.correo}`;
};

export const enviarSMS = async (cliente) => {
    await esperarTiempo();
    if (tieneError()) {
        const error = new Error("Fallo en la pasarela SMS");
        error.etapa = "Notificación al cliente";
        error.causa = "Proveedor de telefonía sin señal";
        error.datos = { canal: "SMS", destino: cliente.telefono };
        throw error;
    }
    return `SMS enviado al ${cliente.telefono}`;
};

export const enviarPush = async (cliente) => {
    await esperarTiempo();
    if (tieneError()) {
        const error = new Error("Fallo en el servicio Push (FCM/APNs)");
        error.etapa = "Notificación al cliente";
        error.causa = "Token de dispositivo expirado";
        error.datos = { canal: "Push", destino: cliente.nombre };
        throw error;
    }
    return `Notificación Push enviada a ${cliente.nombre}`;
};

// Orquestador interno del módulo
export const notificarCliente = async (cliente) => {
    console.log("\n📢 [Módulo Notificaciones] Procesando envíos simultáneos...");

    // Se usa Promise.allSettled porque el fallo de un canal no cancela la orden[cite: 1]
    const resultados = await Promise.allSettled([
        enviarCorreo(cliente),
        enviarSMS(cliente),
        enviarPush(cliente)
    ]);

    // Construimos el informe completo que exige la regla RF-5[cite: 1]
    const reporte = {
        exitoGlobal: false, // Cambiará a true si al menos uno funciona
        detalles: []
    };

    const canales = ["Correo", "SMS", "Push"];

    resultados.forEach((resultado, index) => {
        if (resultado.status === "fulfilled") {
            reporte.exitoGlobal = true; 
            reporte.detalles.push({ 
                canal: canales[index], 
                estado: "Enviado", 
                mensaje: resultado.value 
            });
        } else {
            reporte.detalles.push({ 
                canal: canales[index], 
                estado: "Fallido", 
                error: resultado.reason.message,
                causa: resultado.reason.causa
            });
        }
    });

    return reporte; // Entregamos los datos estructurados a app.js
};