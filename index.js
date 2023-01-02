import express from 'express'
import dotenv from 'dotenv' //npm i dotenv
import cors from 'cors' //npm i cors
//Funcion conexion de base de datos
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';

const app = express();
app.use(express.json()) //Procesa la informacion tipo JSON.

//Proteger variables de entorno
//Se crea un archivo .env para crear variables de entorno
dotenv.config()

/*
Permite ver el enlace a la conexion por medio de variables
de entorno
console.log(process.env.MONGO_URI)
*/

conectarDB()

//Configurar cors
const whiteList = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function (origin, callBack) {
        //Si el origin esta en la whiteList hacer:
        if (whiteList.includes(origin)) {
            //Consultar API
            callBack(null, true)
        } else {
            //No es permitido el request
            callBack(new Error("Error de Cors"))
        }
    }
}

//Routing creacion de rutas.
//use -> Puede utilizar todos los verbos HTTP.
//Definicion de una ruta de conexion.
app.use(cors(corsOptions))

app.use('/api/usuarios', usuarioRoutes/*ruta creada*/)

app.use('/api/proyectos', proyectoRoutes/*ruta creada*/)

app.use('/api/tareas', tareaRoutes/*ruta creada*/)

app.get('/', (req, res) => {
    res.send(`Puerto ${PORT}`)
})

/*Si no existe un puerto creado abre el puerto 4000*/
const PORT = process.env.PORT || 4000

const servidor = app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`)
})

//Socket.io

import { Server } from 'socket.io'

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL
    }
})

io.on('connection', (socket) => {
    // console.log('conectado a Socket.io')

    //Definir eventos
    socket.on('abrir proyecto', (proyecto) => {
        socket.join(proyecto)//CREA UNA SALA PRIVADA
    })

    socket.on('nueva tarea', (tarea) => {
        socket.to(tarea.proyecto).emit('tarea agregada', tarea) //Envia al frontend
    })

    socket.on('eliminar tarea', (tarea) => {
        socket.to(tarea.proyecto).emit('tarea eliminada', tarea)//Envia al frontend
    })

    socket.on('tarea editada', (tarea) => {
        socket.to(tarea.proyecto._id).emit('tarea actualizada', tarea)//Envia al frontend
    })

    socket.on('cambiar estado', (tarea) => {
        socket.to(tarea.proyecto._id).emit('nuevo estado', tarea)//Envia al frontend
    })
})