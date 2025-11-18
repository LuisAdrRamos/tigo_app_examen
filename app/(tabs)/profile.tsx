import { View, Text, Button } from 'react-native';
import React from 'react';
import { useAuth } from '../../src/presentation/hooks/useAuth';
import { useRouter } from 'expo-router'; // <-- 1. Importar useRouter
import { authStyles, colors } from '../../src/presentation/styles/authStyles'; // Importar estilos

export default function ProfileScreen() {
    // 2. Obtener el estado de autenticación y los datos del usuario
    const { isAuthenticated, user, role, logout } = useAuth();
    const router = useRouter();

    // 3. Función para navegar al login
    const handleLogin = () => {
        router.replace('/auth/login');
    };

    // --- 4. RENDERIZADO CONDICIONAL ---

    if (isAuthenticated && user) {
        // --- 4a. VISTA PARA USUARIO AUTENTICADO (Tu código original) ---
        return (
            <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: colors.text }}>
                    Pantalla de Perfil
                </Text>
                <Text style={{ fontSize: 16, marginBottom: 5, color: colors.textSecondary }}>
                    Email: {user.email}
                </Text>
                <Text style={{ fontSize: 16, marginBottom: 5, color: colors.textSecondary }}>
                    Nombre: {user.name}
                </Text>
                <Text style={{ fontSize: 16, marginBottom: 30, color: colors.textSecondary }}>
                    Rol: {role || 'Cargando...'}
                </Text>
                <Button
                    title="Cerrar Sesión"
                    onPress={logout}
                    color={colors.danger}
                />
            </View>
        );
    } else {
        // --- 4b. VISTA PARA INVITADO ---
        return (
            <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: colors.text, textAlign: 'center' }}>
                    Estás explorando como Invitado
                </Text>
                <Text style={{ fontSize: 16, marginBottom: 30, color: colors.textSecondary, textAlign: 'center' }}>
                    Inicia sesión o regístrate para acceder a todas las funciones.
                </Text>
                <Button
                    title="Ir a Login / Registro"
                    onPress={handleLogin}
                    color={colors.primary}
                />
            </View>
        );
    }
}