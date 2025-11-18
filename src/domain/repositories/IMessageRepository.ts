import { Mensaje, SendMensajeData } from "../entities/Mensaje";

// Definimos el tipo de la función callback para cuando llega un mensaje nuevo
export type NewMessageCallback = (message: Mensaje) => void;

export interface IMessageRepository {
    /**
     * Obtiene el historial de mensajes entre dos usuarios (ordenado cronológicamente).
     */
    getMessages(
        sender_id: string,
        receiver_id: string
    ): Promise<Mensaje[]>;

    /**
     * Guarda un nuevo mensaje en la base de datos.
     */
    sendMessage(data: SendMensajeData): Promise<Mensaje>;

    /**
     * Se suscribe a cambios en la tabla de mensajes para Realtime.
     * Devuelve una función para cancelar la suscripción.
     */
    subscribeToMessages(
        callback: NewMessageCallback
    ): () => void;
}