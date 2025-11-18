import { IContratacionRepository } from "../../repositories/IContratacionRepository";
import { Contratacion, ContratacionView } from "../../entities/Contratacion";

export class GestionarSolicitudes {
    constructor(private repository: IContratacionRepository) { }

    // Para el Asesor: Ver todas
    async getAllSolicitudes(): Promise<ContratacionView[]> {
        return this.repository.getAll();
    }

    // Para el Usuario: Ver las suyas
    async getSolicitudesForUser(userId: string): Promise<ContratacionView[]> {
        if (!userId) throw new Error("User ID es requerido");
        return this.repository.getForUser(userId);
    }

    // Para el Asesor: Aprobar
    async aprobarSolicitud(id: number): Promise<Contratacion> {
        return this.repository.updateStatus(id, 'aprobado');
    }

    // Para el Asesor: Rechazar
    async rechazarSolicitud(id: number): Promise<Contratacion> {
        return this.repository.updateStatus(id, 'rechazado');
    }
}