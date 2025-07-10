import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Configuración
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Base de datos SQLite
const db = new sqlite3.Database('./votacion.db');

// Inicializar base de datos
const initDatabase = () => {
  db.serialize(() => {
    // Tabla de candidatos
    db.run(`CREATE TABLE IF NOT EXISTS candidatos (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      partido TEXT NOT NULL,
      cargo TEXT NOT NULL,
      color TEXT NOT NULL
    )`);
    
    // Tabla de votos
    db.run(`CREATE TABLE IF NOT EXISTS votos (
      id TEXT PRIMARY KEY,
      candidato_id TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (candidato_id) REFERENCES candidatos(id)
    )`);
    
    // Insertar candidatos de ejemplo si no existen
    db.get("SELECT COUNT(*) as count FROM candidatos", (err, row) => {
      if (err) {
        console.error('Error al verificar candidatos:', err);
        return;
      }
      
      if (row.count === 0) {
        console.log('Insertando candidatos de ejemplo...');
        
        const candidatosEjemplo = [
          {
            id: uuidv4(),
            nombre: 'Ana García',
            partido: 'Partido Progresista',
            cargo: 'Presidente',
            color: '#3B82F6'
          },
          {
            id: uuidv4(),
            nombre: 'Carlos Mendoza',
            partido: 'Partido Conservador',
            cargo: 'Presidente',
            color: '#EF4444'
          },
          {
            id: uuidv4(),
            nombre: 'María López',
            partido: 'Partido Verde',
            cargo: 'Presidente',
            color: '#10B981'
          },
          {
            id: uuidv4(),
            nombre: 'Juan Pérez',
            partido: 'Partido Liberal',
            cargo: 'Vicepresidente',
            color: '#F59E0B'
          },
          {
            id: uuidv4(),
            nombre: 'Laura Fernández',
            partido: 'Partido Social',
            cargo: 'Vicepresidente',
            color: '#8B5CF6'
          }
        ];
        
        const stmt = db.prepare(`INSERT INTO candidatos (id, nombre, partido, cargo, color) VALUES (?, ?, ?, ?, ?)`);
        
        candidatosEjemplo.forEach(candidato => {
          stmt.run(candidato.id, candidato.nombre, candidato.partido, candidato.cargo, candidato.color);
        });
        
        stmt.finalize();
        console.log('Candidatos de ejemplo insertados correctamente');
      }
    });
  });
};

// Funciones auxiliares
const obtenerResultados = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        c.id,
        c.nombre,
        c.partido,
        c.cargo,
        c.color,
        COUNT(v.id) as votos
      FROM candidatos c
      LEFT JOIN votos v ON c.id = v.candidato_id
      GROUP BY c.id, c.nombre, c.partido, c.cargo, c.color
      ORDER BY c.cargo, COUNT(v.id) DESC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const obtenerCandidatos = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM candidatos ORDER BY cargo, nombre", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const simularConsultaVotante = (ci) => {
  // Simulación de consulta a otro sistema
  const votantesSimulados = {
    '12345678': {
      ci: '12345678',
      nombre: 'Juan Pérez',
      apellido: 'García',
      edad: 35,
      direccion: 'Calle 123, Ciudad'
    },
    '87654321': {
      ci: '87654321',
      nombre: 'María López',
      apellido: 'Rodríguez',
      edad: 28,
      direccion: 'Avenida 456, Ciudad'
    },
    '11223344': {
      ci: '11223344',
      nombre: 'Carlos Mendoza',
      apellido: 'Silva',
      edad: 42,
      direccion: 'Plaza 789, Ciudad'
    }
  };
  
  return votantesSimulados[ci] || null;
};

// RUTAS REST

// Endpoint para habilitar papeleta (usado por el jurado)
app.post('/api/habilitar', async (req, res) => {
  const { ci, mesa_id } = req.body;
  
  if (!ci || !mesa_id) {
    return res.status(400).json({ 
      error: 'CI y mesa_id son requeridos' 
    });
  }
  
  try {
    // Simular consulta a otro sistema
    const votante = simularConsultaVotante(ci);
    
    if (!votante) {
      return res.status(404).json({ 
        error: 'Votante no encontrado' 
      });
    }
    
    // Obtener candidatos disponibles
    const candidatos = await obtenerCandidatos();
    
    // Emitir evento a la sala de la mesa
    io.to(`mesa_${mesa_id}`).emit('habilitar_papeleta', {
      votante: votante,
      candidatos: candidatos,
      timestamp: new Date().toISOString()
    });
    
    res.json({ 
      success: true, 
      message: 'Papeleta habilitada correctamente',
      votante: votante
    });
    
  } catch (error) {
    console.error('Error al habilitar papeleta:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// Endpoint para emitir voto (alternativa HTTP)
app.post('/api/voto', async (req, res) => {
  const { candidato_id, mesa_id } = req.body;
  
  if (!candidato_id) {
    return res.status(400).json({ 
      error: 'candidato_id es requerido' 
    });
  }
  
  try {
    // Verificar que el candidato existe
    const candidato = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM candidatos WHERE id = ?", [candidato_id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (!candidato) {
      return res.status(404).json({ 
        error: 'Candidato no encontrado' 
      });
    }
    
    // Guardar voto de forma anónima
    const votoId = uuidv4();
    
    db.run("INSERT INTO votos (id, candidato_id) VALUES (?, ?)", [votoId, candidato_id], async function(err) {
      if (err) {
        console.error('Error al guardar voto:', err);
        return res.status(500).json({ 
          error: 'Error al procesar voto' 
        });
      }
      
      try {
        // Obtener resultados actualizados
        const resultados = await obtenerResultados();
        
        // Emitir eventos a la sala de la mesa
        if (mesa_id) {
          io.to(`mesa_${mesa_id}`).emit('papeleta_cerrada', {
            mensaje: 'Voto registrado correctamente',
            timestamp: new Date().toISOString()
          });
          
          io.to(`mesa_${mesa_id}`).emit('resultados_actualizados', {
            resultados: resultados,
            timestamp: new Date().toISOString()
          });
        }
        
        // Emitir resultados globales
        io.emit('resultados_globales', {
          resultados: resultados,
          timestamp: new Date().toISOString()
        });
        
        res.json({ 
          success: true, 
          message: 'Voto registrado correctamente',
          voto_id: votoId
        });
        
      } catch (error) {
        console.error('Error al obtener resultados:', error);
        res.status(500).json({ 
          error: 'Voto registrado pero error al actualizar resultados' 
        });
      }
    });
    
  } catch (error) {
    console.error('Error al procesar voto:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// Endpoint para obtener resultados
app.get('/api/resultados', async (req, res) => {
  try {
    const resultados = await obtenerResultados();
    res.json({
      success: true,
      resultados: resultados,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al obtener resultados:', error);
    res.status(500).json({ 
      error: 'Error al obtener resultados' 
    });
  }
});

// Endpoint para obtener candidatos
app.get('/api/candidatos', async (req, res) => {
  try {
    const candidatos = await obtenerCandidatos();
    res.json({
      success: true,
      candidatos: candidatos,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al obtener candidatos:', error);
    res.status(500).json({ 
      error: 'Error al obtener candidatos' 
    });
  }
});

// Endpoint de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    server: 'Sistema de Votación Backend'
  });
});

// SOCKET.IO

io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
  
  // Unirse a una sala de mesa
  socket.on('unirse_mesa', (mesa_id) => {
    socket.join(`mesa_${mesa_id}`);
    console.log(`Cliente ${socket.id} se unió a mesa_${mesa_id}`);
    
    socket.emit('conectado_mesa', {
      mesa_id: mesa_id,
      mensaje: `Conectado a mesa ${mesa_id}`,
      timestamp: new Date().toISOString()
    });
  });
  
  // Emitir voto a través de socket
  socket.on('emitir_voto', async (data) => {
    const { candidato_id, mesa_id } = data;
    
    if (!candidato_id) {
      socket.emit('error_voto', { 
        error: 'candidato_id es requerido' 
      });
      return;
    }
    
    try {
      // Verificar que el candidato existe
      const candidato = await new Promise((resolve, reject) => {
        db.get("SELECT * FROM candidatos WHERE id = ?", [candidato_id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
      
      if (!candidato) {
        socket.emit('error_voto', { 
          error: 'Candidato no encontrado' 
        });
        return;
      }
      
      // Guardar voto de forma anónima
      const votoId = uuidv4();
      
      db.run("INSERT INTO votos (id, candidato_id) VALUES (?, ?)", [votoId, candidato_id], async function(err) {
        if (err) {
          console.error('Error al guardar voto:', err);
          socket.emit('error_voto', { 
            error: 'Error al procesar voto' 
          });
          return;
        }
        
        try {
          // Obtener resultados actualizados
          const resultados = await obtenerResultados();
          
          // Emitir eventos a la sala de la mesa
          if (mesa_id) {
            io.to(`mesa_${mesa_id}`).emit('papeleta_cerrada', {
              mensaje: 'Voto registrado correctamente',
              timestamp: new Date().toISOString()
            });
            
            io.to(`mesa_${mesa_id}`).emit('resultados_actualizados', {
              resultados: resultados,
              timestamp: new Date().toISOString()
            });
          }
          
          // Emitir resultados globales
          io.emit('resultados_globales', {
            resultados: resultados,
            timestamp: new Date().toISOString()
          });
          
          socket.emit('voto_exitoso', {
            mensaje: 'Voto registrado correctamente',
            voto_id: votoId,
            timestamp: new Date().toISOString()
          });
          
        } catch (error) {
          console.error('Error al obtener resultados:', error);
          socket.emit('error_voto', { 
            error: 'Voto registrado pero error al actualizar resultados' 
          });
        }
      });
      
    } catch (error) {
      console.error('Error al procesar voto:', error);
      socket.emit('error_voto', { 
        error: 'Error interno del servidor' 
      });
    }
  });
  
  // Solicitar resultados en tiempo real
  socket.on('solicitar_resultados', async () => {
    try {
      const resultados = await obtenerResultados();
      socket.emit('resultados_actualizados', {
        resultados: resultados,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al obtener resultados:', error);
      socket.emit('error_resultados', { 
        error: 'Error al obtener resultados' 
      });
    }
  });
  
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// Inicializar base de datos y servidor
initDatabase();

server.listen(PORT, () => {
  console.log(`🚀 Servidor de votación ejecutándose en puerto ${PORT}`);
  console.log(`📊 API REST disponible en: http://localhost:${PORT}/api`);
  console.log(`🔌 Socket.IO disponible en: ws://localhost:${PORT}`);
  console.log(`💾 Base de datos SQLite: ./votacion.db`);
});

// Manejo de errores
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  db.close((err) => {
    if (err) {
      console.error('Error al cerrar base de datos:', err);
    } else {
      console.log('✅ Base de datos cerrada correctamente');
    }
    process.exit(0);
  });
}); 