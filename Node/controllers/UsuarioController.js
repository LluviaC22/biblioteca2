import bcrypt from 'bcrypt'; //Biblioteca para el hash de contraseñas
import jwt from 'jsonwebtoken'; //Bib para generar y verificar tokens
import validator from 'validator'; // Importar validator para las validaciones
import UsuarioModel from '../models/UsuarioModel.js';

//FUNCIÓN DE LOGIN
export const login = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    // Buscar usuario por su email en la BD
    const usuario = await UsuarioModel.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña inválida' });
    }

    // Si la autenticación es exitosa se genera token con el idusuario y se devuelve con su info
    const token = jwt.sign({ id_usuario: usuario.id_usuario }, process.env.JWT_SECRET, {
      expiresIn: '1h', //el token es válido por 1 hora
    });

    res.json({ token, usuario: { id_usuario: usuario.id_usuario, nombre: usuario.nombre, email: usuario.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
}
// Función para validar la contraseña
const validatePassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};
// FUNCIÓN DE REGISTRO
export const register = async (req, res) => {
  try {
    const { nombre, email, contrasena, id_rol } = req.body;

    // Validación de los campos
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({ message: 'El nombre es obligatorio y debe ser un texto válido.' });
    }

    if (!email || !validator.isEmail(email.trim())) { // Eliminamos espacios extra
      return res.status(400).json({ message: 'El correo electrónico no es válido.' });
    }

    if (!validatePassword(contrasena)) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 8 caracteres, incluir una letra, un número y un carácter especial.',
      });
    }

    if (!id_rol || typeof id_rol !== 'number') {
      return res.status(400).json({ message: 'El ID del rol es obligatorio y debe ser un número válido.' });
    }

    // Checar si el usuario ya existe
    const existingUser = await UsuarioModel.findOne({ where: { email: email.trim() } }); // Trim para asegurar la comparación

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe.' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear nuevo usuario
    const newUser = await UsuarioModel.create({
      nombre,
      email: email.trim(), // Guardar email sin espacios extra
      contrasena: hashedPassword,
      id_rol,
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente.', usuario: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};


//CRUD USUARIOS
// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const usuarios = await UsuarioModel.findAll({
      attributes: ['id_usuario', 'nombre', 'email', 'id_rol'] 
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
}

// Obtener un usuario x id
export const getUserById = async (req, res) => {
  try {
    const usuario = await UsuarioModel.findByPk(req.params.id_usuario, {
      attributes: ['id_usuario', 'nombre', 'email', 'id_rol'] 
    });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
}

// Actualizar un usuario
export const updateUser = async (req, res) => {
  try {
    const { nombre, email, id_rol } = req.body;
    const usuario = await UsuarioModel.findByPk(req.params.id_usuario);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await usuario.update({ nombre, email, id_rol });
    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
}
// Eliminar un usuario
export const deleteUser = async (req, res) => {
  try {
    const usuario = await UsuarioModel.findByPk(req.params.id_usuario);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await usuario.destroy();
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
}
//Crear usuario
export const createUser = async (req, res) => {
  try {
      console.log("Datos recibidos en el servidor:", req.body);

      const { nombre, email, contrasena, id_rol } = req.body;

      // Verificar que los campos obligatorios están presentes
      if (!email || !contrasena) {
          return res.status(400).json({ message: "Email y contraseña son obligatorios." });
      }

      // Crear el usuario
      await UsuarioModel.create({ nombre, email, contrasena, id_rol });

      res.status(201).json({ message: "Registro exitoso" });
  } catch (error) {
      console.error("Error al crear el usuario:", error);
      res.status(500).json({ message: error.message });
  }
};

//ACTUALIZAR PERFIL
export const ActualizarPerfil = async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;
    const id_usuario = req.id_usuario; // El ID del usuario que hace la solicitud

    // Buscar el usuario en la base de datos
    const usuario = await UsuarioModel.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el nuevo email ya está en uso, solo si el email ha sido cambiado
    if (email && email !== usuario.email) {
      const existingUser = await UsuarioModel.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
      }
    }

    // Preparar un objeto de actualización con solo los campos que se proporcionan
    const updateData = {};

    if (nombre) updateData.nombre = nombre;
    if (email) updateData.email = email;
    if (contrasena) {
      // Si se proporciona una nueva contraseña, hashearla
      updateData.contrasena = await bcrypt.hash(contrasena, 10);
    }

    // Realizar la actualización solo con los campos proporcionados
    await usuario.update(updateData);

    // Responder con un mensaje de éxito
    res.json({
      message: 'Perfil actualizado exitosamente',
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
