import React, { useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'; // <-- Importar Image Picker
import { usePlanes } from '../../src/presentation/hooks/usePlanes';
import { planesStyles } from '../../src/presentation/styles/planesStyles';
import { colors } from '../../src/presentation/styles/authStyles';
import { Ionicons } from '@expo/vector-icons';

export default function CreatePlanScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const { crearPlan, actualizarPlan, subirImagen } = usePlanes(); // <-- Traemos subirImagen

    // CONTROL DE ESTADO DEL FORMULARIO
    const lastLoadedId = useRef<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados del formulario
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [datos, setDatos] = useState('');
    const [minutos, setMinutos] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [promocion, setPromocion] = useState('');
    const [imagen, setImagen] = useState<string | null>(null); // <-- Estado para la imagen

    // Auxiliar para saber si estamos editando
    const currentId = typeof params.id === 'string' ? params.id : '';
    const isEditing = !!currentId;
    const planId = currentId ? Number(currentId) : 0;

    // --- FUNCIÓN: Seleccionar Imagen ---
    const pickImage = async () => {
        // Pedir permisos (opcional en versiones nuevas pero recomendable)
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para subir fotos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7, // Comprimir un poco para ahorrar datos
        });

        if (!result.canceled) {
            setImagen(result.assets[0].uri);
        }
    };

    // --- CARGA DE DATOS (Blindada contra bugs) ---
    useFocusEffect(
        useCallback(() => {
            // Si estamos editando y el ID es el mismo que la última vez, NO HACEMOS NADA.
            // Esto evita que el formulario se resetee mientras escribes.
            if (isEditing && lastLoadedId.current === currentId) {
                return;
            }

            // Si estamos creando nuevo y ya estaba en modo nuevo ('new'), NO HACEMOS NADA.
            if (!isEditing && lastLoadedId.current === 'new') {
                return;
            }

            if (isEditing) {
                // MODO EDICIÓN: Cargar datos
                navigation.setOptions({ title: 'Editar Plan' });
                lastLoadedId.current = currentId; // Marcamos como cargado

                setNombre(typeof params.nombre === 'string' ? params.nombre : '');
                setPrecio(typeof params.precio === 'string' ? params.precio : '');
                setDatos(typeof params.datos_gb === 'string' ? params.datos_gb : '');
                setMinutos(typeof params.minutos === 'string' ? params.minutos : '');
                setDescripcion(typeof params.descripcion === 'string' ? params.descripcion : '');
                setPromocion(typeof params.promocion === 'string' ? params.promocion : '');
                // Si viene una imagen_url en los params, la seteamos
                // Nota: params no trae imagen_url por defecto en tu index.tsx anterior, 
                // pero no importa, si editas se mantiene o se carga del objeto si lo pasas.
                // Para simplificar: si no cambiamos imagen, se mantiene la vieja en backend.
                setImagen(null); // Reseteamos la visualización local al entrar
            } else {
                // MODO CREACIÓN: Limpiar todo
                navigation.setOptions({ title: 'Crear Nuevo Plan' });
                lastLoadedId.current = 'new'; // Marcamos como nuevo

                setNombre('');
                setPrecio('');
                setDatos('');
                setMinutos('');
                setDescripcion('');
                setPromocion('');
                setImagen(null);
            }
        }, [currentId, isEditing, navigation, params])
    );

    const handleSubmit = async () => {
        if (!nombre || !precio || !datos || !minutos) {
            Alert.alert("Error", "Los campos principales son obligatorios.");
            return;
        }

        setIsSubmitting(true);

        let finalImageUrl = "";

        // 1. Si hay una imagen seleccionada localmente (empieza con file://), la subimos
        if (imagen && imagen.startsWith('file://')) {
            const uploadedUrl = await subirImagen(imagen);
            if (uploadedUrl) {
                finalImageUrl = uploadedUrl;
            } else {
                setIsSubmitting(false);
                return; // Detener si falla la subida
            }
        }

        // 2. Preparamos los datos
        const planData: any = {
            nombre,
            precio: parseFloat(precio),
            datos_gb: datos,
            minutos: minutos,
            descripcion,
            promocion
        };

        // Solo agregamos imagen_url si se subió una nueva.
        // Si estamos editando y no se tocó la imagen, no enviamos el campo 
        // (o enviamos undefined) para que Supabase mantenga la anterior.
        if (finalImageUrl) {
            planData.imagen_url = finalImageUrl;
        }

        let result;

        if (isEditing) {
            result = await actualizarPlan(planId, planData);
        } else {
            result = await crearPlan(planData);
        }

        setIsSubmitting(false);

        if (result.success) {
            // Reseteamos la referencia para forzar recarga limpia la próxima vez
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

    const handleCancel = () => {
        lastLoadedId.current = null;
        router.back();
    }

    return (
        <ScrollView style={planesStyles.container} contentContainerStyle={planesStyles.formContainer}>
            <Text style={planesStyles.title}>{isEditing ? 'Editar Plan' : 'Nuevo Plan'}</Text>
            <Text style={[planesStyles.subtitle, { marginBottom: 20 }]}>
                {isEditing ? 'Modifica los detalles del plan' : 'Ingresa los detalles del nuevo plan'}
            </Text>

            <View style={planesStyles.formContent}>

                {/* SECCIÓN DE IMAGEN */}
                <Text style={planesStyles.label}>Imagen del Plan</Text>
                <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center', marginBottom: 15 }}>
                    {imagen ? (
                        <Image
                            source={{ uri: imagen }}
                            style={{ width: '100%', height: 200, borderRadius: 10, resizeMode: 'cover' }}
                        />
                    ) : (
                        <View style={{
                            width: '100%', height: 150,
                            backgroundColor: colors.background,
                            justifyContent: 'center', alignItems: 'center',
                            borderRadius: 10, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed'
                        }}>
                            <Ionicons name="image-outline" size={40} color={colors.textSecondary} />
                            <Text style={{ color: colors.textSecondary, marginTop: 5 }}>Toque para subir imagen</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <Text style={planesStyles.label}>Nombre Comercial</Text>
                <TextInput
                    style={planesStyles.input}
                    placeholder="Ej: Plan Smart 5GB"
                    value={nombre} onChangeText={setNombre}
                />

                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={planesStyles.label}>Precio ($)</Text>
                        <TextInput
                            style={planesStyles.input}
                            placeholder="15.99"
                            keyboardType="numeric"
                            value={precio} onChangeText={setPrecio}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={planesStyles.label}>Datos (GB)</Text>
                        <TextInput
                            style={planesStyles.input}
                            placeholder="Ej: 5GB"
                            value={datos} onChangeText={setDatos}
                        />
                    </View>
                </View>

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