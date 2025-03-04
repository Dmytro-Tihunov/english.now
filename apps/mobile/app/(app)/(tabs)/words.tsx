import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data - replace with your actual data source
const initialVocabulary = [
  {
    id: "1",
    word: "ubiquitous",
    definition: "present, appearing, or found everywhere",
  },
  { id: "2", word: "ephemeral", definition: "lasting for a very short time" },
  {
    id: "3",
    word: "serendipity",
    definition:
      "the occurrence of events by chance in a happy or beneficial way",
  },
  {
    id: "4",
    word: "eloquent",
    definition: "fluent or persuasive in speaking or writing",
  },
  {
    id: "5",
    word: "resilient",
    definition:
      "able to withstand or recover quickly from difficult conditions",
  },
];

export default function WordsScreen() {
  const [vocabulary, setVocabulary] = useState(initialVocabulary);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDefinition, setShowDefinition] = useState<Record<string, boolean>>(
    {},
  );

  // Filter words based on search query
  const filteredWords = vocabulary.filter(
    (item) =>
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Toggle definition visibility
  const toggleDefinition = (id: string) => {
    setShowDefinition((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Vocabulary Study</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search words or definitions..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredWords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.wordCard}
            onPress={() => toggleDefinition(item.id)}
          >
            <Text style={styles.wordText}>{item.word}</Text>
            {showDefinition[item.id] && (
              <Text style={styles.definitionText}>{item.definition}</Text>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  searchInput: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  wordCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  wordText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  definitionText: {
    fontSize: 16,
    marginTop: 8,
    color: "#555",
  },
});
