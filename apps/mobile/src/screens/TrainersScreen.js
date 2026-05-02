import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Star, Video } from 'lucide-react-native';
import api from '../api';

export default function TrainersScreen() {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const { data } = await api.get('/trainers');
                setTrainers(data); // data is already an array of trainers
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrainers();
    }, []);

    const bookSession = async (trainerId, price) => {
        try {
            await api.post('/sessions/book', {
                trainerId: trainerId,
                date: "Today",
                time: "06:00 PM",
                price: price
            });
            alert("Booking Successful! Payment escrow established.");
        } catch (error) {
            alert("Failed to book session");
        }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2563eb" /></View>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Find a Coach</Text>

            <FlatList
                data={trainers}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.infoRow}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{item.user_id.name.charAt(0)}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.name}>{item.user_id.name}</Text>
                                <View style={styles.ratingRow}>
                                    <Star size={14} color="#f59e0b" fill="#f59e0b" />
                                    <Text style={styles.ratingText}>{item.rating} • {item.topics[0]}</Text>
                                </View>
                            </View>
                            <Text style={styles.price}>₹{item.price_per_session}</Text>
                        </View>
                        
                        <View style={styles.btnRow}>
                            <TouchableOpacity style={styles.bookBtn} onPress={() => bookSession(item._id, item.price_per_session)}>
                                <Video size={16} color="#fff" />
                                <Text style={styles.bookText}>Book Class</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 60, paddingHorizontal: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 28, fontWeight: '900', color: '#0f172a', marginBottom: 20 },
    list: { paddingBottom: 40 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    avatar: { width: 48, height: 48, backgroundColor: '#dbeafe', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    avatarText: { fontSize: 20, fontWeight: 'bold', color: '#2563eb' },
    name: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    ratingText: { color: '#64748b', fontSize: 12, fontWeight: 'bold' },
    price: { fontSize: 18, fontWeight: '900', color: '#2563eb' },
    btnRow: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 16 },
    bookBtn: { backgroundColor: '#0f172a', padding: 14, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    bookText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
