import {
  StyleSheet,
  View,
  Animated,
  ActivityIndicator,
  Text,
} from "react-native";
import { useRef } from "react";
import { GrammarHeader } from "@/components/grammar/GrammarHeader";
import GrammarEl from "@/components/grammar/GrammarEl";
import { useGrammarData } from "@/hooks/useGrammarData";

export default function GrammarScreen() {
  const { grammar, isLoading, error } = useGrammarData();
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={{ flex: 1 }}>
      <GrammarHeader />
      <View style={styles.container}>
        <Animated.ScrollView
          style={styles.scrollView}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
        >
          <View style={styles.content}>
            {isLoading && (
              <View style={styles.centerContent}>
                <ActivityIndicator color="#111111" />
              </View>
            )}
            {error && (
              <View style={styles.centerContent}>
                <Text>Error loading grammar rules</Text>
              </View>
            )}
            {!isLoading && !error && (
              <View>
                {grammar?.grammar.map((rule) => (
                  <GrammarEl
                    key={rule.id}
                    title={rule.title}
                    slug={rule.slug}
                    description={rule.description}
                  />
                ))}
              </View>
            )}
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "white",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  scrollView: {
    flex: 1,
    paddingTop: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
});
