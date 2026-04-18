import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getFontStyle } from "../../config/typography";
import { useAppLanguage } from "../../context/AppLanguageContext";
import { sendAiSupportMessage } from "../../services/aiSupport";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
};

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function TypingIndicator() {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDotCount((value) => (value === 3 ? 1 : value + 1));
    }, 380);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.typingDotsRow}>
      {[0, 1, 2].map((index) => (
        <View
          key={index}
          style={[
            styles.typingDot,
            index < dotCount && styles.typingDotActive,
          ]}
        />
      ))}
    </View>
  );
}

export default function SupportTabScreen() {
  const { language } = useAppLanguage();
  const regularText = getFontStyle(language, "regular");
  const mediumText = getFontStyle(language, "medium");
  const boldText = getFontStyle(language, "bold");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<ScrollView | null>(null);

  const canSend = useMemo(
    () => draft.trim().length > 0 && !sending,
    [draft, sending]
  );

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 60);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const sendMessage = async () => {
    const nextMessage = draft.trim();

    if (!nextMessage || sending) {
      return;
    }

    const now = new Date();
    const userMessage: ChatMessage = {
      id: `user-${now.getTime()}`,
      role: "user",
      text: nextMessage,
      timestamp: formatTime(now),
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setDraft("");
    setSending(true);

    try {
      const replyText = await sendAiSupportMessage(nextMessage, language);
      const assistantReply: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: replyText,
        timestamp: formatTime(new Date()),
      };

      setMessages((currentMessages) => [...currentMessages, assistantReply]);
    } catch (error) {
      const assistantReply: ChatMessage = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        text:
          error instanceof Error
            ? error.message
            : "AI support is unavailable right now. Please try again.",
        timestamp: formatTime(new Date()),
      };

      setMessages((currentMessages) => [...currentMessages, assistantReply]);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <View style={styles.header}>
          <Text style={[styles.title, boldText]}>AI Support</Text>
          <Text style={[styles.subtitle, regularText]}>Powered by Groq</Text>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyStateCard}>
              <Text style={[styles.emptyStateTitle, boldText]}>
                Ask me anything about your USCIS case
              </Text>
              <Text style={[styles.emptyStateText, regularText]}>
                I can explain case status updates, saved-case tracking, and general
                immigration process questions. I am an AI, not a lawyer.
              </Text>
            </View>
          ) : null}

          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <View
                key={message.id}
                style={[
                  styles.messageRow,
                  isUser ? styles.userRow : styles.assistantRow,
                ]}
              >
                {!isUser ? (
                  <View style={styles.assistantAvatar}>
                    <Ionicons name="sparkles" size={16} color="#8fc0ff" />
                  </View>
                ) : null}

                <View
                  style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.assistantBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      regularText,
                      isUser ? styles.userMessageText : styles.assistantMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                  <Text
                    style={[
                      styles.timestamp,
                      mediumText,
                      isUser ? styles.userTimestamp : styles.assistantTimestamp,
                    ]}
                  >
                    {message.timestamp}
                  </Text>
                </View>
              </View>
            );
          })}

          {sending ? (
            <View style={styles.assistantRow}>
              <View style={styles.assistantAvatar}>
                <Ionicons name="sparkles" size={16} color="#8fc0ff" />
              </View>
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <TypingIndicator />
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Ask about USCIS cases or app help..."
            placeholderTextColor="#6f829f"
            style={[styles.input, regularText]}
            multiline
          />

          <TouchableOpacity
            style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!canSend}
          >
            <Ionicons name="send" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07111f",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1b304f",
    backgroundColor: "#07111f",
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
  },
  subtitle: {
    color: "#8ba0bf",
    fontSize: 14,
    marginTop: 6,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    paddingBottom: 28,
    gap: 14,
    flexGrow: 1,
  },
  emptyStateCard: {
    backgroundColor: "#0f1b2d",
    borderWidth: 1,
    borderColor: "#1b304f",
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
  },
  emptyStateTitle: {
    color: "#ffffff",
    fontSize: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    color: "#8ba0bf",
    fontSize: 14,
    lineHeight: 22,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  assistantRow: {
    justifyContent: "flex-start",
  },
  userRow: {
    justifyContent: "flex-end",
  },
  assistantAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#0f1b2d",
    borderWidth: 1,
    borderColor: "#1b304f",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  assistantBubble: {
    backgroundColor: "#0f1b2d",
    borderWidth: 1,
    borderColor: "#1b304f",
    borderBottomLeftRadius: 6,
  },
  userBubble: {
    backgroundColor: "#2563eb",
    borderBottomRightRadius: 6,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
  },
  assistantMessageText: {
    color: "#e2e8f0",
  },
  userMessageText: {
    color: "#ffffff",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 8,
  },
  assistantTimestamp: {
    color: "#7d8ca7",
  },
  userTimestamp: {
    color: "#dbeafe",
    textAlign: "right",
  },
  typingDotsRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    minHeight: 20,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#4d6282",
    opacity: 0.5,
  },
  typingDotActive: {
    backgroundColor: "#8fc0ff",
    opacity: 1,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#1b304f",
    backgroundColor: "#07111f",
    gap: 12,
  },
  input: {
    flex: 1,
    minHeight: 52,
    maxHeight: 120,
    backgroundColor: "#0f1b2d",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1b304f",
    color: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
  },
  sendButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#5f9bff",
  },
  sendButtonDisabled: {
    opacity: 0.55,
  },
});
