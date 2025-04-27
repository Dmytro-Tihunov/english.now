import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { Stack, router } from "expo-router";
import { Colors } from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { authClient } from "../lib/auth-client";

// Define types for our onboarding flow
type StepOption = {
  id: string;
  title: string;
  subtitle: string;
  options?: string[];
  multiSelect?: boolean;
};

type UserData = {
  age: string;
  interests: string[];
  level: string;
  goals: string[];
};

// Define the steps in our onboarding flow
const STEPS: StepOption[] = [
  {
    id: "welcome",
    title: "Welcome to English Now",
    subtitle: "Let's personalize your learning experience",
  },
  {
    id: "age",
    title: "What's your age?",
    subtitle: "This helps us tailor content to your needs",
    options: ["Under 18", "18-24", "25-34", "35-44", "45+"],
  },
  {
    id: "interests",
    title: "What are you interested in?",
    subtitle: "Select topics you'd like to learn about",
    options: [
      "Business",
      "Travel",
      "Technology",
      "Science",
      "Arts",
      "Sports",
      "Food",
      "Culture",
    ],
    multiSelect: true,
  },
  {
    id: "level",
    title: "What's your English level?",
    subtitle: "Don't worry, you can always change this later",
    options: [
      "Beginner (A1)",
      "Elementary (A2)",
      "Intermediate (B1)",
      "Upper Intermediate (B2)",
      "Advanced (C1)",
      "Mastery (C2)",
    ],
  },
  {
    id: "goals",
    title: "What are your goals?",
    subtitle: "Select what you want to achieve",
    options: [
      "Improve speaking",
      "Better writing",
      "Pass an exam",
      "Business communication",
      "Travel preparation",
      "Academic studies",
    ],
    multiSelect: true,
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    age: "",
    interests: [],
    level: "",
    goals: [],
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Save user preferences
        await authClient.$fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/v1/user/preferences`,
          {
            method: "POST",
            body: JSON.stringify(userData),
          },
        );

        // Update user's onboarding status
        await authClient.$fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/v1/user/onboarding`,
          {
            method: "POST",
          },
        );

        // Navigate to the main app
        router.replace("/(app)");
      } catch (error) {
        console.error("Error completing onboarding:", error);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOptionSelect = (option: string) => {
    const currentStepData = STEPS[currentStep];

    if (currentStepData.id === "age") {
      setUserData({ ...userData, age: option });
    } else if (currentStepData.id === "interests") {
      const updatedInterests = userData.interests.includes(option)
        ? userData.interests.filter((item) => item !== option)
        : [...userData.interests, option];
      setUserData({ ...userData, interests: updatedInterests });
    } else if (currentStepData.id === "level") {
      setUserData({ ...userData, level: option });
    } else if (currentStepData.id === "goals") {
      const updatedGoals = userData.goals.includes(option)
        ? userData.goals.filter((item) => item !== option)
        : [...userData.goals, option];
      setUserData({ ...userData, goals: updatedGoals });
    }
  };

  const handleSignUp = () => {
    // Here you would implement the actual sign up logic
    console.log("Sign up with:", { email, password, ...userData });
    // Navigate to the main app
    router.replace("/");
  };

  const renderStepContent = () => {
    const step = STEPS[currentStep];

    if (step.id === "welcome") {
      return (
        <View style={styles.welcomeContainer}>
          <Image
            source={require("../assets/images/Logo.svg")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>
            Start your journey to fluency today!
          </Text>
        </View>
      );
    } else if (step.id === "auth") {
      return (
        <View style={styles.authContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={handleNext}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (step.options && step.options.length > 0) {
      return (
        <View style={styles.optionsContainer}>
          {step.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                (step.id === "age" && userData.age === option) ||
                (step.id === "level" && userData.level === option) ||
                (step.id === "interests" &&
                  userData.interests.includes(option)) ||
                (step.id === "goals" && userData.goals.includes(option))
                  ? styles.selectedOption
                  : null,
              ]}
              onPress={() => handleOptionSelect(option)}
            >
              <Text
                style={[
                  styles.optionText,
                  (step.id === "age" && userData.age === option) ||
                  (step.id === "level" && userData.level === option) ||
                  (step.id === "interests" &&
                    userData.interests.includes(option)) ||
                  (step.id === "goals" && userData.goals.includes(option))
                    ? styles.selectedOptionText
                    : null,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return null;
  };

  const canProceed = () => {
    const step = STEPS[currentStep];

    if (step.id === "age" && !userData.age) return false;
    if (step.id === "level" && !userData.level) return false;
    if (step.id === "interests" && userData.interests.length === 0)
      return false;
    if (step.id === "goals" && userData.goals.length === 0) return false;
    if (step.id === "auth" && (!email || !password)) return false;

    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.progressContainer}>
        {STEPS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index <= currentStep ? styles.progressDotActive : null,
            ]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{STEPS[currentStep].title}</Text>
        <Text style={styles.subtitle}>{STEPS[currentStep].subtitle}</Text>

        {renderStepContent()}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed() && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === STEPS.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 20,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 5,
  },
  progressDotActive: {
    backgroundColor: Colors.light.tint,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.icon,
    marginBottom: 30,
    textAlign: "center",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: "center",
    color: Colors.light.text,
    marginTop: 20,
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.light.background_secondary,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedOption: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  optionText: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: "center",
  },
  selectedOptionText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.light.background_secondary,
    minWidth: 100,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  nextButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.light.tint,
    minWidth: 100,
    alignItems: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "#B0B0B0",
  },
  nextButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  authContainer: {
    marginTop: 20,
  },
  input: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.light.background_secondary,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  signUpButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.light.tint,
    alignItems: "center",
    marginBottom: 10,
  },
  signUpButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  skipButton: {
    padding: 15,
    alignItems: "center",
  },
  skipButtonText: {
    fontSize: 16,
    color: Colors.light.tint,
  },
});
