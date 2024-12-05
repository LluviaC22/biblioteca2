import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 
import validator from 'validator';
import nodemailer from 'nodemailer'; 
import UsuarioModel from '../models/UsuarioModel.js'; 

// RESTABLECER CONTRASEÑA
export const RestablecerContrasena = async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await UsuarioModel.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const token = jwt.sign({ id_usuario: usuario.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
      service: 'smpt@gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const resetLink = `http://localhost:3000/restablecer-contrasena/${token}`;
    const mailOptions = {
      from: 'bibliotecapublicamariohugomari@gmail.com',
      to: email,
      subject: 'Restablecimiento de Contraseña',
      text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetLink}`,
      html: `<p>Para restablecer tu contraseña, haz clic <a href="${resetLink}">aquí</a>.</p>`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Correo de restablecimiento enviado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const VerificarTokenYRestablecerContrasena = (req, res) => {
  const { token } = req.params;
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token no válido o expirado' });
      }
      res.json({ 
        message: 'Token válido', 
        isValid: true,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al verificar el token' });
  }
};

// Función de validación de contraseña
const validatePassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export const ActualizarContrasena = async (req, res) => {
  const { token } = req.params;
  const { nuevaContrasena } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id_usuario } = decoded;

    if (!nuevaContrasena || nuevaContrasena.trim() === '') {
      return res.status(400).json({ message: 'La contraseña no puede estar vacía' });
    }

    // Validar la nueva contraseña
    if (!validatePassword(nuevaContrasena)) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 8 caracteres, incluir una letra, un número y un carácter especial',
      });
    }

    const usuario = await UsuarioModel.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    usuario.contrasena = hashedPassword;
    await usuario.save();

    res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token no válido o expirado' });
    }
    res.status(500).json({ message: 'Error al actualizar la contraseña' });
  }
};