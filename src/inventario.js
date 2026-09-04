// ============================================
// MÓDULO DE INVENTARIO (Integrante 2) - Corregido
// ============================================

// Exportación moderna (ES Modules)
export const consultarProducto = (nombre, cantidad) => {
    return new Promise((resolve, reject) => {
        // Simular espera entre 500 y 1500 ms
        const tiempoEspera = Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
        
        setTimeout(() => {
            // 15% de probabilidad de que el producto esté agotado
            const probabilidadAgotado = Math.random() < 0.15;
            
            if (probabilidadAgotado) {
                // RF-7: Objeto de error enriquecido para el equipo de soporte
                const error = new Error(`El producto "${nombre}" está agotado.`);
                error.etapa = "Validación de Inventario";
                error.causa = "Falta de stock en restaurante";
                error.datos = { producto: nombre, cantidadSolicitada: cantidad };
                
                reject(error); // Rechazamos la promesa para que caiga en el catch de app.js
            } else {
                const precio = (Math.random() * 100 + 10).toFixed(2);
                resolve({
                    producto: nombre,
                    cantidad: cantidad,
                    precio: parseFloat(precio),
                    disponible: true
                });
            }
        }, tiempoEspera);
    });
};

// Exportación moderna (ES Modules)
export const validarInventario = (productos) => {
    console.log('\n📦 [Módulo Inventario] Verificando existencias simultáneamente...');
    
    // Crear un array de promesas para cada producto
    const promesas = productos.map(producto => 
        consultarProducto(producto.nombre, producto.cantidad)
    );
    
    // Retornamos directamente Promise.all. 
    // Si un producto falla, Promise.all se rechaza automáticamente y app.js lo atrapará.
    // Si todos pasan, app.js recibirá el array con los productos confirmados.
    return Promise.all(promesas);
};