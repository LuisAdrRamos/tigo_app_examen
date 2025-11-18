import React, { useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/presentation/hooks/useAuth';
import { usePlanes } from '../../src/presentation/hooks/usePlanes';
// Importamos el nuevo hook
import { useContrataciones } from '../../src/presentation/hooks/useContrataciones';
import { colors, authStyles } from '../../src/presentation/styles/authStyles';
import { planesStyles } from '../../src/presentation/styles/planesStyles';
import { Ionicons } from '@expo/vector-icons';
import { PlanMovil } from '@/src/domain/entities/PlanMovil';

export default function DashboardScreen() {
    const { user, role, loading: authLoading } = useAuth();
    const { planes, loading: planesLoading, eliminarPlan } = usePlanes();
    // Usamos la función contratarPlan
    const { contratarPlan } = useContrataciones();
    const router = useRouter();

    // Estado de carga inicial
    if (authLoading || (planesLoading && planes.length === 0 && role !== 'asesor_comercial')) {
        return (
            <View style={planesStyles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const handleEliminar = (id: number) => {
        Alert.alert("Confirmar", "¿Eliminar plan?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Eliminar", style: "destructive", onPress: () => eliminarPlan(id) }
        ]);
    };

    const handleEditar = (plan: PlanMovil) => {
        router.push({
            pathname: '/(tabs)/create-plan',
            params: {
                id: plan.id,
                nombre: plan.nombre,
                precio: plan.precio.toString(),
                datos_gb: plan.datos_gb,
                minutos: plan.minutos,
                descripcion: plan.descripcion || '',
                promocion: plan.promocion || '',
                imagen_url: plan.imagen_url || ''
            }
        });
    };

    // --- NUEVA LÓGICA DE CONTRATACIÓN ---
    const handleContratar = (planId: number) => {
        if (!user) {
            Alert.alert("Atención", "Debes iniciar sesión para contratar.", [
                { text: "Cancelar" },
                { text: "Login", onPress: () => router.push('/auth/login') }
            ]);
            return;
        }

        Alert.alert("Contratar Plan", "¿Deseas solicitar la contratación de este plan?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Solicitar",
                onPress: async () => {
                    const res = await contratarPlan(planId);
                    if (res.success) {
                        Alert.alert("¡Solicitud Enviada!", "Puedes ver el estado en la pestaña 'Mis Planes'.");
                    } else {
                        Alert.alert("Error", res.error || "Fallo al solicitar.");
                    }
                }
            }
        ]);
    };

    // --- VISTA ASESOR ---
    if (role === 'asesor_comercial') {
        return (
            <View style={planesStyles.container}>
                <View style={planesStyles.header}>
                    <Text style={planesStyles.title}>Gestión de Planes</Text>
                </View>
                <TouchableOpacity
                    style={[authStyles.button, { margin: 20 }]}
                    onPress={() => router.push('/(tabs)/create-plan')}
                >
                    <Text style={authStyles.buttonText}>+ Crear Nuevo Plan</Text>
                </TouchableOpacity>
                <FlatList
                    data={planes}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    renderItem={({ item }) => (
                        <View style={planesStyles.adminCard}>
                            {item.imagen_url ? (
                                <Image source={{ uri: item.imagen_url }} style={{ width: 60, height: 60, borderRadius: 8, marginRight: 15 }} resizeMode="cover" />
                            ) : (
                                <View style={{ width: 60, height: 60, borderRadius: 8, marginRight: 15, backgroundColor: colors.primaryLight }} />
                            )}
                            <View style={{ flex: 1 }}>
                                <Text style={planesStyles.planName}>{item.nombre}</Text>
                                <Text style={planesStyles.planPrice}>${item.precio}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 15 }}>
                                <TouchableOpacity onPress={() => handleEditar(item)}>
                                    <Ionicons name="pencil" size={24} color={colors.secondary} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleEliminar(item.id)}>
                                    <Ionicons name="trash-outline" size={24} color={colors.danger} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={planesStyles.emptyText}>No hay planes creados.</Text>}
                />
            </View>
        );
    }

    // --- VISTA USUARIO ---
    return (
        <View style={planesStyles.container}>
            <View style={planesStyles.header}>
                <Text style={planesStyles.title}>Catálogo Tigo</Text>
            </View>
            <FlatList
                data={planes}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 20 }}
                renderItem={({ item }) => (
                    <View style={planesStyles.catalogCard}>
                        {item.imagen_url ? (
                            <Image source={{ uri: item.imagen_url }} style={{ width: '100%', height: 150 }} resizeMode="cover" />
                        ) : (
                            <View style={planesStyles.imagePlaceholder}><Ionicons name="cellular" size={40} color="white" /></View>
                        )}
                        <View style={planesStyles.cardContent}>
                            <Text style={planesStyles.catalogName}>{item.nombre}</Text>
                            <Text style={planesStyles.catalogPrice}>${item.precio}</Text>
                            {item.promocion && <Text style={{ color: '#FBC02D', fontWeight: 'bold', marginVertical: 5 }}>{item.promocion}</Text>}

                            <Text style={{ color: colors.textSecondary, marginBottom: 10 }}>{item.descripcion}</Text>

                            {/* BOTÓN CONTRATAR CONECTADO */}
                            <TouchableOpacity
                                style={[authStyles.button, { marginTop: 10 }]}
                                onPress={() => handleContratar(item.id)}
                            >
                                <Text style={authStyles.buttonText}>Contratar Plan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={planesStyles.emptyText}>No hay planes disponibles.</Text>}
            />
        </View>
    );
}