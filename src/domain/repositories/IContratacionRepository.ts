import { Contratacion, ContratacionView, CreateContratacionData } from '../entities/Contratacion';

export interface IContratacionRepository {
    /**
     * Crea una nueva solicitud de contratación para el usuario actual.
     */
    create(data: CreateContratacionData): Promise<Contratacion>;

    /**
     * Obtiene el historial de solicitudes de un usuario específico.
     * (Para la vista 'Mis Planes' del Usuario)
     */
    getForUser(userId: string): Promise<ContratacionView[]>;

    /**
     * Obtiene todas las solicitudes del sistema.
     * (Para la vista 'Solicitudes' del Asesor)
     */
    getAll(): Promise<ContratacionView[]>;

    /**
     * Actualiza el estado de una solicitud (Aprobar/Rechazar).
     */
    updateStatus(id: number, estado: 'aprobado' | 'rechazado'): Promise<Contratacion>;
}