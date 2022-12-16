import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const { email, nombre, token } = datos

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //Informacion del Email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Confirma tu cuenta",
        text: "Comprueba tu cuenta en UpTask",
        html: `
            <p>Hola ${nombre} Compruba tu cuenta en UpTask</p>
            <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace</p>

            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">COMPROBAR CUENTA</a>

            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    })
}

const emailOlvidePassword = async (datos) => {
    const { email, nombre, token } = datos

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //Informacion del Email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Reestablece tu Password",
        text: "Reestablece tu Password en UpTask",
        html: `
            <p>Hola ${nombre}, Reestablece tu Password en UpTask</p>
            <p>Sigue el siguiente enlace para generar un nuevo password:</p>

            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">REESTABLECER PASSWORD</a>

            <p>Si tu no solicitaste este email , puedes ignorar este mensaje</p>
        `
    })
}


export {
    emailRegistro, emailOlvidePassword
}