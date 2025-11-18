import { IContratacionRepository } from "../../repositories/IContratacionRepository";
import { Contratacion, CreateContratacionData } from "../../entities/Contratacion";

export class CrearContratacion {
    constructor(private repository: IContratacionRepository) { }

    async execute(data: CreateContratacionData): Promise<Contratacion> {
        return this.repository.create(data);
    }
}