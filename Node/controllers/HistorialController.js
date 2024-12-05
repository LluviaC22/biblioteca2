import ReservaModel from '../models/ReservaModel.js';
import PrestamoModel from '../models/PrestamoModel.js';
import LibroModel from '../models/LibroModel.js';


//Endpoint para camabiar el estado de la reserva
export const cambiarEstadoReserva = async (req, res) => {
    try {
        console.log('Usuario autenticado:', req.usuario);

        const { id_reserva } = req.params;
        const { estado } = req.body;

        // Validación del estado
        if (!['activo', 'completo', 'cancelado'].includes(estado)) {
            return res.status(400).json({ message: 'Estado no válido' });
        }

        const idUsuarioAutenticado = req.id_usuario; // Obtener usuario logueado

        // Verificación de que la reserva existe
        const reserva = await ReservaModel.findByPk(id_reserva);

        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        // Verificar si el estado actual es "completo" o "cancelado"
        if (['completo', 'cancelado'].includes(reserva.estado)) {
            return res.status(400).json({ message: 'No se puede cambiar el estado de una reserva completada o cancelada' });
        }

        // Verificar si la reserva pertenece al usuario autenticado
        if (reserva.id_usuario !== idUsuarioAutenticado) {
            return res.status(403).json({ message: 'No tienes permiso para cambiar el estado de esta reserva' });
        }

        // Cambiar el estado de la reserva
        reserva.estado = estado;
        await reserva.save();

        res.status(200).json({ message: 'Estado de la reserva actualizado', reserva });
    } catch (error) {
        console.error('Error al cambiar el estado de la reserva:', error);
        res.status(500).json({ message: 'Error al cambiar el estado de la reserva' });
    }
};

//Endpoint para devolver el libro prestado
export const devolverLibro = async (req, res) => {
    try {
        console.log('Usuario autenticado:', req.usuario);

        const { id_prestamo } = req.params;  
        const { devuelto } = req.body;  

        // Verificar si el valor de devuelto es un booleano
        if (typeof devuelto !== 'boolean') {
            return res.status(400).json({ message: 'El estado de devolución debe ser un valor booleano' });
        }

        const idUsuarioAutenticado = req.id_usuario;
        const prestamo = await PrestamoModel.findByPk(id_prestamo);

        if (!prestamo) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }
        if (prestamo.id_usuario !== idUsuarioAutenticado) {
            return res.status(403).json({ message: 'No tienes permiso para devolver este libro' });
        }

        // Si el libro no ha sido devuelto, actualizar su estado
        if (!prestamo.devuelto && devuelto) {
            prestamo.devuelto = devuelto;
            await prestamo.save();

            return res.status(200).json({ message: 'Libro marcado como devuelto', prestamo });
        } else {
            return res.status(400).json({ message: 'El libro ya ha sido devuelto o el estado no ha cambiado' });
        }
    } catch (error) {
        console.error('Error al devolver el libro:', error);
        res.status(500).json({ message: 'Error al devolver el libro' });
    }
};
// Obtener el historial completo de los préstamos y reservas de un usuario
export const obtenerHistorial = async (req, res) => {
    try {
        const id_usuario = req.id_usuario;

        // Consultar los préstamos y reservas del usuario
        const [prestamos, reservas] = await Promise.all([
            PrestamoModel.findAll({
                where: { id_usuario },
                attributes: ['id_prestamo', 'fecha_prestamo', 'fecha_devolucion', 'devuelto', 'id_libro']
            }),
            ReservaModel.findAll({
                where: { id_usuario },
                attributes: ['id_reserva', 'fecha_reserva', 'estado', 'id_libro']
            })
        ]);

        // Extraer los id únicos de los libros
        const idsLibros = [
            ...new Set([
                ...prestamos.map(p => p.id_libro),
                ...reservas.map(r => r.id_libro)
            ])
        ];

        // Consultar detalles de los libros
        const libros = await LibroModel.findAll({
            where: { id_libro: idsLibros },
            attributes: ['id_libro', 'titulo', 'autor', 'categoria']
        });

        // Mapear los libros x id
        const librosMap = libros.reduce((map, libro) => {
            map[libro.id_libro] = libro;
            return map;
        }, {});

        //Detalles del libro a préstamos y reservas
        const prestamosConLibros = prestamos.map(prestamo => ({
            ...prestamo.dataValues,
            libro: librosMap[prestamo.id_libro] || null
        }));

        const reservasConLibros = reservas.map(reserva => ({
            ...reserva.dataValues,
            libro: librosMap[reserva.id_libro] || null
        }));

        // Devolver el historial
        res.json({
            prestamos: prestamosConLibros,
            reservas: reservasConLibros
        });
    } catch (error) {
        console.error("Error al obtener el historial:", error);
        res.status(500).json({ message: 'Error al obtener el historial' });
    }
};
