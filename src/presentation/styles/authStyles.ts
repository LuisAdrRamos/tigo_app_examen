// src/presentation/styles/authStyles.ts
import { StyleSheet } from 'react-native';

// Definimos la nueva paleta de colores basada en TIGO/Azul corporativo
export const colors = { // <-- Aseguramos que 'colors' se exporte
    // Colores corporativos (AZUL/VERDE)
    primary: '#0047AB', // AZUL OSCURO FUERTE (Botones principales)
    primaryLight: '#E6F0FF', // AZUL MUY CLARO (Fondo de botones seleccionados/roles)
    secondary: '#0b66e6ff', // VERDE (Usado para el botón Asesor en el Login - tomado de colors.success original)
    danger: '#FF3B30', // Rojo (Para cerrar sesión/alertas)

    // Neutros
    background: '#F0F5FA', // Fondo de la app (Gris/Azul muy claro)
    card: '#FFFFFF', // Fondo de tarjetas/inputs
    white: '#FFFFFF',
    lightGray: '#D0D0D0', // <-- NUEVO: Para fondos de botones deshabilitados

    // Textos
    text: '#030e1fff', // Texto principal (Azul oscuro)
    textSecondary: '#5A6E8A', // Texto secundario
    border: '#B3C8E6', // Borde claro para inputs/contenedores
};

export const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: colors.background,
    },
    content: {
        backgroundColor: colors.card,
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: colors.text,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center',
        color: colors.textSecondary,
    },
    input: {
        height: 50,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: colors.card,
        color: colors.text,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    // <-- NUEVO ESTILO: Para el botón secundario (Asesor)
    buttonSecondary: {
        backgroundColor: colors.primaryLight, // Un azul claro
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    // <-- NUEVO ESTILO: Para el texto del botón secundario
    buttonSecondaryText: {
        color: colors.primary, // Texto azul oscuro para el botón claro
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 15,
        padding: 5,
    },
    linkText: {
        textAlign: 'center',
        color: colors.primary,
        fontSize: 15,
    },
    // Estilos de Rol (Mantenemos la estructura por si la necesitamos después)
    roleLabel: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: '600',
        color: colors.text,
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: colors.border,
        borderRadius: 10,
        padding: 5,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    roleButtonSelected: {
        backgroundColor: colors.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    roleText: {
        color: colors.textSecondary,
        fontWeight: '500',
        fontSize: 16,
    },
    roleTextSelected: {
        color: colors.primary,
        fontWeight: 'bold',
    },
});