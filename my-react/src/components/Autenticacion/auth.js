import axios from 'axios';

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  console.log('Token encontrado:', token); // Para verificar en la consola
  return !!token; // Devuelve true si hay un token
};


// Función para obtener el token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Función para guardar el token
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Función para eliminar el token (logout)
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Función para realizar el login
export const login = async (email, contrasena) => {
  try {
    const response = await axios.post('http://localhost:8000/login', { email, contrasena });
    const { token } = response.data;
    setToken(token);
    return true;
  } catch (error) {
    console.error('Error durante el login:', error);
    return false;
  }
};

// Función para realizar el logout
export const logout = () => {
  localStorage.removeItem('token'); // Elimina el token del localStorage
};

//Incluir el token en todas las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Manejar errores de autenticación globalmente
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token no válido o expirado
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
