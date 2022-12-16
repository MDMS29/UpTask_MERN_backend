import express from 'express'
import {
    obtenerProyectos, obtenerProyecto, 
    nuevoProyecto, editarProyecto, 
    eliminarProyecto, 
    agregarColaborador, eliminarColaborador, buscarColaborador
} from '../controllers/proyectoController.js'

import checkout from '../middleware/checkout.js'

const router = express.Router()

router.route('/')
    .get(checkout, obtenerProyectos)
    .post(checkout, nuevoProyecto);

router.route('/:id')
    .get(checkout, obtenerProyecto)
    .put(checkout, editarProyecto)
    .delete(checkout, eliminarProyecto);

router.post('/colaboradores', checkout, buscarColaborador)
router.post('/colaboradores/:id', checkout, agregarColaborador)
router.post('/eliminar-colaborador/:id', checkout, eliminarColaborador)
export default router