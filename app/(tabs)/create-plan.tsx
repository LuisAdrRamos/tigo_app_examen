import React, { useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation, useFocusEffect } from 'expo-router';
import { usePlanes } from '../../src/presentation/hooks/usePlanes';
import { planesStyles } from '../../src/presentation/styles/planesStyles';
import { colors } from '../../src/presentation/styles/authStyles';

export default function CreatePlanScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const { crearPlan, actualizarPlan } = usePlanes();

    // Usamos useRef para recordar qué ID cargamos la última vez
    // Esto evita que el formulario se resetee mientras escribes
    const lastLoadedId = useRef<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados del formulario
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [datos, setDatos] = useState('');
    const [minutos, setMinutos] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [promocion, setPromocion] = useState('');

    // Auxiliar para saber si estamos editando
    const currentId = typeof params.id === 'string' ? params.id : '';
    const isEditing = !!currentId;
    const planId = currentId ? Number(currentId) : 0;

    useFocusEffect(
        useCallback(() => {
            // Lógica de protección:
            // Si el ID que llega en params es IGUAL al que ya cargamos, NO HACEMOS NADA.
            // Esto permite que escribas libremente sin que se resetee.
            if (lastLoadedId.current === currentId && currentId !== '') {
                return;
            }

            // Si entramos a "Crear Nuevo" (currentId vacío) y ya estaba vacío, tampoco hacemos nada
            // (excepto si venimos de editar, entonces sí hay que limpiar)
            if (lastLoadedId.current === '' && currentId === '') {
                return;
            }

            // Actualizamos la referencia
            lastLoadedId.current = currentId;

            if (isEditing) {
                // MODO EDICIÓN
                navigation.setOptions({ title: 'Editar Plan' });

                setNombre(typeof params.nombre === 'string' ? params.nombre : '');
                setPrecio(typeof params.precio === 'string' ? params.precio : '');
                setDatos(typeof params.datos_gb === 'string' ? params.datos_gb : '');
                setMinutos(typeof params.minutos === 'string' ? params.minutos : '');
                setDescripcion(typeof params.descripcion === 'string' ? params.descripcion : '');
                setPromocion(typeof params.promocion === 'string' ? params.promocion : '');
            } else {
                // MODO CREACIÓN
                navigation.setOptions({ title: 'Crear Nuevo Plan' });

                setNombre('');
                setPrecio('');
                setDatos('');
                setMinutos('');
                setDescripcion('');
                setPromocion('');
            }
        }, [currentId, params, isEditing, navigation]) // Dependemos de primitivos y params
    );

    const handleSubmit = async () => {
        if (!nombre || !precio || !datos || !minutos) {
            Alert.alert("Error", "Los campos principales son obligatorios.");
            return;
        }

        setIsSubmitting(true);

        const planData = {
            nombre,
            precio: parseFloat(precio),
            datos_gb: datos,
            minutos: minutos,
            descripcion,
            promocion
        };

        let result;

        if (isEditing) {
            result = await actualizarPlan(planId, planData);
        } else {
            result = await crearPlan(planData);
        }

        setIsSubmitting(false);

        if (result.success) {
            // Al terminar, reseteamos la referencia para forzar recarga si entra de nuevo al mismo plan
            lastLoadedId.current = null;

            Alert.alert(
                "Éxito",
                isEditing ? "Plan actualizado correctamente" : "Plan creado correctamente",
                [{ text: "OK", onPress: () => router.back() }]
            );
        } else {
            Alert.alert("Error", result.error);
        }
    };

    // Función para manejar el botón cancelar
    const handleCancel = () => {
        lastLoadedId.current = null; // Limpiar referencia
        router.back();
    }

    return (
        <ScrollView style={planesStyles.container} contentContainerStyle={planesStyles.formContainer}>
            <Text style={planesStyles.title}>{isEditing ? 'Editar Plan' : 'Nuevo Plan'}</Text>
            <Text style={[planesStyles.subtitle, { marginBottom: 20 }]}>
                {isEditing ? 'Modifica los detalles del plan' : 'Ingresa los detalles del nuevo plan'}
            </Text>

            <View style={planesStyles.formContent}>
                <Text style={planesStyles.label}>Nombre Comercial</Text>
                <TextInput
                    style={planesStyles.input}
                    placeholder="Ej: Plan Smart 5GB"
                    value={nombre} onChangeText={setNombre}
                />

                <Text style={planesStyles.label}>Precio ($)</Text>
                <TextInput
                    style={planesStyles.input}
                    placeholder="15.99"
                    keyboardType="numeric"
                    value={precio} onChangeText={setPrecio}
                />

                <Text style={planesStyles.label}>Datos (GB)</Text>
                <TextInput
                    style={planesStyles.input}
                    placeholder="Ej: 5GB"
                    value={datos} onChangeText={setDatos}
                />

                <Text style={planesStyles.label}>Minutos</Text>
                <TextInput
                    style={planesStyles.input}
                    placeholder="Ej: Ilimitados"
                    value={minutos} onChangeText={setMinutos}
                />

                <Text style={planesStyles.label}>Promoción (Opcional)</Text>
                <TextInput
                    style={planesStyles.input}
                    placeholder="Ej: ¡Primer mes gratis!"
                    value={promocion} onChangeText={setPromocion}
                />

                <Text style={planesStyles.label}>Descripción</Text>
                <TextInput
                    style={[planesStyles.input, planesStyles.textArea]}
                    placeholder="Detalles adicionales..."
                    multiline
                    value={descripcion} onChangeText={setDescripcion}
                />

                <TouchableOpacity
                    style={[planesStyles.submitButton, isSubmitting && { opacity: 0.5 }]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={planesStyles.buttonText}>
                            {isEditing ? 'Actualizar Plan' : 'Guardar Plan'}
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={planesStyles.cancelButton}
                    onPress={handleCancel}
                >
                    <Text style={planesStyles.linkText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}