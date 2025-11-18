// app/_layout.tsx
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

// Componente que usa el hook useAuth y maneja la lógica de redirección
function InitialLayout() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === 'auth';
        const inTabsGroup = segments[0] === '(tabs)'; // <-- Revisamos si está en TABS

        if (isAuthenticated && inAuthGroup) {
            // REGLA 1: Logueado pero en auth -> Mandar a tabs
            router.replace('/(tabs)');
        }
        else if (!isAuthenticated && !inAuthGroup && !inTabsGroup) {
            // REGLA 2 (MODIFICADA):
            // NO logueado, NO en auth, y NO en tabs -> Mandar a LOGIN
            // (Esto permite que el invitado 'handleGuest' entre a 'tabs' y se quede allí)
            router.replace('/auth/login');
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