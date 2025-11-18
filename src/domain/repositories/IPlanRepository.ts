import { PlanMovil, CreatePlanMovilData } from "../entities/PlanMovil";

export interface IPlanRepository {
    getAll(): Promise<PlanMovil[]>;
    create(data: CreatePlanMovilData): Promise<PlanMovil>;
    delete(id: number): Promise<void>;
    // update lo dejamos para si sobra tiempo
}