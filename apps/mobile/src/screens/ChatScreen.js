import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Send, Bot } from 'lucide-react-native';
import api from '../api';

export default function ChatScreen() {
    const [messages, setMessages] = useState([
        { id: '1', role: 'assistant', text: "Hi there! I'm Angelina, your AI Speaking Coach. 👋 \nNeed help booking a trainer or analyzing your progress?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input.trim();
        const newMsg = { id: Date.now().toString(), role: 'user', text: userMsg };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await api.post('/ai/chat', { message: userMsg });
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: data.reply || data.message || "I encountered an error." }]);
        } catch (error) {
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: "Network error connecting to my brain." }]);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.bubbleWrapper, item.role === 'user' ? styles.userWrapper : styles.aiWrapper]}>
            <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                <Text style={item.role === 'user' ? styles.userText : styles.aiText}>{item.text}</Text>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container} keyboardVerticalOffset={90}>
            <View style={styles.header}>
                <View style={styles.headerIcon}><Bot color="#fff" size={24}/></View>
                <View>
                    <Text style={styles.headerTitle}>Angelina AI</Text>
                    <Text style={styles.headerSub}>Always Online</Text>
                </View>
            </View>

            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            {loading && <View style={styles.typing}><ActivityIndicator color="#2563eb" size="small" /></View>}

            <View style={styles.inputArea}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask Angelina anything..."
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={handleSend}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={!input.trim()}>
                    <Send color={input.trim() ? '#2563eb' : '#cbd5e1'} size={24} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    headerIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
    headerSub: { fontSize: 12, color: '#10b981', fontWeight: 'bold' },
    list: { padding: 20, gap: 12 },
    bubbleWrapper: { width: '100%', flexDirection: 'row', marginBottom: 16 },
    userWrapper: { justifyContent: 'flex-end' },
    aiWrapper: { justifyContent: 'flex-start' },
    bubble: { maxWidth: '80%', padding: 16, borderRadius: 20 },
    userBubble: { backgroundColor: '#2563eb', borderBottomRightRadius: 4 },
    aiBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#e2e8f0' },
    userText: { color: '#fff', fontSize: 16, lineHeight: 24 },
    aiText: { color: '#0f172a', fontSize: 16, lineHeight: 24 },
    typing: { padding: 20 },
    inputArea: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9', alignItems: 'center' },
    input: { flex: 1, height: 50, backgroundColor: '#f8fafc', borderRadius: 25, paddingHorizontal: 20, fontSize: 16, marginRight: 12 },
    sendBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' }
});
