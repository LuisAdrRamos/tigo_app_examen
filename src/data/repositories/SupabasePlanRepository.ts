import { IPlanRepository } from "../../domain/repositories/IPlanRepository";
import { PlanMovil, CreatePlanMovilData } from "../../domain/entities/PlanMovil";
import { supabase } from "../services/supabaseClient";

export class SupabasePlanRepository implements IPlanRepository {

    async getAll(): Promise<PlanMovil[]> {
        const { data, error } = await supabase
            .from('planes_moviles')
            .select('*')
            .eq('activo', true)
            .order('id', { ascending: true });

        if (error) throw new Error(error.message);
        return data as PlanMovil[];
    }

    async create(data: CreatePlanMovilData): Promise<PlanMovil> {
        const { data: newPlan, error } = await supabase
            .from('planes_moviles')
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return newPlan as PlanMovil;
    }

    async delete(id: number): Promise<void> {
        // Soft delete (desactivar en lugar de borrar para mantener historial)
        const { error } = await supabase
            .from('planes_moviles')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    }
}