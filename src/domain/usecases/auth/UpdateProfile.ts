// src/domain/usecases/auth/UpdateProfile.ts
import { AuthRepository } from "../../repositories/AuthRepository";
import { User } from "../../entities/User";

export class UpdateProfile {
    constructor(private authRepository: AuthRepository) { }

    async execute(id: string, name: string, telefono: string): Promise<User> { // <-- CAMBIO: Añadido 'telefono'
        // 1. VALIDACIONES DE NEGOCIO
        if (!id) {
            throw new Error("ID de usuario requerido para actualizar el perfil.");
        }
        if (!name || name.trim().length < 2) {
            throw new Error("El nombre debe tener al menos 2 caracteres.");
        }
        if (!telefono || telefono.trim().length < 7) { // <-- CAMBIO: Nueva validación
            throw new Error("El teléfono debe tener al menos 7 caracteres.");
        }

        // 2. Llama al repositorio
        return this.authRepository.updateProfile(id, name, telefono); // <-- CAMBIO: Pasando 'telefono'
    }
}