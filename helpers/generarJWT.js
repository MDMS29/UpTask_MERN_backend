import jwt from 'jsonwebtoken';

const generarJWT = (id) => {
    //Genera un JSON web Token.
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d', });
}

export default generarJWT