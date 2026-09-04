// ============================================
// app.js - ORQUESTADOR CENTRAL "RápidoYa"
// ============================================

import { verificarRestaurantePromise } from './restaurante.js';
import { validarInventario } from './inventario.js';
import { procesarPago, reversarPago } from './pago.js';
import { asignarRepartidor } from './repartidor.js';
import { notificarCliente } from './notificaciones.js';

/**
 * RF-6: Flujo principal
 * Orquesta las cinco etapas de forma secuencial. Se utiliza async/await para garantizar 
 * que el código se lea de arriba hacia abajo, simulando una "receta de cocina".
 */
const procesarPedido = async (pedido) => {
    console.log(`\n==================================================`);
    console.log(`🍔 INICIANDO PEDIDO: ${pedido.identificador} - Cliente: ${pedido.nombreCliente}`);
    
    // Bandera de estado transaccional para la lógica de compensación (RF-4)
    let idTransaccionConfirmada = null; 
    
    // Objeto para medir la duración de cada etapa según la exigencia final de RF-6
    const tiempos = {}; 

    try {
        // [1] Verificar Restaurante
        let inicioPaso = Date.now();
        const infoRestaurante = await verificarRestaurantePromise(pedido.restaurante);
        tiempos.restaurante = `${Date.now() - inicioPaso} ms`;
        console.log(`✅ [1] Restaurante verificado: ${infoRestaurante.nombre}`);

        // [2] Validar Inventario
        inicioPaso = Date.now();
        await validarInventario(pedido.productos);
        tiempos.inventario = `${Date.now() - inicioPaso} ms`;
        console.log(`✅ [2] Inventario confirmado para ${pedido.productos.length} producto(s).`);

        // [3] Procesar Pago
        inicioPaso = Date.now();
        const infoPago = await procesarPago(pedido.montoTotal, pedido.datosContacto);
        idTransaccionConfirmada = infoPago.idTransaccion; // Guardamos el ID por si la logística falla
        tiempos.pago = `${Date.now() - inicioPaso} ms`;
        console.log(`✅ [3] Pago aprobado. TX: ${idTransaccionConfirmada}`);

        // [4] Asignar Repartidor
        inicioPaso = Date.now();
        const infoRepartidor = await asignarRepartidor(pedido.zonaEntrega);
        tiempos.repartidor = `${Date.now() - inicioPaso} ms`;
        console.log(`✅ [4] Repartidor asignado: ${infoRepartidor.idRepartidor}`);

        // [5] Notificar Cliente
        inicioPaso = Date.now();
        const reporteNotificaciones = await notificarCliente(pedido.datosContacto);
        tiempos.notificaciones = `${Date.now() - inicioPaso} ms`;
        console.log(`✅ [5] Proceso de notificaciones finalizado.`);

        // RF-6: Resumen final en consola si todo sale bien
        console.log(`\n📊 --- RESUMEN DEL PEDIDO ${pedido.identificador} ---`);
        console.log(`ESTADO FINAL: 🎉 ENTREGADO CON ÉXITO`);
        console.log(`TIEMPOS POR ETAPA:`, tiempos);
        console.log(`RESULTADO DE NOTIFICACIONES:`);
        reporteNotificaciones.detalles.forEach(n => {
            console.log(`  - ${n.canal}: ${n.estado} ${n.error ? `(${n.error})` : ''}`);
        });

    } catch (error) {
        // RF-7: Captura global de fallos. El proceso de Node NUNCA termina abruptamente.
        console.log(`\n❌ [ALERTA] Interrupción en el pedido ${pedido.identificador}`);
        
        // 1. Mensaje amigable para el cliente
        console.log(`🗣️  Mensaje al cliente: "Lo sentimos, tuvimos un problema con tu orden: ${error.message}"`);
        
        // 2. Registro interno detallado para el equipo de soporte
        console.log(`\n📋 [LOG DE SOPORTE INTERNO]`);
        console.log(`   - Etapa de fallo: ${error.etapa || 'Desconocida'}`);
        console.log(`   - Causa técnica: ${error.causa || 'Desconocida'}`);
        console.log(`   - Datos del entorno:`, error.datos || 'N/A');

        // RF-4: Lógica de compensación. Si el error viene de la etapa 4 pero el pago (etapa 3) ya se hizo.
        if (idTransaccionConfirmada && error.etapa === "Asignación de Repartidor") {
            console.log(`\n⚠️ Detectado fallo logístico post-pago. Iniciando reversión automática...`);
            await reversarPago(idTransaccionConfirmada);
        }
        
        console.log(`\n🛑 ESTADO FINAL: PEDIDO CANCELADO`);
    }
};

// ============================================
// RF-7: Pruebas del Sistema (5 Pedidos)
// ============================================

const pedidosDePrueba = [
    {
        identificador: "ORD-001", nombreCliente: "Ana Torres", restaurante: "Burger King",
        zonaEntrega: "Norte", montoTotal: 25.500,
        datosContacto: { correo: "ana@mail.com", telefono: "3001112233", nombre: "Ana" },
        productos: [{ nombre: "Hamburguesa doble", cantidad: 2 }]
    },
    {
        identificador: "ORD-002", nombreCliente: "Carlos Ruiz", restaurante: "Pizza Hut",
        zonaEntrega: "Centro", montoTotal: 45.000,
        datosContacto: { correo: "carlos@mail.com", telefono: "3004445566", nombre: "Carlos" },
        productos: [{ nombre: "Pizza Familiar", cantidad: 1 }, { nombre: "Gaseosa 2L", cantidad: 1 }]
    },
    {
        identificador: "ORD-003", nombreCliente: "Laura Gómez", restaurante: "Sushi Bar",
        zonaEntrega: "Sur", montoTotal: 60.000,
        datosContacto: { correo: "laura@mail.com", telefono: "3007778899", nombre: "Laura" },
        productos: [{ nombre: "Roll California", cantidad: 3 }]
    },
    {
        identificador: "ORD-004", nombreCliente: "Miguel Arce", restaurante: "Tacos El Rey",
        zonaEntrega: "Oriente", montoTotal: 15.000,
        datosContacto: { correo: "miguel@mail.com", telefono: "3000001111", nombre: "Miguel" },
        productos: [{ nombre: "Tacos al pastor", cantidad: 5 }]
    },
    {
        identificador: "ORD-005", nombreCliente: "Sofía Méndez", restaurante: "Wok Express",
        zonaEntrega: "Occidente", montoTotal: 32.500,
        datosContacto: { correo: "sofia@mail.com", telefono: "3002223344", nombre: "Sofía" },
        productos: [{ nombre: "Arroz Frito", cantidad: 2 }, { nombre: "Rollos Primavera", cantidad: 1 }]
    }
];

// Ejecución secuencial de los 5 pedidos para observar el log de forma limpia
const ejecutarPruebas = async () => {
    console.log("🚀 INICIANDO SIMULADOR RÁPIDOYA...");
    for (const pedido of pedidosDePrueba) {
        await procesarPedido(pedido);
        // Pequeña pausa entre pedidos para facilitar la lectura en consola
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log("\n✅ FIN DE LAS PRUEBAS DEL SISTEMA.");
};

// Iniciar el sistema
ejecutarPruebas();