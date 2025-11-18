import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext, useAuthManager, useAuth } from '../src/presentation/hooks/useAuth';

// Componente AuthProvider (JSX)
const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const contextValue = useAuthManager();
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Componente que maneja la lógica de redirección
function InitialLayout() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (loading) return;

        const segment = segments[0];
        const inAuthGroup = segment === 'auth';
        const inTabsGroup = segment === '(tabs)';
        const atWelcomeScreen = segment === undefined;

        // --- REGLA CRÍTICA DE PROTECCIÓN ---
        if (!isAuthenticated) {
            // Si NO está autenticado y está en (tabs) o en cualquier ruta protegida
            // (excepto auth o bienvenida), lo mandamos al Login.
            // Esto se activa inmediatamente cuando hacemos setUser(null) en el logout.
            if (inTabsGroup && !atWelcomeScreen && !inAuthGroup) {
                router.replace('/auth/login');
            }
        }
        // --- REGLA DE REDIRECCIÓN AL ENTRAR ---
        else if (isAuthenticated && (inAuthGroup || atWelcomeScreen)) {
            // Si ya está autenticado y trata de ir al login o bienvenida, 
            // lo mandamos adentro.
            router.replace('/(tabs)');
        }

    }, [isAuthenticated, loading, segments, router]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0047AB" />
            </View>
        );
    }

    return <Slot />;
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <InitialLayout />
        </AuthProvider>
    );
}