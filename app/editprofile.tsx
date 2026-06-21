import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { router } from "expo-router";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function EditProfileScreen() {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");

  const handleSave = () => {
    Alert.alert("Success", "Profile updated!");

    // Later you can save to Zustand/Firebase here

    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">
        Edit Profile
      </ThemedText>

      <ThemedText>Name</ThemedText>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
      />

      <ThemedText>Gym Level</ThemedText>
      <TextInput
        style={styles.input}
        value={level}
        onChangeText={setLevel}
        placeholder="Beginner / Intermediate / Advanced"
      />

      <ThemedText>Goal</ThemedText>
      <TextInput
        style={styles.input}
        value={goal}
        onChangeText={setGoal}
        placeholder="Fitness goal"
      />

      <Button
        title="Save Changes"
        onPress={handleSave}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
});