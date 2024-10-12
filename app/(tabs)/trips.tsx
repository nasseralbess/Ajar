import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from "@/constants/Colors";

interface Trip {
  id: string;
  destination: string;
  image: string;
  date: string;
  duration: string;
}

const { width } = Dimensions.get('window');

const PreviousTripsPage: React.FC = () => {
  const trips: Trip[] = [
    {
      id: '1',
      destination: 'Paris, France',
      image: 'https://a0.muscache.com/pictures/airflow/Hosting-1395698/original/bc359ed6-7d77-4b67-8c33-9fe0c541f86d.jpg',
      date: 'July 15, 2023',
      duration: '5 days',
    },
    {
      id: '2',
      destination: 'Tokyo, Japan',
      image: 'https://a0.muscache.com/pictures/miso/Hosting-1391124/original/bf2541b8-74d7-4667-9f09-b031921a9143.png',
      date: 'August 10, 2023',
      duration: '7 days',
    },
    {
      id: '3',
      destination: 'New York, USA',
      image: 'https://a0.muscache.com/pictures/airflow/Hosting-1395698/original/bc359ed6-7d77-4b67-8c33-9fe0c541f86d.jpg',
      date: 'September 5, 2023',
      duration: '4 days',
    },
    {
      id: '4',
      destination: 'Sydney, Australia',
      image: 'https://example.com/sydney.jpg',
      date: 'October 12, 2023',
      duration: '10 days',
    }
  ];

  const handleBookAgain = (destination: string) => {
    // Implement the booking logic here
    console.log(`Booking again for ${destination}`);
  };

  const renderTrip = ({ item }: { item: Trip }) => (
    <View style={styles.tripContainer}>
      <Image source={{ uri: item.image }} style={styles.tripImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.tripDetails}>
          <Text style={styles.tripDestination}>{item.destination}</Text>
          <Text style={styles.tripDate}>{item.date}</Text>
          <Text style={styles.tripDuration}>{item.duration}</Text>
        </View>
      </LinearGradient>
      <TouchableOpacity 
        style={styles.bookAgainButton}
        onPress={() => handleBookAgain(item.destination)}
      >
        <Text style={styles.bookAgainText}>Book Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Travel Memories</Text>
      <FlatList
        data={trips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  listContainer: {
    paddingBottom: 16,
  },
  tripContainer: {
    width: width - 32,
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tripImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
  },
  tripDetails: {
    padding: 16,
  },
  tripDestination: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  tripDate: {
    fontSize: 16,
    color: '#f0f0f0',
    marginBottom: 2,
  },
  tripDuration: {
    fontSize: 14,
    color: '#ddd',
  },
  bookAgainButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookAgainText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PreviousTripsPage;