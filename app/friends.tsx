import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { friendshipService, Friendship } from "@/services/friendshipService";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

const BLUE = "#2563EB";

export default function FriendsScreen() {
  const [search, setSearch] = useState("");
  const [friendsList, setFriendsList] = useState<Friendship[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const screenBg = useThemeColor(
    { light: "#F8FAFC", dark: "#0F172A" },
    "background"
  );
  const cardBg = useThemeColor(
    { light: "#F9FAFB", dark: "#111827" },
    "background"
  );
  const inputBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F2937" },
    "background"
  );
  const borderColor = useThemeColor(
    { light: "#E5E7EB", dark: "#374151" },
    "icon"
  );
  const textColor = useThemeColor(
    { light: "#0F172A", dark: "#F9FAFB" },
    "text"
  );
  const mutedTextColor = useThemeColor(
    { light: "#64748B", dark: "#94A3B8" },
    "icon"
  );

  // 1. Fetch Friends and Pending Requests
  const loadFriendData = async () => {
    try {
      setLoading(true);
      const [friendsData, pendingData] = await Promise.all([
        friendshipService.getFriendsList(),
        friendshipService.getPendingRequests(),
      ]);
      setFriendsList(friendsData);
      setPendingRequests(pendingData);
    } catch (error) {
      console.error("Error loading friendship data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriendData();
  }, []);

  // 2. Accept Friend Request
  const handleAcceptRequest = async (friendshipId: number) => {
    try {
      setActionLoadingId(friendshipId);
      await friendshipService.acceptFriendRequest(friendshipId);
      // Refresh list to reflect state changes
      await loadFriendData();
    } catch (error) {
      console.error("Failed to accept request:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  // 3. Navigate to BuddyChatScreen for Messaging
  const handleOpenChat = (friendUser: { name?: string; email: string }) => {
    router.push({
      pathname: "/buddy-chat", // Ensure this matches your screen route path
      params: {
        name: friendUser.name ?? "Buddy",
        email: friendUser.email,
      },
    });
  };

  // Filter friends list based on search term
  const filteredFriends = friendsList.filter((item) => {
    const friendName = item.sender?.fullName || item.receiver?.fullName || "";
    const friendEmail = item.sender?.email || item.receiver?.email || "";
    return (
      friendName.toLowerCase().includes(search.toLowerCase()) ||
      friendEmail.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <ThemedView style={[styles.container, { backgroundColor: screenBg }]}>
      <View style={styles.headerRow}>
        <ThemedText type="title">Friends</ThemedText>

        <Pressable
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <ThemedText style={styles.backButtonText}>← Home</ThemedText>
        </Pressable>
      </View>

      {/* SEARCH USERS */}
      <TextInput
        placeholder="Search friends..."
        placeholderTextColor={mutedTextColor}
        value={search}
        onChangeText={setSearch}
        style={[
          styles.input,
          { backgroundColor: inputBg, borderColor, color: textColor },
        ]}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={BLUE} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* PENDING FRIEND REQUESTS SECTION */}
          {pendingRequests.length > 0 && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Pending Requests ({pendingRequests.length})
              </ThemedText>
              {pendingRequests.map((item) => (
                <View
                  key={item.id}
                  style={[styles.card, { backgroundColor: cardBg, borderColor }]}
                >
                  <View>
                    <ThemedText type="defaultSemiBold">
                      {item.sender.fullName ?? item.sender.email}
                    </ThemedText>
                    <ThemedText style={{ color: mutedTextColor, fontSize: 13 }}>
                      Sent you a friend request
                    </ThemedText>
                  </View>

                  <Pressable
                    style={styles.button}
                    onPress={() => handleAcceptRequest(item.id)}
                    disabled={actionLoadingId === item.id}
                  >
                    {actionLoadingId === item.id ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <ThemedText style={styles.buttonText}>Accept</ThemedText>
                    )}
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {/* ACCEPTED FRIENDS LIST SECTION */}
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Your Friends ({filteredFriends.length})
          </ThemedText>

          <FlatList
            data={filteredFriends}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <ThemedText style={{ color: mutedTextColor, marginTop: 10 }}>
                No friends found.
              </ThemedText>
            }
            renderItem={({ item }) => {
              // Extract the friend's user details (the user who isn't self)
              const friendUser = item.sender ?? item.receiver;
              const displayName =
                friendUser.fullName ?? friendUser.email ?? "Fitness Friend";

              return (
                <View
                  style={[styles.card, { backgroundColor: cardBg, borderColor }]}
                >
                  <View>
                    <ThemedText type="defaultSemiBold">{displayName}</ThemedText>
                    <ThemedText style={{ color: "green", fontSize: 13 }}>
                      Friends ✓
                    </ThemedText>
                  </View>

                  <Pressable
                    style={styles.chatButton}
                    onPress={() =>
                      handleOpenChat({
                        name: displayName,
                        email: friendUser.email,
                      })
                    }
                  >
                    <ThemedText style={styles.buttonText}>Chat</ThemedText>
                  </Pressable>
                </View>
              );
            }}
          />
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  backButtonText: {
    color: BLUE,
    fontWeight: "700",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    marginVertical: 8,
  },
  card: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    backgroundColor: BLUE,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  chatButton: {
    backgroundColor: "#10B981",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});