import { Stack } from 'expo-router';
import React from 'react';
import { colors } from '../../../src/presentation/styles/authStyles';

export default function ChatStackLayout() {
    return (
        <Stack screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: 'white',
            headerTitleStyle: { fontWeight: 'bold' }
        }}>
            <Stack.Screen
                name="index"
                options={{ title: 'Conversaciones', headerShown: false }}
            />
            <Stack.Screen
                name="[receiverId]"
                options={{ title: 'Chat' }}
            />
        </Stack>
    );
}