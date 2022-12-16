import mongoose from "mongoose";//npm i mongoose

//Creando la conexion a la Base de Datos no SQL
const conectarDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI/*Varible de entorno creada en .env*/, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        const url = `${connection.connection.host}:${connection.connection.port}`

        console.log(`Conectado en ${url}`)
    } catch (error) {
        console.log(`error: ${error.mesage}`);
        process.exit(1); //Terminar proceso
    }
}
export default conectarDB