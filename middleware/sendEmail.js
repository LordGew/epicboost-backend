const { text } = require("express");
const nodemailer = require("nodemailer");



/**
 * sendEmail(options)
 * Envía un correo electrónico utilizando Nodemailer.
 * @param {Object} options
 * @param {string} options.to - Dirección de correo del destinatario
 * @param {string} options.subject - Asunto del correo
 * @param {string} options.text - Contenido en texto plano del correo (opcional si usas HTML)
 * @param {string} [options.html] - Contenido HTML del correo (opcional)
 */

async function sendEmail(to, subject, text, html) {
    try{
        // Configura el transporte usando variables de entorno
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, 
            port: Number(process.env.SMTP_PORT), // convierte a número
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }

        });

        const mailOptions = {
            from: `"Epic Boost" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html
        
        };
        //define los datos del correo

        const info = await transporter.sendMail(mailOptions);
        console.log("mail send", info.messageId);

    }catch (error) {
        console.error('Error al enviar el correo:', error);
        throw new Error('No se pudo enviar el correo');
      }
};





module.exports = sendEmail;
