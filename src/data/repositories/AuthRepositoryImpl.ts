// src/data/repositories/AuthRepositoryImpl.ts
import { User, UserRole } from "../../domain/entities/User";
import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { Subscription, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../services/supabaseClient";

/**
 * Interfaz local para la tabla 'profiles'.
 * Necesaria para tipar la respuesta de la DB.
 */
interface SupabaseProfile {
    id: string;
    name: string;
    role: UserRole;
    telefono: string; // <-- CAMBIO: Se asume obligatorio en la DB también
}

export class AuthRepositoryImpl implements AuthRepository {

    private _subscription: Subscription | null = null;

    // --- Mapeo de Supabase Auth + Profile a Entidad User (Método auxiliar) ---
    private async _mapToUser(supabaseUser: SupabaseUser): Promise<User | null> {
        try {
            // 1. Obtener datos del perfil (nombre, rol y teléfono)
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('name, role, telefono') // <-- CAMBIO: Añadido 'telefono'
                .eq('id', supabaseUser.id)
                .returns<SupabaseProfile[]>()
                .single();

            const profileData = profile;

            if (error || !profileData) {
                console.warn('Profile not found or RLS error for user:', supabaseUser.id);

                // Retornamos un objeto User con valores seguros/por defecto
                // Esto no debería pasar si el registro funciona bien, pero es un fallback.
                return {
                    id: supabaseUser.id,
                    email: supabaseUser.email || 'unknown@email.com',
                    name: 'Nombre Desconocido',
                    role: 'usuario_registrado', // Rol por defecto seguro
                    telefono: '', // <-- CAMBIO: Añadido (vacío como fallback)
                };
            }

            // 2. Mapear a la entidad de Dominio completa
            return {
                id: supabaseUser.id,
                email: supabaseUser.email || 'unknown@email.com',
                name: profileData.name,
                role: profileData.role,
                telefono: profileData.telefono, // <-- CAMBIO: Mapeado
            };

        } catch (error) {
            console.error('Error in _mapToUser:', error);
            return null;
        }
    }

    // --- Implementaciones de AuthRepository ---

    async register(
        email: string,
        password: string,
        name: string,
        telefono: string,
        role: UserRole // 'role' ya no lo usaremos aquí, pero lo dejamos por consistencia
    ): Promise<User> {

        // 1. Crear usuario en Supabase Auth, pasando los datos extra
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                    telefono: telefono
                    // El 'role' lo pone el trigger automáticamente
                }
            }
        });

        if (authError) {
            throw new Error(authError.message);
        }
        if (!authData.user) {
            throw new Error("Error desconocido al crear usuario.");
        }
        
        return {
            id: authData.user.id,
            email: authData.user.email!,
            name: name,
            telefono: telefono,
            role: 'usuario_registrado'
        };
    }

    async login(email: string, password: string): Promise<User> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw new Error(error.message);
        }
        if (!data.user) {
            throw new Error("Credenciales inválidas.");
        }

        // Retornar la entidad User mapeada (ahora _mapToUser obtiene el teléfono)
        return this._mapToUser(data.user) as Promise<User>;
    }

    async logout(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new Error(error.message);
        }
    }

    async forgotPassword(email: string): Promise<void> {
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
            throw new Error(error.message);
        }
    }

    async getCurrentUser(): Promise<User | null> {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return null;
        }

        // Retornar la entidad User mapeada (ahora _mapToUser obtiene el teléfono)
        return this._mapToUser(user);
    }

    async updateProfile(id: string, name: string, telefono: string): Promise<User> {
        // 1. Actualizar los campos 'name' y 'telefono' en la tabla 'profiles'
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ name, telefono })
            .eq('id', id);

        if (profileError) {
            throw new Error(`Error al actualizar el perfil: ${profileError.message}`);
        }

        // 2. Forzar la obtención del objeto User actualizado
        return this.getCurrentUser() as Promise<User>;
    }


    onAuthStateChange(callback: (user: User | null) => void): () => void {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session?.user) {
                    // Obtener los datos completos (incluyendo teléfono)
                    const user = await this._mapToUser(session.user);
                    callback(user);
                } else {
                    callback(null);
                }
            }
        );

        this._subscription = subscription;
        return () => {
            if (this._subscription) {
                this._subscription.unsubscribe();
                this._subscription = null;
            }
        };
    }
}