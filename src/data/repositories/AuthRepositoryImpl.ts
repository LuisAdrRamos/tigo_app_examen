import { User, UserRole } from "../../domain/entities/User";
import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { Subscription, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../services/supabaseClient";

/**
 * Interfaz local para la tabla 'profiles'.
 */
interface SupabaseProfile {
    id: string;
    name: string;
    role: UserRole;
    telefono: string;
}

export class AuthRepositoryImpl implements AuthRepository {

    private _subscription: Subscription | null = null;

    // --- Mapeo auxiliar ---
    private async _mapToUser(supabaseUser: SupabaseUser): Promise<User | null> {
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('name, role, telefono')
                .eq('id', supabaseUser.id)
                .returns<SupabaseProfile[]>()
                .single();

            const profileData = profile;

            if (error || !profileData) {
                console.warn('Profile not found or RLS error for user:', supabaseUser.id);
                return {
                    id: supabaseUser.id,
                    email: supabaseUser.email || 'unknown@email.com',
                    name: 'Nombre Desconocido',
                    role: 'usuario_registrado',
                    telefono: '',
                };
            }

            return {
                id: supabaseUser.id,
                email: supabaseUser.email || 'unknown@email.com',
                name: profileData.name,
                role: profileData.role,
                telefono: profileData.telefono,
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
        role: UserRole
    ): Promise<User> {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                    telefono: telefono
                }
            }
        });

        if (authError) throw new Error(authError.message);
        if (!authData.user) throw new Error("Error desconocido al crear usuario.");

        return {
            id: authData.user.id,
            email: authData.user.email!,
            name: name,
            telefono: telefono,
            role: 'usuario_registrado'
        };
    }

    async login(email: string, password: string): Promise<User> {
        // Limpieza preventiva
        await supabase.auth.signOut().catch(() => { });

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw new Error(error.message);
        if (!data.user) throw new Error("Credenciales inválidas.");

        return this._mapToUser(data.user) as Promise<User>;
    }

    // 🔥 ESTA ES LA FUNCIÓN QUE FALTABA O DABA ERROR DE TIPADO
    async logout(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new Error(error.message);
        }
    }

    async forgotPassword(email: string): Promise<void> {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw new Error(error.message);
    }

    async getCurrentUser(): Promise<User | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        return this._mapToUser(user);
    }

    async updateProfile(id: string, name: string, telefono: string): Promise<User> {
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ name, telefono })
            .eq('id', id);

        if (profileError) throw new Error(`Error al actualizar: ${profileError.message}`);
        return this.getCurrentUser() as Promise<User>;
    }

    async updatePassword(password: string): Promise<void> {
        const { error } = await supabase.auth.updateUser({
            password: password
        });
        if (error) throw new Error(error.message);
    }

    onAuthStateChange(callback: (user: User | null) => void): () => void {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session?.user) {
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