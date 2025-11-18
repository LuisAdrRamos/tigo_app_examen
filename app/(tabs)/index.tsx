import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/presentation/hooks/useAuth';
import { usePlanes } from '../../src/presentation/hooks/usePlanes';
import { colors, authStyles } from '../../src/presentation/styles/authStyles';
import { planesStyles } from '../../src/presentation/styles/planesStyles'; // <-- IMPORTAR
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
    const { user, role, loading: authLoading } = useAuth();
    const { planes, loading: planesLoading, refetch, eliminarPlan } = usePlanes();
    const router = useRouter();

    useEffect(() => {
        refetch();
    }, []);

    if (authLoading || planesLoading) {
        return (
            <View style={planesStyles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const handleEliminar = (id: number) => {
        Alert.alert(
            "Confirmar Eliminación",
            "¿Estás seguro de eliminar este plan?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        await eliminarPlan(id);
                        refetch();
                    }
                }
            ]
        );
    };

    if (role === 'asesor_comercial') {
        return (
            <View style={planesStyles.container}>
                <View style={planesStyles.header}>
                    <Text style={planesStyles.title}>Gestión de Planes</Text>
                    <Text style={planesStyles.subtitle}>Panel de Asesor</Text>
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
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <View style={planesStyles.adminCard}>
                            <View style={{ flex: 1 }}>
                                <Text style={planesStyles.planName}>{item.nombre}</Text>
                                <Text style={planesStyles.planPrice}>${item.precio}</Text>
                                <Text style={planesStyles.planDetail}>{item.datos_gb} - {item.minutos}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleEliminar(item.id)}>
                                <Ionicons name="trash-outline" size={24} color={colors.danger} />
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={planesStyles.emptyText}>No hay planes creados.</Text>}
                />
            </View>
        );
    }

    // --- CATALOGO ---
    return (
        <View style={planesStyles.container}>
            <View style={planesStyles.header}>
                <Text style={planesStyles.title}>Nuevos Planes Tigo</Text>
                <Text style={planesStyles.subtitle}>Los mejores planes del mercado</Text>
            </View>

            <FlatList
                data={planes}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 20 }}
                renderItem={({ item }) => (
                    <View style={planesStyles.catalogCard}>
                        <View style={planesStyles.imagePlaceholder}>
                            <Ionicons name="cellular-outline" size={40} color="white" />
                        </View>

                        <View style={planesStyles.cardContent}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={planesStyles.catalogName}>{item.nombre}</Text>
                                <Text style={planesStyles.catalogPrice}>${item.precio}</Text>
                            </View>

                            <Text style={planesStyles.catalogDescription} numberOfLines={2}>
                                {item.descripcion || "Sin descripción"}
                            </Text>

                            <View style={planesStyles.featuresRow}>
                                <View style={planesStyles.featureBadge}>
                                    <Ionicons name="wifi" size={12} color={colors.primary} />
                                    <Text style={planesStyles.featureText}>{item.datos_gb}</Text>
                                </View>
                                <View style={planesStyles.featureBadge}>
                                    <Ionicons name="call" size={12} color={colors.primary} />
                                    <Text style={planesStyles.featureText}>{item.minutos}</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[authStyles.button, { marginTop: 5, padding: 12 }]}
                                onPress={() => {
                                    if (!user) {
                                        Alert.alert("Atención", "Debes iniciar sesión para contratar.");
                                        router.push('/auth/login');
                                    } else {
                                        Alert.alert("Próximamente", "Sistema de contratación en construcción (Punto 3).");
                                    }
                                }}
                            >
                                <Text style={[authStyles.buttonText, { fontSize: 14 }]}>
                                    {user ? "Contratar Plan" : "Inicia sesión para contratar"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={planesStyles.emptyText}>No hay planes disponibles.</Text>}
            />
        </View>
    );
}