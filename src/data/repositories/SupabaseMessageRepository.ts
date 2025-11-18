import { Mensaje, SendMensajeData } from "../../domain/entities/Mensaje";
import { IMessageRepository, NewMessageCallback } from "../../domain/repositories/IMessageRepository";
import { supabase } from "../services/supabaseClient";
import { RealtimeChannel } from "@supabase/supabase-js";

export class SupabaseMessageRepository implements IMessageRepository {

    private channel: RealtimeChannel | null = null;

    // 1. Obtener historial usando la función RPC de la base de datos
    async getMessages(sender_id: string, receiver_id: string): Promise<Mensaje[]> {
        const { data, error } = await supabase.rpc('get_conversation_messages', {
            user_id_a: sender_id,
            user_id_b: receiver_id,
        });

        if (error) {
            console.error("Error fetching messages:", error.message);
            return [];
        }
        return data as Mensaje[];
    }

    // 2. Enviar mensaje (Insert normal)
    async sendMessage(data: SendMensajeData): Promise<Mensaje> {
        const { data: newMessage, error } = await supabase
            .from('mensajes')
            .insert({
                sender_id: data.sender_id,
                receiver_id: data.receiver_id,
                content: data.content,
            })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return newMessage as Mensaje;
    }

    // 3. Suscripción Realtime (Escuchar todo INSERT en la tabla mensajes)
    subscribeToMessages(callback: NewMessageCallback): () => void {
        // Creamos un canal único para evitar colisiones
        this.channel = supabase.channel('public:mensajes:chat_global');

        this.channel
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'mensajes'
                },
                (payload) => {
                    // Cuando llega un mensaje nuevo, avisamos a la UI
                    const newMessage = payload.new as Mensaje;
                    callback(newMessage);
                }
            )
            .subscribe();

        // Devolvemos función de limpieza
        return () => {
            if (this.channel) {
                supabase.removeChannel(this.channel);
                this.channel = null;
            }
        };
    }
}