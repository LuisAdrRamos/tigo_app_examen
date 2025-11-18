export interface PlanMovil {
    id: number;
    nombre: string;
    precio: number;
    datos_gb: string;
    minutos: string;
    descripcion?: string;
    promocion?: string; // <-- Nuevo campo según tu SQL
    imagen_url?: string;
    activo: boolean;
}

export interface CreatePlanMovilData {
    nombre: string;
    precio: number;
    datos_gb: string;
    minutos: string;
    descripcion?: string;
    promocion?: string; // <-- Nuevo campo
    imagen_url?: string;
}