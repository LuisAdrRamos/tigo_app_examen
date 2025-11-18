import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlanes } from '../../src/presentation/hooks/usePlanes';
import { planesStyles } from '../../src/presentation/styles/planesStyles'; // <-- IMPORTAR
import { colors } from '../../src/presentation/styles/authStyles';

export default function CreatePlanScreen() {
    const router = useRouter();
    const { crearPlan } = usePlanes();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [datos, setDatos] = useState('');
    const [minutos, setMinutos] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const handleCreate = async () => {
        if (!nombre || !precio || !datos || !minutos) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        setIsSubmitting(true);

        const result = await crearPlan({
            nombre,
            precio: parseFloat(precio),
            datos_gb: datos,
            minutos: minutos,
            descripcion,
        });

        setIsSubmitting(false);

        if (result.success) {
            Alert.alert("Éxito", "Plan creado correctamente", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } else {
            Alert.alert("Error", result.error);
        }
    };

    return (
        <ScrollView style={planesStyles.container} contentContainerStyle={planesStyles.formContainer}>
            <Text style={planesStyles.title}>Nuevo Plan</Text>
            <Text style={[planesStyles.subtitle, { marginBottom: 20 }]}>Ingresa los detalles del plan</Text>

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

                <Text style={planesStyles.label}>Descripción</Text>
                <TextInput
                    style={[planesStyles.input, planesStyles.textArea]}
                    placeholder="Detalles adicionales..."
                    multiline
                    value={descripcion} onChangeText={setDescripcion}
                />

                <TouchableOpacity
                    style={[planesStyles.submitButton, isSubmitting && { opacity: 0.5 }]}
                    onPress={handleCreate}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={planesStyles.buttonText}>Guardar Plan</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={planesStyles.cancelButton}
                    onPress={() => router.back()}
                >
                    <Text style={planesStyles.linkText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}