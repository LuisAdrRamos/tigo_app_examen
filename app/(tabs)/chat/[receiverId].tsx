import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useChat } from '../../../src/presentation/hooks/useChat';
import { useAuth } from '../../../src/presentation/hooks/useAuth';
import { colors } from '../../../src/presentation/styles/authStyles';
import { Ionicons } from '@expo/vector-icons';
import { Mensaje } from '@/src/domain/entities/Mensaje';

export default function ConversationScreen() {
    const navigation = useNavigation();
    const { receiverId, receiverName } = useLocalSearchParams<{ receiverId: string, receiverName: string }>();
    const { user } = useAuth();
    const { messages, loading, sendMessage } = useChat(receiverId); // Hook conectado a Realtime

    const [text, setText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    // Configurar título
    useEffect(() => {
        navigation.setOptions({ title: receiverName || 'Chat' });
    }, [receiverName]);

    // Scroll al fondo al recibir mensajes
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages]);

    const handleSend = async () => {
        if (!text.trim()) return;
        const msg = text.trim();
        setText('');
        await sendMessage(msg);
    };

    const renderMessage = ({ item }: { item: Mensaje }) => {
        const isMe = item.sender_id === user?.id;
        return (
            <View style={[
                styles.bubble,
                isMe ? styles.bubbleMe : styles.bubbleOther
            ]}>
                <Text style={isMe ? styles.textMe : styles.textOther}>{item.content}</Text>
                <Text style={[styles.time, isMe ? { color: '#ddd' } : { color: 'gray' }]}>
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        );
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#f5f5f5' }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={90}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMessage}
                contentContainerStyle={{ padding: 15 }}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Escribe un mensaje..."
                    value={text}
                    onChangeText={setText}
                    multiline
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
                    <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    bubble: { maxWidth: '80%', padding: 12, borderRadius: 15, marginBottom: 10 },
    bubbleMe: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: 2 },
    bubbleOther: { alignSelf: 'flex-start', backgroundColor: 'white', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#eee' },
    textMe: { color: 'white', fontSize: 16 },
    textOther: { color: '#333', fontSize: 16 },
    time: { fontSize: 10, marginTop: 5, alignSelf: 'flex-end' },
    inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: 'white', alignItems: 'center' },
    input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, maxHeight: 100 },
    sendBtn: { backgroundColor: colors.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }
});