// src/domain/usecases/auth/RegisterUser.ts
import { AuthRepository } from "../../repositories/AuthRepository";
import { User, UserRole } from "../../entities/User";

export class RegisterUser {
    constructor(private authRepository: AuthRepository) { }

    async execute(
        email: string,
        password: string,
        name: string,
        telefono: string, // <-- CAMBIO: Añadido
        role: UserRole
    ): Promise<User> {

        // 1. VALIDACIONES DE NEGOCIO (Obligatorios y Longitud)
        if (!email || !password || !name || !role || !telefono) { // <-- CAMBIO: Añadido 'telefono'
            throw new Error("Todos los campos (email, contraseña, nombre, teléfono y rol) son requeridos."); // <-- CAMBIO: Mensaje actualizado
        }

        if (password.length < 6) {
            throw new Error("La contraseña debe tener al menos 6 caracteres.");
        }

        if (name.trim().length < 2) {
            throw new Error("El nombre debe tener al menos 2 caracteres.");
        }

        if (telefono.trim().length < 7) { // <-- CAMBIO: Nueva validación de ejemplo
            throw new Error("El teléfono debe tener al menos 7 caracteres.");
        }

        // 2. Validación de formato de email (Regex simple)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("El formato del email no es válido.");
        }

        // 3. Llama al Repositorio para ejecutar la acción
        return this.authRepository.register(email, password, name, telefono, role); // <-- CAMBIO: Pasando 'telefono'
    }
}