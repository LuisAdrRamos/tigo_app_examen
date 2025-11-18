// app/auth/login.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../../src/presentation/hooks/useAuth';
import { authStyles, colors } from '../../src/presentation/styles/authStyles';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) return;

        // Ambos botones llaman la misma función. 
        // La redirección al dashboard correcto se hace en el _layout.tsx/index.tsx
        const result = await login(email, password);

        if (result.success) {
            // Redirección manejada por el layout
        }
    };

    const handleGuest = () => {
        // Simplemente navega a la pestaña principal.
        // El layout raíz (app/_layout.tsx) se encargará de permitir el acceso.
        router.push('/(tabs)');
    };

    const isButtonDisabled = loading || !email || !password;

    return (
        <KeyboardAvoidingView
            style={authStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View style={authStyles.content}>
                    {/* <-- CAMBIO: Título actualizado */}
                    <Text style={authStyles.title}>Tigo Conecta</Text>
                    <Text style={authStyles.subtitle}>Descubre nuestros planes móviles</Text>

                    <TextInput
                        style={authStyles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TextInput
                        style={authStyles.input}
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={authStyles.linkButton}
                        onPress={() => router.push('/auth/forgotPassword')}
                    >
                        <Text style={authStyles.linkText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>

                    {/* <-- CAMBIO PRINCIPAL: Dos botones de Login (Usuario y Asesor) */}

                    {/* Botón 1: Ingresar como Usuario (Primary Color) */}
                    <TouchableOpacity
                        style={[authStyles.button, isButtonDisabled && { opacity: 0.5 }]}
                        onPress={handleLogin}
                        disabled={isButtonDisabled}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.primaryLight} />
                        ) : (
                            <Text style={authStyles.buttonText}>Ingresar</Text>
                        )}
                    </TouchableOpacity>
                    
                    {/* Botón 2: Acceder como Invitado (Color Secundario) */}
                    <TouchableOpacity
                        // CAMBIO: Usamos el estilo secundario (fondo claro)
                        style={[
                            authStyles.buttonSecondary,
                            loading && { opacity: 0.5 } // Se deshabilita si el login está cargando
                        ]}
                        onPress={handleGuest} // <-- CAMBIO: Llama a handleGuest
                        disabled={loading} // <-- CAMBIO: Solo se deshabilita si 'loading' es true
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.text} />
                        ) : (
                            // CAMBIO: Usamos el estilo de texto oscuro
                            <Text style={authStyles.buttonSecondaryText}>Acceder como Invitado</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={authStyles.linkButton}
                        onPress={() => router.push('/auth/register')}
                    >
                        <Text style={authStyles.linkText}>¿No tienes cuenta? Regístrate</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}