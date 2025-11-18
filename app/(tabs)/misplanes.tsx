import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useContrataciones } from '../../src/presentation/hooks/useContrataciones';
import { colors } from '../../src/presentation/styles/authStyles';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/src/data/services/supabaseClient'; // <-- Importante

export default function MisContratacionesScreen() {
    const { solicitudes, loading, refetch } = useContrataciones();
    const router = useRouter();

    // Estado para guardar el ID real de un asesor disponible
    const [asesorId, setAsesorId] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [])
    );

    // --- BUSCAR UN ASESOR REAL AL CARGAR ---
    useEffect(() => {
        const obtenerAsesor = async () => {
            try {
                // Buscamos el primer usuario que sea 'asesor_comercial' en la base de datos
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, name')
                    .eq('role', 'asesor_comercial')
                    .limit(1)
                    .single();

                if (data) {
                    console.log("Asesor encontrado para chat:", data.name);
                    setAsesorId(data.id);
                } else {
                    console.log("No se encontraron asesores en la base de datos.");
                }
            } catch (err) {
                console.log("Error buscando asesor:", err);
            }
        };
        obtenerAsesor();
    }, []);

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'aprobado': return '#4CAF50';
            case 'rechazado': return '#F44336';
            default: return '#FFC107';
        }
    };

    // Función para ir al chat
    const handleChat = () => {
        if (!asesorId) {
            Alert.alert("Error", "No se encontró ningún asesor disponible para chatear.");
            return;
        }

        router.push({
            pathname: '/(tabs)/chat/[receiverId]',
            params: {
                receiverId: asesorId, // <-- Usamos el ID real obtenido de la BD
                receiverName: 'Soporte Tigo'
            }
        });
    };

    if (loading && solicitudes.length === 0) {
        return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Contrataciones</Text>
            <FlatList
                data={solicitudes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.planName}>{item.plan.nombre}</Text>
                            <View style={{
                                backgroundColor: getStatusColor(item.estado) + '20',
                                paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10
                            }}>
                                <Text style={{ color: getStatusColor(item.estado), fontWeight: 'bold', fontSize: 12 }}>
                                    {item.estado.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                            <Ionicons name="pricetag-outline" size={16} color={colors.textSecondary} />
                            <Text style={{ color: colors.textSecondary, marginLeft: 5 }}>Precio: ${item.plan.precio}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 15, alignItems: 'center' }}>
                            <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                            <Text style={{ color: colors.textSecondary, marginLeft: 5, fontSize: 12 }}>
                                Solicitado: {new Date(item.fecha_solicitud).toLocaleDateString()}
                            </Text>
                        </View>

                        {/* BOTÓN DE CHAT */}
                        <TouchableOpacity
                            style={styles.chatButton}
                            onPress={handleChat}
                        >
                            <Ionicons name="chatbubbles-outline" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.chatButtonText}>Chat con Asesor</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50, color: colors.textSecondary }}>No tienes planes contratados aún.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 20 },
    card: { backgroundColor: colors.card, padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
    planName: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
    chatButton: {
        backgroundColor: colors.secondary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 5
    },
    chatButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});