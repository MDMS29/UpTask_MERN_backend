import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tarea.js"

const agregarTarea = async (req, res) => {
    const { proyecto } = req.body

    //Verificar si el proyecto es del usuario que crear la tarea.
    const existeProyecto = await Proyecto.findById(proyecto).populate("tareas")

    if (!existeProyecto) {
        const error = new Error("El Proyecto no existe")
        return res.status(404).json({ msg: error.message })
    }

    if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida!")
        return res.status(404).json({ msg: error.message })
    }
    try {
        const tareaAlmacenda = await Tarea.create(req.body)
        //Almacenar ID en el proyecto
        existeProyecto.tareas.push(tareaAlmacenda._id)
        await existeProyecto.save()
        res.json(tareaAlmacenda)
    } catch (error) {
        console.log(error)
    }
}
const obtenerTarea = async (req, res) => {
    const { id } = req.params

    // Busca la tarea por id, y tambien despliega 
    // la informacion del proyecto donde se insertó.
    const tarea = await Tarea.findById(id).populate("proyecto")

    if (!tarea) {
        const error = new Error("No se encontro la tarea!")
        return res.status(404).json({ msg: error.message })
    }

    //Verificar si el creador de la tarea es el mismo logeado
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida!")
        return res.status(403).json({ msg: error.message })
    }

    res.json(tarea)
}

const actualizarTarea = async (req, res) => {
    const { id } = req.params

    // Busca la tarea por id, y tambien despliega 
    // la informacion del proyecto donde se insertó.
    const tarea = await Tarea.findById(id).populate("proyecto")

    if (!tarea) {
        const error = new Error("No se encontro la tarea!")
        return res.status(404).json({ msg: error.message })
    }

    //Verificar si el creador de la tarea es el mismo logeado
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida!")
        return res.status(403).json({ msg: error.message })
    }

    tarea.nombre = req.body.nombre || tarea.nombre
    tarea.descripcion = req.body.descripcion || tarea.descripcion
    tarea.prioridad = req.body.prioridad || tarea.prioridad
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega

    try {
        const tareaAlmacenda = await tarea.save()//guardar cambios en la tarea
        res.json(tareaAlmacenda)
    } catch (error) {
        console.log(error)
    }
}

const eliminarTarea = async (req, res) => {
    const { id } = req.params

    // Busca la tarea por id, y tambien despliega 
    // la informacion del proyecto donde se insertó.
    const tarea = await Tarea.findById(id).populate("proyecto")

    if (!tarea) {
        const error = new Error("No se encontro la tarea!")
        return res.status(404).json({ msg: error.message })
    }

    //Verificar si el creador de la tarea es el mismo logeado
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida!")
        return res.status(403).json({ msg: error.message })
    }

    try {
        const proyecto = await Proyecto.findById(tarea.proyecto)

        proyecto.tareas.pull(tarea._id)

        await Promise.allSettled([await tarea.deleteOne(), await proyecto.save()])

        res.json({ msg: "la Tarea ha sido Eliminada!" })
    } catch (error) {
        console.log(error)
    }
}

const cambiarEstado = async (req, res) => {
    const { id } = req.params

    const tarea = await Tarea.findById(id).populate("proyecto")

    if (!tarea) {
        const error = new Error("No se encontro la tarea!")
        return res.status(404).json({ msg: error.message })
    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString() && !tarea.proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
        const error = new Error("Accion no valida!")
        return res.status(403).json({ msg: error.message })
    }

    tarea.estado = !tarea.estado
    tarea.completado = req.usuario._id
    await tarea.save()

    const tareaAlmacenda = await Tarea.findById(id).populate("proyecto").populate("completado")

    res.json(tareaAlmacenda)

}

export {
    agregarTarea, eliminarTarea, actualizarTarea,
    obtenerTarea, cambiarEstado
}