//Importamos el modelo para insertar datos en la base de datos
import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { 
    emailRegistro, emailOlvidePassword 
} from "../helpers/Email.js";

const registrar = async (req, res) => {

    //Evitar registros duplicados
    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({ email })

    if (existeUsuario) {
        const error = new Error('Usario ya registrado')
        return res.status(400).json({ msg: error.message })
    }

    try {
        //Crea una instancia de usuario para insertar.
        const usuario = new Usuario(req.body)
        /*  console.log(usuario.email , usuario.password, usuario.nombre)
            con la nueva instancia se puede acceder a los datos*/
        usuario.token = generarId() //Generar un token unico.
        await usuario.save()

        //Enviar el email de confirmacion de cuenta.
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({ msg: "Usuario Registrado correctamente, Revisa tu Email para Confirmar tu Cuenta" });//Respuesta enviada
    } catch (error) {
        console.log(error);
    }

}

//Busca la informacion para ingresar.
const autenticar = async (req, res) => {
    const { email, password } = req.body
    //Comprobar si el usuario existe.
    //Busca usuario que contenga el mismo correo
    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
        const error = new Error('El Usuario no existe!')
        return res.status(400).json({ msg: error.message })
    }

    //Comprobar si el usuario esta confirmado.
    if (!usuario.confirmado) {
        const error = new Error('¡Tu cuenta no ha sido confirmada!')
        return res.status(403).json({ msg: error.message })
    }

    //Comprobar password.
    //Metodo creado en el Modelo "Usuario.js"
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id), //Enviamos el id para generar un JWT.
        })
    } else {
        const error = new Error('¡La contraseña es incorrecta!')
        return res.status(403).json({ msg: error.message })
    }
}

//Tomar el valor del token por medio de Get para confirmar el usuario.
const confirmar = async (req, res) => {
    const { token } = req.params
    const usuarioConfirmar = await Usuario.findOne({ token })

    //Si no exite hacer:
    if (!usuarioConfirmar) {
        const error = new Error('¡Token no valido!')
        return res.status(403).json({ msg: error.message })
    }

    //Si existe hacer:
    try {
        usuarioConfirmar.confirmado = true
        usuarioConfirmar.token = ""
        await usuarioConfirmar.save() //Almacena en la base de datos los cambios.
        res.json({ msg: "Usuario Confirmado Correctamente" })
    } catch (error) {
        console.log(error)
    }
}

const olvidePassword = async (req, res) => {
    //Toma los datos enviados desde el FrontEnd.
    const { email } = req.body

    //Comprobar si existe.
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
        const error = new Error('El Usuario no existe')
        return res.status(400).json({ msg: error.message })
    }

    //Si el usuario existe retoma un token nuevamente.
    try {
        usuario.token = generarId()//Le genera un nuevo Token.
        await usuario.save() //Lo guarda en la base de datos.

        //Enviar email de reestablecimiento de contraseña
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({ msg: "Hemos enviado un email con las instrucciones!" })
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params
    const tokenValido = await Usuario.findOne({ token })

    if (tokenValido) {
        res.json({ msg: "Token Valido!" })
    } else {
        const error = new Error('¡Token no valido!')
        return res.status(403).json({ msg: error.message })
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params //URL
    const { password } = req.body //Formulario
    const usuario = await Usuario.findOne({ token })

    if (usuario) {
        usuario.password = password;
        usuario.token = "";
        try {
            await usuario.save()
            res.json({ msg: "Password modificada!" })
        } catch (error) {
            console.log(error)
        }
    } else {
        const error = new Error('¡Token no valido!')
        return res.status(403).json({ msg: error.message })
    }
}

const perfil = async (req, res) => {
    const { usuario } = req
    res.json(usuario)
}

export {
    registrar, autenticar, confirmar,
    olvidePassword, comprobarToken, nuevoPassword, perfil
}