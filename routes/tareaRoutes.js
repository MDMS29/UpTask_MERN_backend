import express, { Router } from 'express'

import {
    agregarTarea, eliminarTarea, actualizarTarea,
    obtenerTarea, cambiarEstado
} from '../controllers/tareaController.js'

import checkout from '../middleware/checkout.js'

const router = express.Router()

router.post('/', checkout, agregarTarea)

router.route('/:id')
    .get(checkout, obtenerTarea)
    .put(checkout, actualizarTarea)
    .delete(checkout, eliminarTarea)

router.post('/estado/:id',checkout, cambiarEstado)

export default router