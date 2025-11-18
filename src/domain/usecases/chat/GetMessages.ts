import { Mensaje } from "../../entities/Mensaje";
import { IMessageRepository, NewMessageCallback } from "../../repositories/IMessageRepository";

export class GetMessages {
    constructor(private messageRepository: IMessageRepository) { }

    /**
     * Carga el historial inicial.
     */
    async getHistory(user1_id: string, user2_id: string): Promise<Mensaje[]> {
        if (!user1_id || !user2_id) return [];
        return this.messageRepository.getMessages(user1_id, user2_id);
    }

    /**
     * Inicia la escucha en tiempo real.
     */
    subscribe(callback: NewMessageCallback): () => void {
        return this.messageRepository.subscribeToMessages(callback);
    }
}