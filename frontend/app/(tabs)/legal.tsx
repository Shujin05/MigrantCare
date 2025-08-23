import React, { useState, useCallback, useEffect } from "react";
import {
  GiftedChat,
  IMessage,
  Bubble,
  InputToolbar,
} from "react-native-gifted-chat";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Send } from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Legal() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const router = useRouter()

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hi there! I'm your helpful legal chatbot, here to answer any legal-related queries you may have :)",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot", 
        },
      },
    ]);
  }, []);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
  setMessages((previousMessages) =>
    GiftedChat.append(previousMessages, newMessages)
  );

  const messageText = newMessages[0].text;

  try {
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: messageText }),
    });

    const data = await res.json();
    console.log(data)

    // Append chatbot response
    if (data.response) {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [
          {
            _id: Math.random().toString(),
            text: data.response,
            createdAt: new Date(),
            user: { _id: 2, name: "Chatbot" },
          }
        ])
      );
    }
  } catch (err) {
    console.error("Error sending message:", err);
  }
}, []);

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push("/")}>
            <Ionicons name="home" size={28} color={Colors.light.text} />
            </TouchableOpacity>

        <ThemedText type="title" style={styles.headerTitle}>Legal Chatbot</ThemedText>
        <View style={{ width: 28 }} /> 
      </View>

      <GiftedChat
        messages={messages}
        onSend={(msgs) => onSend(msgs)}
        user={{ _id: 1 }}
        renderDay={() => null}
        renderTime={() => null}
        renderAvatar={() => null}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: Colors.light.tabIconDefault, 
                padding: 6,
              },
              right: {
                backgroundColor: "#e0e0e0",
                padding: 6,
              },
            }}
            textStyle={{
              left: { color: "#fff" },
              right: { color: Colors.light.text },
            }}
          />
        )}
         renderInputToolbar={(props) => (
        <InputToolbar
        {...props}
        containerStyle={{
            borderTopWidth: 0,
            backgroundColor: "#e0e0e0",
            marginTop: 8, 
        }}
        textInputStyle={{
            color: Colors.light.text,
            fontSize: 16,
        }}
        />
        )}
        renderSend={(props) => (
        <Send {...props} containerStyle={{ justifyContent: "center", marginRight: 5 }}>
        <Ionicons name="send" size={28} color={Colors.light.text} />
        </Send>
    )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, 
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.tabIconDefault,
  },
});
