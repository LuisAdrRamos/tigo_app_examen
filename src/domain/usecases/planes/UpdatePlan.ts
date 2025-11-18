import { IPlanRepository } from "../../repositories/IPlanRepository";
import { PlanMovil, CreatePlanMovilData } from "../../entities/PlanMovil";

export class UpdatePlan {
    constructor(private planRepository: IPlanRepository) { }

    async execute(id: number, data: Partial<CreatePlanMovilData>): Promise<PlanMovil> {
        // Validaciones básicas
        if (!id) throw new Error("El ID del plan es necesario para actualizar.");

        if (data.nombre && data.nombre.length < 3) {
            throw new Error("El nombre es muy corto.");
        }

        return this.planRepository.update(id, data);
    }
}