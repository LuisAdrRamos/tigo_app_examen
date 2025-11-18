import { useState, useEffect, useCallback } from 'react';
import { container } from '@/src/di/container';
import { PlanMovil, CreatePlanMovilData } from '@/src/domain/entities/PlanMovil';
import { Alert } from 'react-native';

export const usePlanes = () => {
    const [planes, setPlanes] = useState<PlanMovil[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPlanes = useCallback(async () => {
        setLoading(true);
        try {
            const data = await container.planRepository.getAll();
            setPlanes(data);
        } catch (error: any) {
            Alert.alert("Error", "No se pudieron cargar los planes.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlanes();
    }, [fetchPlanes]);

    const crearPlan = async (data: CreatePlanMovilData) => {
        try {
            const newPlan = await container.planRepository.create(data);
            setPlanes([...planes, newPlan]);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const eliminarPlan = async (id: number) => {
        try {
            await container.planRepository.delete(id);
            setPlanes(planes.filter(p => p.id !== id));
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    return {
        planes,
        loading,
        refetch: fetchPlanes,
        crearPlan,
        eliminarPlan
    };
};