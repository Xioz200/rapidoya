// ============================================
// MÓDULO DE INVENTARIO - Promise.all()
// ============================================

// Función para consultar un producto individual
function consultarProducto(nombre, cantidad) {
    return new Promise((resolve, reject) => {
        // Simular espera entre 500 y 1500 ms
        const tiempoEspera = Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
        
        setTimeout(() => {
            // 15% de probabilidad de que el producto esté agotado
            const probabilidadAgotado = Math.random() < 0.15;
            
            if (probabilidadAgotado) {
                reject(new Error(`❌ Producto "${nombre}" está AGOTADO`));
            } else {
                // Simular que el producto está disponible
                const precio = (Math.random() * 100 + 10).toFixed(2);
                resolve({
                    producto: nombre,
                    cantidad: cantidad,
                    precio: parseFloat(precio),
                    disponible: true,
                    mensaje: `✅ ${cantidad} unidad(es) de "${nombre}" disponibles a $${precio} c/u`
                });
            }
        }, tiempoEspera);
    });
}

// Función para validar el inventario de múltiples productos
function validarInventario(productos) {
    console.log('📦 Verificando inventario...');
    console.log('🔄 Consultando todos los productos simultáneamente (Promise.all)...\n');
    
    // Crear un array de promesas para cada producto
    const promesas = productos.map(producto => 
        consultarProducto(producto.nombre, producto.cantidad)
    );
    
    // Usar Promise.all para consultar todos simultáneamente
    return Promise.all(promesas)
        .then(resultados => {
            console.log('✅ ¡Todos los productos están disponibles!');
            console.log('📋 Detalles del pedido:');
            resultados.forEach((r, index) => {
                console.log(`   ${index + 1}. ${r.mensaje}`);
            });
            return {
                exito: true,
                productos: resultados,
                mensaje: 'Pedido confirmado exitosamente'
            };
        })
        .catch(error => {
            console.log('❌ Error en el pedido:', error.message);
            console.log('🛑 Pedido CANCELADO - producto agotado');
            return {
                exito: false,
                error: error.message,
                mensaje: 'Pedido cancelado - producto agotado'
            };
        });
}

// ============================================
// PRUEBAS (se ejecutan SOLO si ejecutas este archivo directamente)
// ============================================

if (require.main === module) {
    console.log('\n' + '='.repeat(50));
    console.log('🧪 INICIANDO PRUEBAS DE INVENTARIO');
    console.log('='.repeat(50) + '\n');

    // Prueba 1: Producto individual
    console.log('--- PRUEBA 1: Consultar producto individual ---');
    consultarProducto('Laptop', 2)
        .then(resultado => {
            console.log('✅ Éxito:', resultado.mensaje);
            console.log('   Precio total: $' + (resultado.precio * resultado.cantidad).toFixed(2));
        })
        .catch(error => {
            console.log('❌', error.message);
        });

    // Prueba 2: Validar inventario completo con Promise.all
    setTimeout(() => {
        console.log('\n--- PRUEBA 2: Validar inventario con Promise.all ---');
        
        const pedido = [
            { nombre: 'Laptop', cantidad: 2 },
            { nombre: 'Mouse', cantidad: 5 },
            { nombre: 'Teclado', cantidad: 3 },
            { nombre: 'Monitor', cantidad: 1 }
        ];
        
        validarInventario(pedido)
            .then(resultado => {
                console.log('\n📊 RESULTADO FINAL:');
                console.log('   Estado:', resultado.exito ? '✅ ÉXITO' : '❌ FALLÓ');
                console.log('   Mensaje:', resultado.mensaje);
            });
    }, 2000);

    // Prueba 3: Simulación de múltiples pedidos (para ver el 15% de fallos)
    setTimeout(() => {
        console.log('\n--- PRUEBA 3: Simulación de 5 pedidos (mostrará fallos aleatorios) ---\n');
        
        const pedidoSimple = [
            { nombre: 'Libro', cantidad: 1 },
            { nombre: 'Cuaderno', cantidad: 10 }
        ];
        
        let completados = 0;
        for (let i = 1; i <= 5; i++) {
            setTimeout(() => {
                console.log(`\n🔄 Pedido #${i}:`);
                validarInventario(pedidoSimple)
                    .then(resultado => {
                        completados++;
                        if (completados === 5) {
                            console.log('\n' + '='.repeat(50));
                            console.log('✅ TODAS LAS PRUEBAS COMPLETADAS');
                            console.log('='.repeat(50));
                        }
                    });
            }, i * 3000); // Cada 3 segundos
        }
    }, 4000);

    console.log('\n⏳ Esperando resultados de las pruebas...\n');
}

// Exportar las funciones para usarlas en otros archivos
module.exports = {
    consultarProducto,
    validarInventario
};