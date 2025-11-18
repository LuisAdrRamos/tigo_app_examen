import { IContratacionRepository } from '@/src/domain/repositories/IContratacionRepository';
import { Contratacion, ContratacionView, CreateContratacionData } from '@/src/domain/entities/Contratacion';
import { supabase } from '../services/supabaseClient';

export class SupabaseContratacionRepository implements IContratacionRepository {

    // Helper para obtener el ID del usuario actual o fallar si no hay sesión
    private async getCurrentUserId(): Promise<string> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error("Usuario no autenticado.");
        }
        return user.id;
    }

    // Helper para la consulta base con los JOINs (Relaciones)
    // Nota: No ponemos .returns() aquí para permitir encadenar filtros después
    private getBaseQuery() {
        return supabase
            .from('contrataciones')
            .select(`
                *,
                plan:plan_id ( * ),
                user_profile:user_id ( id, name, telefono )
            `);
    }

    // 1. Crear Contratación
    async create(data: CreateContratacionData): Promise<Contratacion> {
        const userId = await this.getCurrentUserId();

        const { data: contratacion, error } = await supabase
            .from('contrataciones')
            .insert({
                user_id: userId,
                plan_id: data.plan_id,
            })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return contratacion as Contratacion;
    }

    // 2. Obtener solicitudes de un usuario (Para Mis Planes)
    async getForUser(userId: string): Promise<ContratacionView[]> {
        const { data, error } = await this.getBaseQuery()
            .eq('user_id', userId) // Filtramos por usuario
            .order('fecha_solicitud', { ascending: false })
            .returns<ContratacionView[]>(); // Tipamos el resultado final

        if (error) throw new Error(error.message);
        return data as ContratacionView[];
    }

    // 3. Obtener todas las solicitudes (Para Asesor)
    async getAll(): Promise<ContratacionView[]> {
        const { data, error } = await this.getBaseQuery()
            .order('fecha_solicitud', { ascending: false })
            .returns<ContratacionView[]>();

        if (error) throw new Error(error.message);
        return data as ContratacionView[];
    }

    // 4. Actualizar Estado (Aprobar/Rechazar)
    async updateStatus(id: number, estado: 'aprobado' | 'rechazado'): Promise<Contratacion> {
        const { data, error } = await supabase
            .from('contrataciones')
            .update({
                estado: estado,
                fecha_respuesta: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data as Contratacion;
    }
}