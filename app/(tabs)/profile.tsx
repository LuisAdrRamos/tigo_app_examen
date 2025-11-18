import { View, Text, Button, TextInput, Alert, ScrollView, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/presentation/hooks/useAuth';
import { useRouter } from 'expo-router';
import { authStyles, colors } from '../../src/presentation/styles/authStyles';

export default function ProfileScreen() {
    const { isAuthenticated, user, logout, updateProfile } = useAuth();
    const router = useRouter();

    const [name, setName] = useState('');
    const [telefono, setTelefono] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sincronizar estado
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setTelefono(user.telefono || '');
        }
    }, [user]);

    const handleLogin = () => {
        router.replace('/auth/login');
    };

    const handleUpdateProfile = async () => {
        setIsSubmitting(true);
        await updateProfile(name, telefono);
        setIsSubmitting(false);
    };

    // --- 1. PROTECCIÓN CONTRA RENDERIZADO NULO ---
    // Si está autenticado pero 'user' aún no carga (raro pero posible), mostramos carga
    if (isAuthenticated && !user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    // --- 2. VISTA PARA INVITADO ---
    if (!isAuthenticated) {
        return (
            <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: colors.text, textAlign: 'center' }}>
                    Estás explorando como Invitado
                </Text>
                <Text style={{ fontSize: 16, marginBottom: 30, color: colors.textSecondary, textAlign: 'center' }}>
                    Inicia sesión o regístrate para ver tu perfil.
                </Text>
                <TouchableOpacity
                    style={authStyles.button}
                    onPress={handleLogin}
                >
                    <Text style={authStyles.buttonText}>Ir a Login / Registro</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // --- 3. VISTA AUTENTICADA ---
    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ padding: 20 }}>

                <Text style={authStyles.title}>Mi Perfil</Text>

                <View style={authStyles.content}>
                    <Text style={authStyles.subtitle}>Mis Datos</Text>

                    <Text style={authStyles.roleLabel}>Email (No editable)</Text>
                    <TextInput
                        style={[authStyles.input, { backgroundColor: colors.border, color: colors.textSecondary }]}
                        value={user?.email}
                        editable={false}
                    />

                    <Text style={authStyles.roleLabel}>Nombre Completo</Text>
                    <TextInput
                        style={authStyles.input}
                        placeholder="Nombre Completo"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={authStyles.roleLabel}>Teléfono</Text>
                    <TextInput
                        style={authStyles.input}
                        placeholder="Teléfono"
                        value={telefono}
                        onChangeText={setTelefono}
                        keyboardType="phone-pad"
                    />

                    <TouchableOpacity
                        style={[authStyles.button, isSubmitting && { opacity: 0.5 }]}
                        onPress={handleUpdateProfile}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <Text style={authStyles.buttonText}>Guardar Cambios</Text>
                        )}
                    </TouchableOpacity>

                    <Text style={[authStyles.subtitle, { marginTop: 30 }]}>Seguridad</Text>
                    <TouchableOpacity
                        style={authStyles.buttonSecondary}
                        onPress={() => router.push('/(tabs)/change-password')}
                    >
                        <Text style={authStyles.buttonSecondaryText}>Restablecer Contraseña</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[authStyles.button, { backgroundColor: colors.danger, marginTop: 30 }]}
                        onPress={logout}
                        disabled={isSubmitting}
                    >
                        <Text style={authStyles.buttonText}>Cerrar Sesión</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}