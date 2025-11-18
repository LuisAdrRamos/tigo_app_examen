/**
 * Entidad de Dominio Mensaje.
 * Coincide con la tabla 'mensajes' de Supabase.
 */
export interface Mensaje {
    id: number;
    sender_id: string;      // Quién lo envía
    receiver_id: string;    // Para quién es
    content: string;        // El texto
    created_at: string;     // Fecha
}

/**
 * DTO (Data Transfer Object) para enviar un mensaje nuevo.
 */
export interface SendMensajeData {
    sender_id: string;
    receiver_id: string;
    content: string;
}