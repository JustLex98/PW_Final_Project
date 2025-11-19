// Archivo: controllers/serviceRequestController.js

const { executeQuery, sql } = require('../db/db');

/**
 * Permite a un cliente autenticado crear una nueva solicitud de servicio.
 */
async function createRequest(req, res) {
    // ... (este código no cambia, lo dejamos como está)
    const clientId = req.user.userId;
    const userRole = req.user.role;
    if (userRole !== 'Cliente') {
        return res.status(403).send({ message: 'Solo los clientes pueden crear solicitudes de servicio.' });
    }
    const { contractorId, categoryId, description } = req.body;
    if (!contractorId || !categoryId || !description) {
        return res.status(400).send({ message: 'Se requiere el ID del contratista, la categoría y una descripción.' });
    }
    try {
        const query = `
            INSERT INTO ServiceRequests (ClientID, ContractorID, CategoryID, Description)
            VALUES (@clientId, @contractorId, @categoryId, @description);
        `;
        const params = [
            { name: 'clientId', type: sql.Int, value: clientId },
            { name: 'contractorId', type: sql.Int, value: contractorId },
            { name: 'categoryId', type: sql.Int, value: categoryId },
            { name: 'description', type: sql.NVarChar, value: description }
        ];
        await executeQuery(query, params);
        res.status(201).send({ message: 'Solicitud de servicio enviada exitosamente.' });
    } catch (error) {
        if (error.number === 547) {
            return res.status(404).send({ message: 'El contratista o la categoría especificada no existen.' });
        }
        console.error("Error al crear la solicitud de servicio:", error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}


/**
 * Obtiene todas las solicitudes de servicio recibidas por el contratista autenticado.
 */
async function getContractorRequests(req, res) {
    const contractorId = req.user.userId;
    const userRole = req.user.role;

    if (userRole !== 'Contratista') {
        return res.status(403).send({ message: 'Solo los contratistas pueden ver sus solicitudes.' });
    }

    try {
        const query = `
            SELECT 
                sr.RequestID,
                sr.Description,
                sr.Status,
                sr.CreatedAt,
                c.CategoryName,
                u.FirstName AS ClientFirstName,
                u.LastName AS ClientLastName
            FROM ServiceRequests sr
            JOIN Users u ON sr.ClientID = u.UserID
            JOIN Categories c ON sr.CategoryID = c.CategoryID
            WHERE sr.ContractorID = @contractorId
            ORDER BY sr.CreatedAt DESC;
        `;
        const params = [{ name: 'contractorId', type: sql.Int, value: contractorId }];
        const result = await executeQuery(query, params);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error al obtener las solicitudes del contratista:", error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}


/**
 * Permite a un contratista actualizar el estado de una solicitud de servicio.
 */
async function updateRequestStatus(req, res) {
    const contractorId = req.user.userId;
    const userRole = req.user.role;
    const { id } = req.params; // ID de la solicitud a actualizar
    const { status } = req.body; // Nuevo estado

    if (userRole !== 'Contratista') {
        return res.status(403).send({ message: 'Solo los contratistas pueden actualizar solicitudes.' });
    }
    if (!status) {
        return res.status(400).send({ message: 'Se requiere un nuevo estado.' });
    }

    try {
        const query = `
            UPDATE ServiceRequests
            SET Status = @status
            WHERE RequestID = @requestId AND ContractorID = @contractorId;
        `;
        // La condición AND ContractorID = @contractorId es una capa extra de seguridad.
        // Asegura que un contratista solo pueda modificar SUS PROPIAS solicitudes.
        
        const params = [
            { name: 'status', type: sql.NVarChar, value: status },
            { name: 'requestId', type: sql.Int, value: id },
            { name: 'contractorId', type: sql.Int, value: contractorId }
        ];
        
        const result = await executeQuery(query, params);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send({ message: 'Solicitud no encontrada o no tienes permiso para modificarla.' });
        }

        res.status(200).send({ message: 'Estado de la solicitud actualizado exitosamente.' });

    } catch (error) {
        console.error("Error al actualizar el estado de la solicitud:", error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}

module.exports = {
    createRequest,
    getContractorRequests,
    updateRequestStatus,
};