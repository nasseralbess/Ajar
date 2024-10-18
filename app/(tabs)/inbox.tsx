import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  timeStamp: string;
  avatar: string;
  host_id: string;
}

const ChatItem: React.FC<{ item: ChatItem }> = ({ item }) => (
  <Link href={`/chat/${item.id}`} asChild>
    <TouchableOpacity style={styles.chatItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      <Text style={styles.timeStamp}>{item.timeStamp}</Text>
    </TouchableOpacity>
  </Link>
);

const InboxScreen = () => {
  const chats: ChatItem[] = [
    { 
      id: '1', 
      name: 'John Doe', 
      lastMessage: 'Hey, how are you?', 
      timeStamp: '2m ago', 
      avatar: 'https://a0.muscache.com/pictures/miso/Hosting-1391124/original/bf2541b8-74d7-4667-9f09-b031921a9143.png',
      host_id: 'host1'
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      lastMessage: 'See you tomorrow!', 
      timeStamp: '1h ago', 
      avatar: 'https://a0.muscache.com/pictures/airflow/Hosting-1395698/original/bc359ed6-7d77-4b67-8c33-9fe0c541f86d.jpg',

      host_id: 'host2'
    },
    // Add more chat items as needed
  ];

  return (
    <View style={[defaultStyles.container, styles.container]}>
      <Text style={styles.title}>Chats</Text>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id + item.host_id}
        renderItem={({ item }) => <ChatItem item={item} />}
        ItemSeparatorComponent={() => <View style={defaultStyles.divider} />}
      />
      <Link href="/new-chat" asChild>
        <TouchableOpacity style={styles.newChatButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
  },
  title: {
    ...defaultStyles.title,
    marginBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontFamily: 'mon-sb',
    fontSize: 16,
    color: Colors.dark,
    marginBottom: 4,
  },
  lastMessage: {
    fontFamily: 'mon',
    fontSize: 14,
    color: Colors.darkGrey,
  },
  timeStamp: {
    fontFamily: 'mon',
    fontSize: 12,
    color: Colors.darkGrey,
  },
  newChatButton: {
    ...defaultStyles.btn,
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
  },
});

export default InboxScreen;