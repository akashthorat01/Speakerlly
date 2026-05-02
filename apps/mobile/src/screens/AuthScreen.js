import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function AuthScreen() {
    const { login, register } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email || !password) return alert("Fill required fields");
        setLoading(true);
        if (isLogin) {
            await login(email, password);
        } else {
            await register(name, email, password, role);
        }
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Text style={styles.title}>Speakerlly</Text>
                    <Text style={styles.subtitle}>{isLogin ? 'Mobile Sign In' : 'Create an Account'}</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity style={[styles.toggleBtn, isLogin && styles.toggleActive]} onPress={() => setIsLogin(true)}>
                            <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.toggleBtn, !isLogin && styles.toggleActive]} onPress={() => setIsLogin(false)}>
                            <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    {!isLogin && (
                        <>
                            <View style={styles.roleContainer}>
                                <TouchableOpacity style={[styles.roleBtn, role === 'user' && styles.roleActive]} onPress={() => setRole('user')}><Text style={role === 'user' ? styles.roleTextActive : styles.roleText}>Student</Text></TouchableOpacity>
                                <TouchableOpacity style={[styles.roleBtn, role === 'trainer' && styles.roleActive]} onPress={() => setRole('trainer')}><Text style={role === 'trainer' ? styles.roleTextActive : styles.roleText}>Trainer</Text></TouchableOpacity>
                            </View>
                            <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
                        </>
                    )}

                    <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

                    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>{isLogin ? 'Continute into App' : 'Get Started'}</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    header: { alignItems: 'center', marginBottom: 32 },
    title: { fontSize: 36, fontWeight: '900', color: '#0f172a', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#64748b', fontWeight: '500' },
    card: { backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, elevation: 5 },
    toggleContainer: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 24 },
    toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
    toggleActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
    toggleText: { color: '#64748b', fontWeight: 'bold' },
    toggleTextActive: { color: '#2563eb', fontWeight: 'bold' },
    roleContainer: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    roleBtn: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, alignItems: 'center' },
    roleActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
    roleText: { color: '#64748b', fontWeight: 'bold' },
    roleTextActive: { color: '#2563eb', fontWeight: 'bold' },
    input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 16, color: '#0f172a' },
    submitBtn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
    submitText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
