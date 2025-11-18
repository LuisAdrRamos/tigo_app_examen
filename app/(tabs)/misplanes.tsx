import React, { useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useContrataciones } from '../../src/presentation/hooks/useContrataciones';
import { colors } from '../../src/presentation/styles/authStyles';
import { Ionicons } from '@expo/vector-icons';

export default function MisContratacionesScreen() {
    const { solicitudes, loading, refetch } = useContrataciones();

    // Recargar cada vez que la pantalla gana el foco (navegas a ella)
    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [])
    );

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'aprobado': return '#4CAF50'; // Verde
            case 'rechazado': return '#F44336'; // Rojo
            default: return '#FFC107'; // Amarillo (Pendiente)
        }
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

                        <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                            <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                            <Text style={{ color: colors.textSecondary, marginLeft: 5, fontSize: 12 }}>
                                Solicitado: {new Date(item.fecha_solicitud).toLocaleDateString()}
                            </Text>
                        </View>
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
    card: { backgroundColor: colors.card, padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
    planName: { fontSize: 18, fontWeight: 'bold', color: colors.primary }
});