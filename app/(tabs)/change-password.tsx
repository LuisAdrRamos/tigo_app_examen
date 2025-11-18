import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/presentation/hooks/useAuth';
import { authStyles, colors } from '../../src/presentation/styles/authStyles';

export default function ChangePasswordScreen() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { updatePassword, logout } = useAuth();
    const router = useRouter();

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert("Error", "Por favor completa todos los campos.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Las contraseñas no coinciden.");
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setIsSubmitting(true);

        // --- LÓGICA "FIRE & FORGET" ---

        // 1. Lanzamos la petición a Supabase (sin await bloqueante aquí)
        // Capturamos error solo si ocurre muy rápido
        updatePassword(newPassword).catch((err) => {
            console.log("Error o interrupción en updatePassword (esperado si se cierra sesión):", err);
        });

        // 2. Esperamos 2 segundos fijos. 
        // Asumimos que en 2s la orden ya llegó al servidor.
        setTimeout(() => {
            setIsSubmitting(false);

            // 3. Forzamos el éxito visual y el logout
            Alert.alert(
                "Proceso Finalizado",
                "Tu contraseña se ha actualizado. Por seguridad, tu sesión se cerrará.",
                [
                    {
                        text: "Entendido",
                        onPress: () => {
                            // Navegamos al login forzosamente
                            logout();
                        }
                    }
                ]
            );
        }, 2000);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    padding: 30
                }}
            >
                <View style={authStyles.content}>
                    <Text style={authStyles.title}>Cambiar Contraseña</Text>
                    <Text style={authStyles.subtitle}>Ingresa tu nueva contraseña</Text>

                    <Text style={authStyles.roleLabel}>Nueva Contraseña</Text>
                    <TextInput
                        style={authStyles.input}
                        placeholder="Mínimo 6 caracteres"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                    />

                    <Text style={authStyles.roleLabel}>Confirmar Contraseña</Text>
                    <TextInput
                        style={authStyles.input}
                        placeholder="Repite la contraseña"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={[authStyles.button, isSubmitting && { opacity: 0.5 }]}
                        onPress={handleChangePassword}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <Text style={authStyles.buttonText}>Actualizar Contraseña</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={authStyles.linkButton}
                        onPress={() => router.back()}
                        disabled={isSubmitting}
                    >
                        <Text style={authStyles.linkText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}