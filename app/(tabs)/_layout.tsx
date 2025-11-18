import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/presentation/hooks/useAuth';
import { colors } from '../../src/presentation/styles/authStyles';

export default function TabLayout() {
    const { role, isAuthenticated } = useAuth();
    const isAsesor = role === 'asesor_comercial';

    const renderIcon = (name: any) => ({ color }: { color: string }) => (
        <Ionicons name={name} size={28} color={color} />
    );

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: colors.primary,
            headerShown: true,
        }}>
            {/* 1. Pestaña Catálogo / Gestión */}
            <Tabs.Screen name="index" options={{
                title: isAsesor ? 'Gestión Planes' : 'Catálogo',
                tabBarIcon: renderIcon(isAsesor ? 'list' : 'home'),
            }} />

            {/* 2. Pestaña Condicional (Solicitudes vs Mis Planes) */}
            {isAsesor ? (
                // Tab para Asesor
                <Tabs.Screen name="solicitudes" options={{
                    title: 'Solicitudes',
                    tabBarIcon: renderIcon('documents'),
                }} />
            ) : (
                // Tab para Usuario (Solo si está logueado)
                isAuthenticated ? (
                    <Tabs.Screen name="misplanes" options={{
                        title: 'Mis Planes',
                        tabBarIcon: renderIcon('briefcase'),
                    }} />
                ) : (
                    // Si es invitado, ocultamos esta pestaña
                    <Tabs.Screen name="misplanes" options={{ href: null }} />
                )
            )}

            {/* 3. Pestaña Perfil */}
            <Tabs.Screen name="profile" options={{
                title: 'Perfil',
                tabBarIcon: renderIcon('person'),
            }} />

            {/* --- RUTAS OCULTAS DEL MENÚ --- */}
            {/* Estas pantallas existen pero no tienen botón en la barra inferior */}

            <Tabs.Screen name="create-plan" options={{ href: null, title: 'Plan' }} />
            <Tabs.Screen name="change-password" options={{ href: null, title: 'Seguridad' }} />
            <Tabs.Screen name="chat/index" options={{ href: null }} />
            <Tabs.Screen name="chat/[receiverId]" options={{ href: null }} />

            {/* Si no es Asesor, ocultamos la ruta de solicitudes para que no sea accesible */}
            {!isAsesor && <Tabs.Screen name="solicitudes" options={{ href: null }} />}

        </Tabs>
    );
}