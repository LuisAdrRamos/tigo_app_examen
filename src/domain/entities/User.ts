export type UserRole = 'asesor_comercial' | 'usuario_registrado';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    telefono: string;
}
