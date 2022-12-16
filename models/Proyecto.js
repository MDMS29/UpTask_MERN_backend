import mongoose from "mongoose";

const proyectosSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true,
    },
    descripcion: {
        type: String,
        trim: true,
        required: true,
    },
    fechEntrega: {
        type: Date,
        default: Date.now()
    },
    cliente: {
        type: String,
        trim: true,
        required: true,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    tareas: [ //Corchetes para indicar que habrá varios
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tarea',
        }
    ],
    colaboradores: [ //Corchetes para indicar que habrá varios
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
        }
    ]
},{
    timestamps : true,
})

const Proyecto = mongoose.model('Proyecto', proyectosSchema)

export default Proyecto