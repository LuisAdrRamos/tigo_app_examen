import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/presentation/hooks/useAuth';
import { colors } from '../../src/presentation/styles/authStyles';
import { Platform } from 'react-native';

export default function TabLayout() {
    const { role, isAuthenticated } = useAuth();
    const isAsesor = role === 'asesor_comercial';
    const headerTintColor = Platform.OS === 'ios' ? colors.primary : colors.text;

    const renderIcon = (name: keyof typeof Ionicons.glyphMap) => ({ color }: { color: string }) => (
        <Ionicons name={name} size={24} color={color} />
    );

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                    height: Platform.OS === 'ios' ? 85 : 65,
                    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginTop: -5,
                },
                headerStyle: {
                    backgroundColor: colors.card,
                    borderBottomColor: colors.border,
                },
                headerTintColor: headerTintColor,
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            {/* 1. Catálogo (Siempre visible) */}
            <Tabs.Screen
                name="index"
                options={{
                    title: isAsesor ? 'Gestión' : 'Catálogo',
                    tabBarIcon: renderIcon(isAsesor ? 'grid' : 'home'),
                }}
            />

            {/* 2. Solicitudes (Solo Asesor) */}
            <Tabs.Screen
                name="solicitudes"
                options={{
                    title: 'Solicitudes',
                    tabBarIcon: renderIcon('documents'),
                    href: isAsesor ? undefined : null,
                }}
            />

            {/* 3. Chat (Solo Asesor) */}
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chats',
                    tabBarIcon: renderIcon('chatbubbles'),
                    // Importante: Como es un Stack, al darle click entra a su _layout
                    href: isAsesor ? undefined : null,
                    headerShown: false // Ocultamos el header del Tab para que el Stack controle su propio header
                }}
            />

            {/* 4. Mis Planes (Solo Usuario) */}
            <Tabs.Screen
                name="misplanes"
                options={{
                    title: 'Mis Planes',
                    tabBarIcon: renderIcon('briefcase'),
                    href: (!isAsesor && isAuthenticated) ? undefined : null,
                }}
            />

            {/* 5. Perfil (Siempre visible) */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: renderIcon('person'),
                }}
            />

            {/* --- RUTAS OCULTAS --- */}

            <Tabs.Screen name="create-plan" options={{ href: null, headerTitle: isAsesor ? 'Crear Plan' : 'Detalle Plan' }} />
            <Tabs.Screen name="change-password" options={{ href: null, headerTitle: 'Seguridad' }} />
            
        </Tabs>
    );
}