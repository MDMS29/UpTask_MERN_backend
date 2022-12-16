import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js'

const checkout = async (req, res, next) => {
    let token
    //Si se realiza la autorizacion y si hay un token.
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(' ')[1] //Se toma el token y se cambia de posicion a 1.

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            //Busca al usuario por id.                   Eliminar la contraseña de la respuesta recibida
            req.usuario = await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v")

            return next()

        } catch (error) {
            return res.status(404).json({ message: 'Hubo un error!' });
        }
    }

    if (!token) {
        const error = new Error('Token no valido!')
        return res.status(401).json({ message: error.message })
    }

    next() //Realiza el siguiente middleware.
}

export default checkout;