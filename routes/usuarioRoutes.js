import express from 'express';

const router = express.Router();

//Importar la funciones del controlador.
import { registrar, autenticar, confirmar, 
    olvidePassword, comprobarToken, nuevoPassword, perfil 
} from '../controllers/usuarioController.js'


import checkout from '../middleware/checkout.js'
//Autenticacion, Registro y Confirmacion de Usuarios.
/*Cuando se realiza una accion POST 
dentro de un formulario (.post)*/
router.post('/', registrar) //Crea un nuevo usuario.

router.post('/login', autenticar)

//Visitar una URL (.get)
//Toma valores por medio de parametros (:param).
router.get('/confirmar/:token', confirmar)

//Contraseña.
router.post('/olvide-password', olvidePassword)

//Para los dos casos en una sola linea de code.
router.route('/olvide-password/:token')
    .get(comprobarToken) //Si es .get
    .post(nuevoPassword) //Si es .post

router.get('/perfil', checkout, perfil)
export default router