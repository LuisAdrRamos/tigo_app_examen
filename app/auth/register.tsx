// app/auth/register.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { useAuth } from '../../src/presentation/hooks/useAuth';
import { authStyles, colors } from '../../src/presentation/styles/authStyles';
// UserRole ya está disponible para el tipado, aunque lo pasemos hardcodeado

export default function RegisterScreen() {
    // <-- CAMBIO: Añadido estado para el teléfono
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [telefono, setTelefono] = useState(''); // <-- NUEVO ESTADO

    // El rol ya no se necesita en el estado local, se pasa hardcodeado
    const { register, loading } = useAuth();
    const router = useRouter();

    const handleRegister = async () => {
        // <-- CAMBIO: Validamos que 'telefono' sea obligatorio
        if (!email || !password || !name || !telefono) return;

        // Rol hardcodeado a 'usuario_registrado' según el examen
        const ROL_DEFAULT = "usuario_registrado";

        // <-- CAMBIO: Pasamos 'telefono' y ROL_DEFAULT
        const result = await register(email, password, name, telefono, ROL_DEFAULT);

        if (result.success) {
            // El UseCase ya muestra el Alert con el mensaje de éxito
            router.replace('/auth/login');
        }
    };

    // <-- CAMBIO: Añadida validación de 'telefono'
    const isButtonDisabled = loading || !email || !password || !name || !telefono || name.length < 2 || password.length < 6;

    return (
        <KeyboardAvoidingView
            style={authStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View style={authStyles.content}>
                    <Text style={authStyles.title}>Crear Cuenta</Text>
                    {/* <-- CAMBIO: Texto subtítulo actualizado */}
                    <Text style={authStyles.subtitle}>Regístrate como Usuario Registrado de Tigo Conecta.</Text>

                    {/* Campo de Nombre */}
                    <TextInput
                        style={authStyles.input}
                        placeholder="Nombre completo"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />

                    {/* Campo de Teléfono */}
                    <TextInput
                        style={authStyles.input}
                        placeholder="Teléfono (Ej: 099123456)" // <-- CAMBIO: placeholder más útil
                        value={telefono}
                        onChangeText={setTelefono}
                        keyboardType="phone-pad"
                    />

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
                        placeholder="Contraseña (mín. 6 caracteres)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={[authStyles.button, isButtonDisabled && { opacity: 0.5, backgroundColor: colors.border }]}
                        onPress={handleRegister}
                        disabled={isButtonDisabled}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.primaryLight} />
                        ) : (
                            <Text style={authStyles.buttonText}>Registrarme</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={authStyles.linkButton}
                        onPress={() => router.back()}
                    >
                        <Text style={authStyles.linkText}>Volver a Iniciar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}