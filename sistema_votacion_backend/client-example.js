/**
 * Ejemplo de cliente para pruebas del Sistema de Votación
 * 
 * Este archivo muestra cómo conectarse al servidor de votación
 * y usar tanto los endpoints REST como Socket.IO
 * 
 * Para usar este ejemplo:
 * 1. Instala socket.io-client: npm install socket.io-client
 * 2. Ejecuta: node client-example.js
 */

import io from 'socket.io-client';

// Configuración
const SERVER_URL = 'http://localhost:3001';
const MESA_ID = '1';

// Crear conexión Socket.IO
const socket = io(SERVER_URL);

// Funciones auxiliares
const log = (message, data = null) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
  console.log('---');
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Ejemplo de uso del cliente
const ejemploCompleto = async () => {
  log('🚀 Iniciando ejemplo del cliente de votación');

  // 1. Conectar al servidor
  socket.on('connect', () => {
    log('✅ Conectado al servidor', { socketId: socket.id });
  });

  // 2. Configurar eventos de Socket.IO
  socket.on('conectado_mesa', (data) => {
    log('📍 Conectado a mesa', data);
  });

  socket.on('habilitar_papeleta', (data) => {
    log('🗳️ Papeleta habilitada', {
      votante: data.votante,
      candidatos: data.candidatos.length
    });
  });

  socket.on('papeleta_cerrada', (data) => {
    log('🔒 Papeleta cerrada', data);
  });

  socket.on('resultados_actualizados', (data) => {
    log('📊 Resultados actualizados', {
      totalCandidatos: data.resultados.length,
      timestamp: data.timestamp
    });
  });

  socket.on('resultados_globales', (data) => {
    log('🌍 Resultados globales', {
      totalCandidatos: data.resultados.length,
      timestamp: data.timestamp
    });
  });

  socket.on('voto_exitoso', (data) => {
    log('✅ Voto registrado exitosamente', data);
  });

  socket.on('error_voto', (data) => {
    log('❌ Error al votar', data);
  });

  // 3. Esperar a que se establezca la conexión
  await sleep(1000);

  // 4. Unirse a una mesa
  log('📍 Uniéndose a mesa...');
  socket.emit('unirse_mesa', MESA_ID);
  
  await sleep(1000);

  // 5. Ejemplo de API REST - Obtener candidatos
  log('📋 Obteniendo candidatos...');
  try {
    const response = await fetch(`${SERVER_URL}/api/candidatos`);
    const candidatos = await response.json();
    log('✅ Candidatos obtenidos', candidatos);
    
    // 6. Simular habilitación de papeleta (desde el jurado)
    log('🎫 Simulando habilitación de papeleta...');
    const habilitarResponse = await fetch(`${SERVER_URL}/api/habilitar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ci: '12345678',
        mesa_id: MESA_ID
      })
    });
    
    const habilitarData = await habilitarResponse.json();
    log('✅ Papeleta habilitada', habilitarData);
    
    await sleep(2000);
    
    // 7. Simular voto usando Socket.IO
    if (candidatos.success && candidatos.candidatos.length > 0) {
      const candidatoAleatorio = candidatos.candidatos[Math.floor(Math.random() * candidatos.candidatos.length)];
      
      log('🗳️ Emitiendo voto por Socket.IO...', {
        candidato: candidatoAleatorio.nombre,
        partido: candidatoAleatorio.partido
      });
      
      socket.emit('emitir_voto', {
        candidato_id: candidatoAleatorio.id,
        mesa_id: MESA_ID
      });
      
      await sleep(3000);
      
      // 8. Obtener resultados actualizados
      log('📊 Solicitando resultados...');
      socket.emit('solicitar_resultados');
      
      await sleep(2000);
      
      // 9. Ejemplo de API REST - Obtener resultados
      log('📊 Obteniendo resultados por REST...');
      const resultadosResponse = await fetch(`${SERVER_URL}/api/resultados`);
      const resultados = await resultadosResponse.json();
      log('✅ Resultados obtenidos', resultados);
    }
    
  } catch (error) {
    log('❌ Error en ejemplo REST', { error: error.message });
  }

  // 10. Finalizar ejemplo
  await sleep(2000);
  log('🏁 Ejemplo completado. Desconectando...');
  socket.disconnect();
};

// Manejo de errores
socket.on('disconnect', () => {
  log('❌ Desconectado del servidor');
});

socket.on('connect_error', (error) => {
  log('❌ Error de conexión', { error: error.message });
});

// Ejecutar ejemplo
ejemploCompleto().catch(console.error);

// Ejemplo adicional: Simulación de múltiples votantes
const simularMultiplesVotantes = async () => {
  log('🎭 Simulando múltiples votantes...');
  
  const votantes = ['12345678', '87654321', '11223344'];
  
  for (const ci of votantes) {
    try {
      const response = await fetch(`${SERVER_URL}/api/habilitar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ci: ci,
          mesa_id: MESA_ID
        })
      });
      
      const data = await response.json();
      log(`✅ Votante ${ci} habilitado`, data);
      
      await sleep(1000);
    } catch (error) {
      log(`❌ Error habilitando votante ${ci}`, { error: error.message });
    }
  }
};

// Ejemplo de monitoreo de resultados en tiempo real
const monitorearResultados = () => {
  log('📊 Iniciando monitoreo de resultados en tiempo real...');
  
  const monitorSocket = io(SERVER_URL);
  
  monitorSocket.on('connect', () => {
    log('📊 Monitor conectado');
    
    // Solicitar resultados cada 30 segundos
    setInterval(() => {
      monitorSocket.emit('solicitar_resultados');
    }, 30000);
  });
  
  monitorSocket.on('resultados_globales', (data) => {
    log('📊 MONITOREO - Resultados globales actualizados', {
      totalResultados: data.resultados.length,
      timestamp: data.timestamp
    });
    
    // Mostrar top 3 candidatos
    const top3 = data.resultados
      .sort((a, b) => b.votos - a.votos)
      .slice(0, 3);
    
    console.log('🏆 TOP 3 CANDIDATOS:');
    top3.forEach((candidato, index) => {
      console.log(`${index + 1}. ${candidato.nombre} (${candidato.partido}): ${candidato.votos} votos`);
    });
    console.log('---');
  });
  
  return monitorSocket;
};

// Exportar funciones para uso en otros archivos
export {
  ejemploCompleto,
  simularMultiplesVotantes,
  monitorearResultados
};

// Comentar la siguiente línea si quieres usar este archivo como módulo
// Para ejecutar directamente: node client-example.js
// Para usar como módulo: import { ejemploCompleto } from './client-example.js'

/* 
// EJEMPLO DE USO COMO MÓDULO:

import { ejemploCompleto, simularMultiplesVotantes, monitorearResultados } from './client-example.js';

// Ejecutar ejemplo completo
await ejemploCompleto();

// Simular múltiples votantes
await simularMultiplesVotantes();

// Monitorear resultados
const monitor = monitorearResultados();

// Detener monitoreo después de 5 minutos
setTimeout(() => {
  monitor.disconnect();
}, 5 * 60 * 1000);
*/ 