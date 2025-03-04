import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

// Define types for word data
interface WordItem {
  id: string;
  word: string;
  translation: string;
  example: string;
}

type CategoryId = "basics" | "travel" | "business" | "food" | "technology";

type WordDataType = {
  [key in CategoryId]: WordItem[];
};

// Sample word data for vocabulary categories
const wordData: WordDataType = {
  basics: [
    {
      id: "1",
      word: "Hello",
      translation: "Привіт",
      example: "Hello, how are you?",
    },
    {
      id: "2",
      word: "Goodbye",
      translation: "До побачення",
      example: "Goodbye, see you tomorrow!",
    },
    {
      id: "3",
      word: "Thank you",
      translation: "Дякую",
      example: "Thank you for your help.",
    },
    {
      id: "4",
      word: "Please",
      translation: "Будь ласка",
      example: "Please, could you help me?",
    },
    {
      id: "5",
      word: "Yes",
      translation: "Так",
      example: "Yes, I agree with you.",
    },
  ],
  travel: [
    {
      id: "1",
      word: "Airport",
      translation: "Аеропорт",
      example: "We arrived at the airport early.",
    },
    {
      id: "2",
      word: "Hotel",
      translation: "Готель",
      example: "The hotel was very comfortable.",
    },
    {
      id: "3",
      word: "Ticket",
      translation: "Квиток",
      example: "I need to buy a train ticket.",
    },
    {
      id: "4",
      word: "Passport",
      translation: "Паспорт",
      example: "Don't forget your passport!",
    },
    {
      id: "5",
      word: "Luggage",
      translation: "Багаж",
      example: "My luggage was lost during the flight.",
    },
  ],
  business: [
    {
      id: "1",
      word: "Meeting",
      translation: "Зустріч",
      example: "We have a meeting at 2 PM.",
    },
    {
      id: "2",
      word: "Contract",
      translation: "Контракт",
      example: "Please sign the contract.",
    },
    {
      id: "3",
      word: "Deadline",
      translation: "Крайній термін",
      example: "The deadline for this project is Friday.",
    },
    {
      id: "4",
      word: "Negotiation",
      translation: "Переговори",
      example: "The negotiation lasted for hours.",
    },
    {
      id: "5",
      word: "Budget",
      translation: "Бюджет",
      example: "We need to stay within budget.",
    },
  ],
  food: [
    {
      id: "1",
      word: "Restaurant",
      translation: "Ресторан",
      example: "Let's go to that new restaurant.",
    },
    {
      id: "2",
      word: "Menu",
      translation: "Меню",
      example: "Can I see the menu, please?",
    },
    {
      id: "3",
      word: "Delicious",
      translation: "Смачний",
      example: "The food was delicious!",
    },
    {
      id: "4",
      word: "Reservation",
      translation: "Бронювання",
      example: "I made a reservation for 8 PM.",
    },
    {
      id: "5",
      word: "Bill",
      translation: "Рахунок",
      example: "Could we have the bill, please?",
    },
  ],
  technology: [
    {
      id: "1",
      word: "Computer",
      translation: "Комп'ютер",
      example: "I need to buy a new computer.",
    },
    {
      id: "2",
      word: "Software",
      translation: "Програмне забезпечення",
      example: "This software is very useful.",
    },
    {
      id: "3",
      word: "Internet",
      translation: "Інтернет",
      example: "The internet connection is slow today.",
    },
    {
      id: "4",
      word: "Password",
      translation: "Пароль",
      example: "Don't share your password with anyone.",
    },
    {
      id: "5",
      word: "Download",
      translation: "Завантажити",
      example: "I need to download this file.",
    },
  ],
};

export default function DetailScreen() {
  const { id, title } = useLocalSearchParams();
  const categoryId = typeof id === "string" ? id : "";
  const isVocabularyCategory = Object.keys(wordData).includes(categoryId);

  const words = isVocabularyCategory ? wordData[categoryId as CategoryId] : [];

  const renderWordItem = ({ item }: { item: WordItem }) => (
    <View style={styles.wordItem}>
      <View style={styles.wordHeader}>
        <Text style={styles.word}>{item.word}</Text>
        <Text style={styles.translation}>{item.translation}</Text>
      </View>
      <Text style={styles.example}>{item.example}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={
          isVocabularyCategory ? ["#A5D6A7", "white"] : ["#D6BEF9", "white"]
        }
        style={styles.fadeBackground}
      />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title || `Category ${id}`}</Text>
        <Text style={styles.subtitle}>Learn these essential words</Text>

        <FlatList
          data={words}
          renderItem={renderWordItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.wordsList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fadeBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    height: 200,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  wordsList: {
    paddingBottom: 20,
  },
  wordItem: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  wordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  word: {
    fontSize: 18,
    fontWeight: "bold",
  },
  translation: {
    fontSize: 18,
    color: "#666",
  },
  example: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
});
