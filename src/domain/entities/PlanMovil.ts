export interface PlanMovil {
    id: number;
    nombre: string;
    precio: number;
    datos_gb: string;
    minutos: string;
    descripcion?: string;
    imagen_url?: string;
    activo: boolean;
}

export interface CreatePlanMovilData {
    nombre: string;
    precio: number;
    datos_gb: string;
    minutos: string;
    descripcion?: string;
    imagen_url?: string;
}