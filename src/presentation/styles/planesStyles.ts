import { StyleSheet } from 'react-native';
import { colors } from './authStyles'; // Reutilizamos la paleta de colores

export const planesStyles = StyleSheet.create({
    // --- GENERAL ---
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        padding: 20,
        backgroundColor: colors.card,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 5
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: colors.textSecondary,
        fontSize: 16
    },

    // --- ADMIN CARD (Lista de Asesor) ---
    adminCard: {
        flexDirection: 'row',
        backgroundColor: colors.card,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        elevation: 2, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    planName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text
    },
    planPrice: {
        fontSize: 14,
        color: colors.secondary,
        fontWeight: 'bold',
        marginTop: 2
    },
    planDetail: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2
    },

    // --- CATALOG CARD (Lista de Usuario) ---
    catalogCard: {
        backgroundColor: colors.card,
        borderRadius: 15,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imagePlaceholder: {
        height: 120,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardContent: {
        padding: 15
    },
    catalogName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text
    },
    catalogPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary
    },
    catalogDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        marginVertical: 8
    },
    featuresRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 15,
        marginTop: 5
    },
    featureBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.primaryLight,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 5
    },
    featureText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '600'
    },

    // --- FORMULARIOS (Crear Plan) ---
    formContainer: {
        padding: 20,
    },
    formContent: {
        backgroundColor: colors.card,
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
        marginTop: 10,
    },
    input: {
        height: 50,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: colors.white,
        color: colors.text,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 15,
    },
    submitButton: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 25,
    },
    cancelButton: {
        marginTop: 15,
        alignItems: 'center',
        padding: 10
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkText: {
        color: colors.textSecondary,
        fontSize: 16,
    }
});