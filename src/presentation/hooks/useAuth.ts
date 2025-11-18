import { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@/src/domain/entities/User';
import { container } from '@/src/di/container';
import { Alert } from 'react-native';

/**
 * Define la estructura del Contexto de Autenticación.
 */
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    role: UserRole | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (
        email: string,
        password: string,
        name: string,
        telefono: string,
        role: UserRole
    ) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
    updateProfile: (name: string, telefono: string) => Promise<{ success: boolean; error?: string }>;
    updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
}

// Creamos el Contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook principal con la lógica de negocio
export const useAuthManager = (): AuthContextType => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // --- MÉTODOS ---

    const login = async (email: string, password: string) => {
        try {
            setLoading(true); // Aseguramos que loading empiece en true

            await container.loginUser.execute(email, password);

            // El onAuthStateChange se encargará de actualizar el usuario y poner loading en false
            // Pero por seguridad, devolvemos éxito aquí.
            return { success: true };
        } catch (error: any) {
            setLoading(false); // Importante: apagar loading si falla
            Alert.alert("Error de Login", error.message);
            return { success: false, error: error.message };
        }
    };

    const register = async (email: string, password: string, name: string, telefono: string, role: UserRole) => {
        try {
            await container.registerUser.execute(email, password, name, telefono, role);
            // Si no hubo error, mostramos mensaje de éxito (correo enviado)
            Alert.alert(
                "Registro Exitoso",
                "Se ha enviado un correo para verificar su cuenta. Por favor, revise su bandeja de entrada."
            );
            return { success: true };
        } catch (error: any) {
            Alert.alert("Error de Registro", error.message);
            return { success: false, error: error.message };
        }
    };

    // 🔥 CORRECCIÓN CRÍTICA: Logout Optimista
    const logout = async () => {
        // 1. Limpiamos el estado local INMEDIATAMENTE.
        // Esto dispara la redirección en _layout.tsx al instante.
        setUser(null);

        try {
            // 2. Intentamos avisar al servidor en segundo plano.
            // Si falla o tarda, no importa, el usuario ya salió visualmente.
            await container.logoutUser.execute();
        } catch (error: any) {
            console.log("El servidor no respondió al logout (posible token vencido), pero cerramos localmente.");
        }
    };

    const forgotPassword = async (email: string) => {
        try {
            await container.forgotPassword.execute(email);
            return { success: true };
        } catch (error: any) {
            Alert.alert("Error", error.message);
            return { success: false, error: error.message };
        }
    };

    const updateProfile = async (name: string, telefono: string) => {
        if (!user) return { success: false, error: "No hay usuario autenticado." };
        try {
            const updatedUser = await container.updateProfile.execute(user.id, name, telefono);
            setUser(updatedUser);
            Alert.alert("Éxito", "Perfil actualizado correctamente.");
            return { success: true };
        } catch (error: any) {
            Alert.alert("Error al Actualizar", error.message);
            return { success: false, error: error.message };
        }
    };

    const updatePassword = async (password: string) => {
        try {
            await container.updatePassword.execute(password);
            // NO mostramos Alert aquí para que la Vista maneje la navegación.
            return { success: true };
        } catch (error: any) {
            Alert.alert("Error", error.message);
            return { success: false, error: error.message };
        }
    };

    // --- EFECTO DE SUSCRIPCIÓN ---
    useEffect(() => {
        const unsubscribe = container.authRepository.onAuthStateChange((userFromAuth) => {
            setUser(userFromAuth);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return {
        user,
        isAuthenticated: !!user,
        role: user?.role || null,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        updateProfile,
        updatePassword,
    };
};

// Hook consumidor
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider (definido en _layout.tsx)");
    }
    return context;
};