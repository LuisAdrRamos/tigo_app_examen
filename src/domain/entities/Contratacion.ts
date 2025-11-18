import { PlanMovil } from './PlanMovil';
import { User } from './User';

// Estados posibles de una solicitud
export type ContratacionEstado = 'pendiente' | 'aprobado' | 'rechazado';

// Entidad base (lo que se guarda en la tabla 'contrataciones')
export interface Contratacion {
    id: number;
    user_id: string;
    plan_id: number;
    fecha_solicitud: string;
    estado: ContratacionEstado;
    fecha_respuesta: string | null;
}

// Entidad "View" (lo que usamos en la UI, incluye los objetos relacionados)
export interface ContratacionView extends Contratacion {
    plan: PlanMovil;       // El plan completo (nombre, precio, etc.)
    user_profile: User;    // El perfil del usuario que solicitó
}

// DTO para crear (solo necesitamos el ID del plan)
export interface CreateContratacionData {
    plan_id: number;
}