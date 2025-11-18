import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { useAuth } from '../../../src/presentation/hooks/useAuth';
import { useContrataciones } from '../../../src/presentation/hooks/useContrataciones'; // <-- Reutilizamos esto
import { colors } from '../../../src/presentation/styles/authStyles';
import { Ionicons } from '@expo/vector-icons';

export default function ChatListScreen() {
    const { role } = useAuth();
    const { solicitudes, loading: loadingContratos, refetch } = useContrataciones();
    const [clientes, setClientes] = useState<any[]>([]);

    useFocusEffect(
        useCallback(() => {
            if (role === 'asesor_comercial') {
                refetch(); // Cargamos las contrataciones recientes
            }
        }, [role])
    );

    // Procesar las solicitudes para extraer usuarios únicos
    useFocusEffect(
        useCallback(() => {
            if (solicitudes.length > 0) {
                const usuariosMap = new Map();

                solicitudes.forEach(solicitud => {
                    const user = solicitud.user_profile;
                    // Evitamos duplicados usando el ID como clave
                    if (user && !usuariosMap.has(user.id)) {
                        usuariosMap.set(user.id, {
                            id: user.id,
                            name: user.name || 'Usuario',
                            email: user.email || 'Cliente', // Nota: El email no siempre viene en profile, usamos fallback
                            telefono: user.telefono
                        });
                    }
                });

                setClientes(Array.from(usuariosMap.values()));
            }
        }, [solicitudes])
    );

    if (loadingContratos && clientes.length === 0) {
        return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
    }

    // Vista para Usuario Normal
    if (role !== 'asesor_comercial') {
        return (
            <View style={styles.centered}>
                <Ionicons name="chatbubbles" size={80} color={colors.border} />
                <Text style={styles.emptyTitle}>Chat de Soporte</Text>
                <Text style={styles.emptySubtitle}>
                    Accede al chat directamente desde la tarjeta de tu plan en "Mis Planes".
                </Text>
            </View>
        );
    }

    // Vista para Asesor
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Clientes con Planes</Text>
            </View>

            <FlatList
                data={clientes}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 10 }}
                renderItem={({ item }) => (
                    <Link
                        href={{
                            pathname: "/(tabs)/chat/[receiverId]",
                            params: { receiverId: item.id, receiverName: item.name }
                        }}
                        asChild
                    >
                        <Pressable style={styles.item}>
                            <View style={styles.avatar}>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                                    {item.name.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                                </View>
                                <Text style={styles.preview}>
                                    {item.telefono ? `Tel: ${item.telefono}` : 'Cliente Tigo'}
                                </Text>
                            </View>
                        </Pressable>
                    </Link>
                )}
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Text style={styles.emptySubtitle}>No hay clientes con planes contratados aún.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
    header: { backgroundColor: colors.card, padding: 15, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.primary },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    name: { fontWeight: 'bold', fontSize: 16, color: colors.text },
    preview: { color: colors.textSecondary, marginTop: 4 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginTop: 20 },
    emptySubtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 10 }
});