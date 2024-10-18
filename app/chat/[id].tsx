import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";

interface Message {
  id: string;
  text: string;
  time: string;
  isOwnMessage: boolean;
}

const Message: React.FC<{ message: Message }> = ({ message }) => (
  <View style={[styles.messageContainer, message.isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
    <Text style={[styles.messageText, message.isOwnMessage ? styles.ownMessageText : styles.otherMessageText]}>
      {message.text}
    </Text>
    <Text style={styles.messageTime}>{message.time}</Text>
  </View>
);

const ChatScreen = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hey there!', time: '10:00 AM', isOwnMessage: false },
    { id: '2', text: 'Hi! How are you?', time: '10:02 AM', isOwnMessage: true },
    { id: '3', text: 'Im doing great, thanks for asking!', time: '10:03 AM', isOwnMessage: false },
    // Add more messages as needed
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Fetch chat details and messages based on the id
    // This is where you would typically make an API call
    navigation.setOptions({
      title: `Chat ${id}`, // Replace with actual chat name
    });
  }, [id, navigation]);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwnMessage: true,
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[defaultStyles.container, styles.container]} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Message message={item} />}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={Colors.darkGrey}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 0,
  },
  messageList: {
    paddingHorizontal: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.grey,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'mon',
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: Colors.dark,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.darkGrey,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.grey,
  },
  input: {
    flex: 1,
    ...defaultStyles.inputField,
    height: 40,
    marginRight: 10,
  },
  sendButton: {
    ...defaultStyles.btn,
    width: 40,
    height: 40,
    borderRadius: 20,
    marginVertical: 0,
  },
});

export default ChatScreen;