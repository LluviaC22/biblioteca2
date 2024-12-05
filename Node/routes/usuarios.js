import express from 'express';
import {getAllUsers, getUserById,updateUser, deleteUser, login, register, ActualizarPerfil, createUser} from '../controllers/UsuarioController.js'
import { RestablecerContrasena, VerificarTokenYRestablecerContrasena, ActualizarContrasena } from '../controllers/ContrasenaController.js';
import { verifyToken } from '../middlewares/auth.js';
import { verifyRole } from '../middlewares/VerificarRol.js';


const router = express.Router();

// Rutas de autenticación (públicas)
router.post('/login', login);
router.post('/register', register);

// Rutas
// Ruta para restablecer la contraseña
router.post('/restablecer', RestablecerContrasena);

// Ruta para verificar el token
router.get('/restablecer-contrasena/:token', VerificarTokenYRestablecerContrasena);

// Ruta para actualizar la contraseña
router.put('/restablecer/:token', ActualizarContrasena);


// Rutas de gestión de usuarios (protegidas)
router.get('/', verifyToken, verifyRole([1]),getAllUsers);
router.post('/',verifyToken, verifyRole([1]),createUser)
router.get('/:id_usuario',verifyToken, verifyRole([1]),getUserById);
router.put('/:id_usuario', verifyToken, verifyRole([1]), updateUser);
router.delete('/:id_usuario', verifyToken, verifyRole([1]), deleteUser);

//Actualizar perfil
router.put('/actualizar/:id_usuario', verifyToken, ActualizarPerfil);

export default router;