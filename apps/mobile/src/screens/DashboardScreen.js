import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Award, Activity, Calendar } from 'lucide-react-native';
import api from '../api';

export default function DashboardScreen() {
    const { user, logout } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const { data } = await api.get(`/users/me?userId=${user._id || user.id}`);
            setStats(data.stats);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2563eb" /></View>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.name}>{user?.name?.split(' ')[0]}</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <LogOut color="#ef4444" size={20} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Award color="#2563eb" size={20} />
                        <Text style={styles.cardTitle}>Angelina Confidence</Text>
                    </View>
                    <Text style={styles.score}>{stats?.progress_score || 0}<Text style={{fontSize:18, color:'#94a3b8'}}>/100</Text></Text>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${stats?.progress_score || 10}%` }]} />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.card, { flex: 1, marginRight: 8 }]}>
                        <Activity color="#10b981" size={24} />
                        <Text style={styles.statLabel}>Sessions</Text>
                        <Text style={styles.statValue}>{stats?.completed_sessions || 0}</Text>
                    </View>
                    <View style={[styles.card, { flex: 1, marginLeft: 8 }]}>
                        <Calendar color="#f59e0b" size={24} />
                        <Text style={styles.statLabel}>Day Streak</Text>
                        <Text style={styles.statValue}>{stats?.streak || 0}</Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 60 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 20 },
    greeting: { fontSize: 16, color: '#64748b' },
    name: { fontSize: 28, fontWeight: '900', color: '#0f172a' },
    logoutBtn: { backgroundColor: '#fee2e2', padding: 12, borderRadius: 12 },
    scroll: { paddingHorizontal: 24, paddingBottom: 40 },
    card: { backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    cardTitle: { fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', fontSize: 12 },
    score: { fontSize: 40, fontWeight: '900', color: '#0f172a', marginBottom: 16 },
    progressBarBg: { height: 8, backgroundColor: '#f1f5f9', borderRadius: 4 },
    progressBarFill: { height: '100%', backgroundColor: '#2563eb', borderRadius: 4 },
    row: { flexDirection: 'row' },
    statLabel: { color: '#64748b', fontWeight: 'bold', marginTop: 12, fontSize: 12, textTransform: 'uppercase' },
    statValue: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginTop: 4 }
});
