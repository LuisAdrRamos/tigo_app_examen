import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { container } from '@/src/di/container';
import { ContratacionView } from '@/src/domain/entities/Contratacion';
import { useAuth } from './useAuth';

export const useContrataciones = () => {
    const { user, role } = useAuth();
    const [solicitudes, setSolicitudes] = useState<ContratacionView[]>([]);
    const [loading, setLoading] = useState(false);

    // 1. Cargar Solicitudes (Lógica inteligente según rol)
    const fetchSolicitudes = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        try {
            // Guardia de seguridad: verificamos que el servicio exista
            const gestion = container.gestionarSolicitudes;
            if (!gestion) throw new Error("Servicio de gestión no inicializado");

            let data: ContratacionView[] = [];

            if (role === 'asesor_comercial') {
                // Si es asesor, trae TODAS
                data = await gestion.getAllSolicitudes();
            } else {
                // Si es usuario, trae SOLO LAS SUYAS
                data = await gestion.getSolicitudesForUser(user.id);
            }
            setSolicitudes(data);
        } catch (error: any) {
            console.error("Error cargando solicitudes:", error);
            // No mostramos Alert para no ser intrusivos en cada recarga
        } finally {
            setLoading(false);
        }
    }, [user, role]);

    // Cargar automáticamente al montar
    useEffect(() => {
        fetchSolicitudes();
    }, [fetchSolicitudes]);

    // 2. Acción: Contratar Plan (Usuario)
    const contratarPlan = async (planId: number): Promise<{ success: boolean, error?: string }> => {
        try {
            await container.crearContratacion.execute({ plan_id: planId });
            fetchSolicitudes(); // Refrescar lista local inmediatamente
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    // 3. Acción: Aprobar Solicitud (Asesor)
    const aprobarSolicitud = async (id: number) => {
        try {
            await container.gestionarSolicitudes.aprobarSolicitud(id);
            fetchSolicitudes();
            return true;
        } catch (error) { return false; }
    };

    // 4. Acción: Rechazar Solicitud (Asesor)
    const rechazarSolicitud = async (id: number) => {
        try {
            await container.gestionarSolicitudes.rechazarSolicitud(id);
            fetchSolicitudes();
            return true;
        } catch (error) { return false; }
    };

    return {
        solicitudes,
        loading,
        refetch: fetchSolicitudes,
        contratarPlan,
        aprobarSolicitud,
        rechazarSolicitud
    };
};