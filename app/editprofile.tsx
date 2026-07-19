import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/useAuthStore";

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState(user?.displayName ?? "");
  const [goal, setGoal] = useState(user?.goal ?? "");
  const [level, setLevel] = useState(user?.level ?? "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL ?? "");
  const [loading, setLoading] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const inputBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F1F1F" },
    "background",
  );
  const inputBorderColor = useThemeColor(
    { light: "#D1D5DB", dark: "#4B5563" },
    "icon",
  );
  const inputPlaceholderColor = useThemeColor(
    { light: "#6B7280", dark: "#D1D5DB" },
    "icon",
  );
  const buttonBg = useThemeColor({ light: "#2563EB", dark: "#3B82F6" }, "tint");
  const cardBg = useThemeColor(
    { light: "#F3F4F6", dark: "#2C2C2C" },
    "background",
  );

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    setPhotoURL(asset.uri);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a name.");
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        displayName: name.trim(),
        goal: goal.trim(),
        level: level.trim(),
        photoURL,
      });

      Alert.alert("Success", "Profile updated!");
      router.replace("/(tabs)/profile");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  const defaultProfileImage =
    "https://via.placeholder.com/140?text=" + (name ?? "User");

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title">Edit Profile</ThemedText>

        {/* Profile Picture Section */}
        <ThemedView
          style={[styles.pictureSection, { backgroundColor: cardBg }]}
        >
          <Image
            source={{
              uri: photoURL || defaultProfileImage,
            }}
            style={styles.profileImage}
          />

          <TouchableOpacity
            style={[styles.uploadButton, { backgroundColor: buttonBg }]}
            onPress={pickImage}
          >
            <ThemedText style={styles.uploadButtonText}>
              📷 Change Photo
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Name Input */}
        <View style={styles.inputGroup}>
          <ThemedText type="defaultSemiBold">Full Name</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                color: textColor,
                borderColor: inputBorderColor,
              },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor={inputPlaceholderColor}
            editable={!loading}
            returnKeyType="next"
            autoCapitalize="words"
            autoCorrect={false}
            selectionColor={buttonBg}
          />
        </View>

        {/* Gym Level Input */}
        <View style={styles.inputGroup}>
          <ThemedText type="defaultSemiBold">Gym Level</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                color: textColor,
                borderColor: inputBorderColor,
              },
            ]}
            value={level}
            onChangeText={setLevel}
            placeholder="e.g. Beginner, Intermediate, Advanced"
            placeholderTextColor={inputPlaceholderColor}
            editable={!loading}
            returnKeyType="next"
            autoCapitalize="words"
            autoCorrect={false}
            selectionColor={buttonBg}
          />
        </View>

        {/* Fitness Goal Input */}
        <View style={styles.inputGroup}>
          <ThemedText type="defaultSemiBold">Fitness Goal</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                color: textColor,
                borderColor: inputBorderColor,
              },
            ]}
            value={goal}
            onChangeText={setGoal}
            placeholder="e.g. Strength, Endurance, Flexibility"
            placeholderTextColor={inputPlaceholderColor}
            editable={!loading}
            returnKeyType="done"
            autoCapitalize="words"
            autoCorrect={false}
            selectionColor={buttonBg}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: buttonBg, opacity: loading ? 0.6 : 1 },
          ]}
          onPress={handleSave}
          disabled={loading}
        >
          <ThemedText style={styles.saveButtonText}>
            {loading ? "Saving..." : "Save Changes"}
          </ThemedText>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={[
            styles.cancelButton,
            { borderColor: inputBorderColor, backgroundColor: inputBg },
          ]}
          onPress={() => router.replace("/(tabs)/profile")}
          disabled={loading}
        >
          <ThemedText style={[styles.cancelButtonText, { color: textColor }]}>
            Cancel
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  pictureSection: {
    alignItems: "center",
    gap: 16,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    resizeMode: "cover",
    borderWidth: 3,
    borderColor: "rgba(0,0,0,0.1)",
  },
  uploadButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  inputGroup: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    minHeight: 48,
  },
  saveButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  cancelButtonText: {
    fontWeight: "600",
    fontSize: 16,
  },
});
