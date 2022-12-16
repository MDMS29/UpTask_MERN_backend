const generarId = () => {
    //Genera un numero random, lo pasa a string y elimina los dos primeros valores.
    const random = Math.random().toString(32).substring(2)
    const fecha = Date.now().toString(32)

    return random + fecha
}
export default generarId