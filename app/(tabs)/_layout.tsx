import { Tabs, useRouter } from 'expo-router'; // <-- 1. Importar useRouter
import React from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/presentation/hooks/useAuth';
import { Button, Alert } from 'react-native';
import { colors } from '../../src/presentation/styles/authStyles'; // Importar colores para el botón Login

export default function TabsLayout() {
    // 2. Obtener 'isAuthenticated' y 'logout'
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();

    // 3. Esta es la función para CERRAR SESIÓN (para usuarios logueados)
    const handleLogout = async () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que deseas cerrar sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Cerrar", style: "destructive", onPress: () => logout() }
            ]
        );
    };

    // 4. Esta es la función para NAVEGAR AL LOGIN (para invitados)
    const handleLogin = () => {
        router.replace('/auth/login');
    };

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary, // Usar el azul primario
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTintColor: colors.text,
                headerTitleStyle: { fontWeight: 'bold' },
                headerShown: true,

                // --- 5. LÓGICA CONDICIONAL EN EL HEADER ---
                headerRight: () => (
                    isAuthenticated ? (
                        // 5a. Si está autenticado, muestra "SALIR"
                        <Button
                            onPress={handleLogout}
                            title="Salir"
                            color={colors.danger} // Rojo
                        />
                    ) : (
                        // 5b. Si es invitado, muestra "LOGIN"
                        <Button
                            onPress={handleLogin}
                            title="Login"
                            color={colors.primary} // Azul
                        />
                    )
                ),
                // --- FIN DEL CAMBIO ---
            }}
        >
            {/* 1. DASHBOARD (Ruta index.tsx) */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Catálogo', // Título para la pestaña de inicio
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="dashboard" size={size} color={color} />
                    ),
                }}
            />

            {/* 2. CHAT (Ruta chat/index.tsx) */}
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles" size={size} color={color} />
                    ),
                }}
            />

            {/* 3. PERFIL (Ruta profile.tsx) */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" size={size} color={color} />
                    ),
                }}
            />

            {/* RUTAS OCULTAS */}
            <Tabs.Screen name="chat/[receiverId]" options={{ href: null, headerShown: true }} />
            <Tabs.Screen
                name="change-password"
                options={{
                    href: null, // No aparece en la barra de abajo
                    headerShown: true,
                    title: 'Seguridad'
                }}
            />
        </Tabs>
    );
}