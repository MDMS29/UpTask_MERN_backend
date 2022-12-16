import mongoose from "mongoose";
import bcrypt from "bcrypt"; //Hashear el password

//Schema -> Estructura de una base de datos.
const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String, //Tipo de dato.
        required: true,  //Requerido
        trim: true //Elimina los espacios a los lados
    },
    password: {
        type: String,
        required: true,
        trim: true
        
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true //Dato unico, no puede estar en la base de datos
    },
    token: {
        type: String
    },
    confirmado: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
);

/*Esta funcion sera realizara antes del "save" en el controlador.
Esta funcion tendra cada valor de la base de datos
antes de ser guardado.
Se usa 'function' porque se usara un valor de la misma informacion*/
usuarioSchema.pre('save', async function(next) {
    //Si no modifica el password, no debe hacer nada.
    if(!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

usuarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password)
}

//Definicion de model de Usuario.
const Usuario = mongoose.model('Usuario', usuarioSchema)

export default Usuario