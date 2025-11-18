import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useContrataciones } from '../../src/presentation/hooks/useContrataciones';
import { colors } from '../../src/presentation/styles/authStyles';
import { Ionicons } from '@expo/vector-icons';
import { ContratacionView } from '@/src/domain/entities/Contratacion';

export default function SolicitudesScreen() {
    const { solicitudes, loading, refetch, aprobarSolicitud, rechazarSolicitud } = useContrataciones();
    const [isProcessing, setIsProcessing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [])
    );

    const handleAction = async (id: number, action: 'aprobado' | 'rechazado') => {
        setIsProcessing(true);
        const success = await (action === 'aprobado' ? aprobarSolicitud(id) : rechazarSolicitud(id));
        setIsProcessing(false);
        if (success) {
            Alert.alert("Éxito", `Solicitud ${action} correctamente.`);
        }
    };

    const formatEstado = (estado: string) => {
        switch (estado) {
            case 'aprobado': return { text: 'Aprobado', icon: 'checkmark-circle', color: '#4CAF50' };
            case 'rechazado': return { text: 'Rechazado', icon: 'close-circle', color: '#F44336' };
            case 'pendiente': default: return { text: 'Pendiente', icon: 'time', color: '#FFC107' };
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const renderItem = ({ item }: { item: ContratacionView }) => {
        const estado = formatEstado(item.estado);

        // PROTECCIÓN CONTRA NULOS AQUÍ
        const planNombre = item.plan?.nombre || "Plan Desconocido";
        const clienteNombre = item.user_profile?.name || "Usuario Desconocido";
        const clienteTelefono = item.user_profile?.telefono || "Sin teléfono";

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.planName}>{planNombre}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: estado.color + '20' }]}>
                        <Ionicons name={estado.icon as any} size={14} color={estado.color} />
                        <Text style={[styles.statusText, { color: estado.color }]}>{estado.text}</Text>
                    </View>
                </View>

                <Text style={styles.clientName}>Cliente: {clienteNombre}</Text>
                <Text style={styles.clientInfo}>Teléfono: {clienteTelefono}</Text>

                <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>Solicitud: {formatDate(item.fecha_solicitud)}</Text>
                </View>

                {item.estado === 'pendiente' && (
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.approveButton]}
                            onPress={() => handleAction(item.id, 'aprobado')}
                            disabled={isProcessing}
                        >
                            {isProcessing ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionText}>Aprobar</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.rejectButton]}
                            onPress={() => handleAction(item.id, 'rechazado')}
                            disabled={isProcessing}
                        >
                            {isProcessing ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionText}>Rechazar</Text>}
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    if (loading && solicitudes.length === 0) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gestión de Solicitudes</Text>
            <Text style={styles.subtitle}>Listado de planes requeridos por clientes.</Text>

            <FlatList
                data={solicitudes}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshing={loading}
                onRefresh={refetch}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay solicitudes pendientes.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 20,
    },
    card: {
        backgroundColor: colors.card,
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    planName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
    },
    clientName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 2,
    },
    clientInfo: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    detailText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 8,
    },
    actionsContainer: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'flex-end',
        gap: 10,
    },
    actionButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    approveButton: {
        backgroundColor: '#4CAF50', // Green
    },
    rejectButton: {
        backgroundColor: '#F44336', // Red
    },
    actionText: {
        color: 'white',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textSecondary,
        marginTop: 50,
        fontSize: 16,
    },
});