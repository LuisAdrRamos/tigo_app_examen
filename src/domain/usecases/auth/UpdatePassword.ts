// src/domain/usecases/auth/UpdatePassword.ts
import { AuthRepository } from "../../repositories/AuthRepository";

export class UpdatePassword {
    constructor(private authRepository: AuthRepository) { }

    async execute(password: string): Promise<void> {
        // 1. VALIDACIONES DE NEGOCIO
        if (!password) {
            throw new Error("La nueva contraseña es requerida.");
        }
        if (password.length < 6) {
            throw new Error("La contraseña debe tener al menos 6 caracteres.");
        }

        // 2. Llamada al repositorio
        return this.authRepository.updatePassword(password);
    }
}