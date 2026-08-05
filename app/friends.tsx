import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { friendshipService, Friendship } from "@/services/friendshipService";
import { getAllUsers, User as AppUser } from "@/services/userService";
import { useAuthStore } from "@/stores/useAuthStore";

const BLUE = "#2563EB";

type TabType = "friends" | "pending" | "add";

export default function FriendsScreen() {
  const currentUser = useAuthStore((state) => state.user);

  const [activeTab, setActiveTab] = useState<TabType>("friends");
  const [search, setSearch] = useState("");
  const [friendsList, setFriendsList] = useState<Friendship[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friendship[]>([]);
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | string | null>(null);
  const [sentRequestIds, setSentRequestIds] = useState<Set<string | number>>(new Set());

  const screenBg = useThemeColor(
    { light: "#F8FAFC", dark: "#0F172A" },
    "background"
  );
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1E293B" },
    "background"
  );
  const inputBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1E293B" },
    "background"
  );
  const borderColor = useThemeColor(
    { light: "#E2E8F0", dark: "#334155" },
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
  const tabBg = useThemeColor(
    { light: "#E2E8F0", dark: "#334155" },
    "background"
  );
  const activeTabBg = BLUE;

  // 1. Fetch Friends, Pending Requests, and All Users
  const loadFriendData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [friendsData, pendingData, usersData] = await Promise.allSettled([
        friendshipService.getFriendsList(),
        friendshipService.getPendingRequests(),
        getAllUsers(),
      ]);

      if (friendsData.status === "fulfilled") {
        setFriendsList(friendsData.value || []);
      }
      if (pendingData.status === "fulfilled") {
        setPendingRequests(pendingData.value || []);
      }
      if (usersData.status === "fulfilled") {
        setAllUsers(usersData.value || []);
      }
    } catch (error) {
      console.error("Error loading friendship data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFriendData();
  }, [loadFriendData]);

  // 2. Accept Friend Request
  const handleAcceptRequest = async (friendshipId: number) => {
    try {
      setActionLoadingId(friendshipId);
      await friendshipService.acceptFriendRequest(friendshipId);
      Alert.alert("Success", "Friend request accepted!");
      await loadFriendData();
    } catch (error: any) {
      console.error("Failed to accept request:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to accept friend request."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  // 3. Send Friend Request
  const handleSendRequest = async (targetUserId: number | string) => {
    const numericId = Number(targetUserId);
    if (isNaN(numericId)) {
      Alert.alert("Error", "Invalid user ID.");
      return;
    }

    try {
      setActionLoadingId(targetUserId);
      await friendshipService.sendFriendRequest(numericId);
      setSentRequestIds((prev) => new Set(prev).add(targetUserId));
      Alert.alert("Success", "Friend request sent!");
      await loadFriendData();
    } catch (error: any) {
      console.error("Failed to send request:", error);
      Alert.alert(
        "Notice",
        error?.response?.data?.message || "Friend request already sent or error occurred."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  // 4. Helper to extract friend user info (not current user)
  const getFriendUser = (item: Friendship) => {
    const currentEmail = currentUser?.email?.toLowerCase();
    if (item.sender && item.sender.email?.toLowerCase() === currentEmail) {
      return item.receiver;
    }
    return item.sender || item.receiver;
  };

  // 5. Navigate to BuddyChatScreen for Messaging
  const handleOpenChat = (friendUser: { fullName?: string; email: string }) => {
    router.push({
      pathname: "/buddy-chat",
      params: {
        name: friendUser.fullName || friendUser.email.split("@")[0],
        email: friendUser.email,
      },
    });
  };

  // Filter existing friends
  const filteredFriends = friendsList.filter((item) => {
    const friend = getFriendUser(item);
    const friendName = friend?.fullName || "";
    const friendEmail = friend?.email || "";
    const q = search.toLowerCase();
    return (
      friendName.toLowerCase().includes(q) ||
      friendEmail.toLowerCase().includes(q)
    );
  });

  // Existing friend emails and pending emails set for quick lookup
  const friendEmailsSet = new Set(
    friendsList.flatMap((f) => [
      f.sender?.email?.toLowerCase(),
      f.receiver?.email?.toLowerCase(),
    ]).filter(Boolean)
  );

  const pendingEmailsSet = new Set(
    pendingRequests.flatMap((f) => [
      f.sender?.email?.toLowerCase(),
      f.receiver?.email?.toLowerCase(),
    ]).filter(Boolean)
  );

  // Filter available users to add
  const availableUsersToAdd = allUsers.filter((u) => {
    const userEmail = u.email?.toLowerCase();
    const currentEmail = currentUser?.email?.toLowerCase();

    if (!userEmail || userEmail === currentEmail) return false;
    if (friendEmailsSet.has(userEmail)) return false;

    const q = search.toLowerCase();
    const name = u.fullName || u.displayName || "";
    return (
      name.toLowerCase().includes(q) ||
      userEmail.includes(q)
    );
  });

  const renderAvatar = (name?: string, email?: string) => {
    const initial = (name || email || "?").charAt(0).toUpperCase();
    return (
      <View style={styles.avatar}>
        <ThemedText style={styles.avatarText}>{initial}</ThemedText>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenBg }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Ionicons name="arrow-back" size={20} color={BLUE} />
          <ThemedText style={styles.backButtonText}>Home</ThemedText>
        </TouchableOpacity>

        <ThemedText type="title" style={styles.title}>
          Friends & Social
        </ThemedText>

        <TouchableOpacity
          style={styles.refreshIconBtn}
          onPress={() => loadFriendData(true)}
        >
          <Ionicons name="refresh-outline" size={22} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: tabBg }]}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "friends" && { backgroundColor: activeTabBg },
          ]}
          onPress={() => setActiveTab("friends")}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === "friends" && styles.activeTabText,
            ]}
          >
            Friends ({friendsList.length})
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "pending" && { backgroundColor: activeTabBg },
          ]}
          onPress={() => setActiveTab("pending")}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === "pending" && styles.activeTabText,
            ]}
          >
            Requests ({pendingRequests.length})
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "add" && { backgroundColor: activeTabBg },
          ]}
          onPress={() => setActiveTab("add")}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === "add" && styles.activeTabText,
            ]}
          >
            Add Friends
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={mutedTextColor} style={styles.searchIcon} />
        <TextInput
          placeholder={
            activeTab === "friends"
              ? "Search friends..."
              : activeTab === "pending"
              ? "Search requests..."
              : "Search users to add..."
          }
          placeholderTextColor={mutedTextColor}
          value={search}
          onChangeText={setSearch}
          style={[
            styles.input,
            { backgroundColor: inputBg, borderColor, color: textColor },
          ]}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch("")} style={styles.clearSearchBtn}>
            <Ionicons name="close-circle" size={18} color={mutedTextColor} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={BLUE} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* TAB 1: FRIENDS LIST */}
          {activeTab === "friends" && (
            <FlatList
              data={filteredFriends}
              keyExtractor={(item) => item.id.toString()}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => loadFriendData(true)} />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="people-outline" size={48} color={mutedTextColor} />
                  <ThemedText style={[styles.emptyText, { color: mutedTextColor }]}>
                    {search ? "No friends match your search." : "No friends added yet."}
                  </ThemedText>
                  <TouchableOpacity
                    style={[styles.actionBtn, { marginTop: 12 }]}
                    onPress={() => setActiveTab("add")}
                  >
                    <ThemedText style={styles.buttonText}>Find Friends</ThemedText>
                  </TouchableOpacity>
                </View>
              }
              renderItem={({ item }) => {
                const friend = getFriendUser(item);
                const displayName =
                  friend?.fullName || friend?.email?.split("@")[0] || "Fitness Friend";

                return (
                  <View
                    style={[styles.card, { backgroundColor: cardBg, borderColor }]}
                  >
                    <View style={styles.userInfoRow}>
                      {renderAvatar(friend?.fullName, friend?.email)}
                      <View style={styles.userDetails}>
                        <ThemedText type="defaultSemiBold" numberOfLines={1}>
                          {displayName}
                        </ThemedText>
                        <ThemedText style={{ color: mutedTextColor, fontSize: 13 }}>
                          {friend?.email}
                        </ThemedText>
                      </View>
                    </View>

                    <Pressable
                      style={styles.chatButton}
                      onPress={() =>
                        handleOpenChat({
                          fullName: displayName,
                          email: friend?.email || "",
                        })
                      }
                    >
                      <Ionicons name="chatbubble-ellipses-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
                      <ThemedText style={styles.buttonText}>Chat</ThemedText>
                    </Pressable>
                  </View>
                );
              }}
            />
          )}

          {/* TAB 2: PENDING REQUESTS */}
          {activeTab === "pending" && (
            <FlatList
              data={pendingRequests}
              keyExtractor={(item) => item.id.toString()}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => loadFriendData(true)} />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="mail-unread-outline" size={48} color={mutedTextColor} />
                  <ThemedText style={[styles.emptyText, { color: mutedTextColor }]}>
                    No pending friend requests.
                  </ThemedText>
                </View>
              }
              renderItem={({ item }) => (
                <View
                  style={[styles.card, { backgroundColor: cardBg, borderColor }]}
                >
                  <View style={styles.userInfoRow}>
                    {renderAvatar(item.sender?.fullName, item.sender?.email)}
                    <View style={styles.userDetails}>
                      <ThemedText type="defaultSemiBold">
                        {item.sender?.fullName || item.sender?.email}
                      </ThemedText>
                      <ThemedText style={{ color: mutedTextColor, fontSize: 13 }}>
                        Wants to connect with you
                      </ThemedText>
                    </View>
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
              )}
            />
          )}

          {/* TAB 3: ADD FRIENDS */}
          {activeTab === "add" && (
            <FlatList
              data={availableUsersToAdd}
              keyExtractor={(item) => item.id?.toString() || item.email}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => loadFriendData(true)} />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="person-add-outline" size={48} color={mutedTextColor} />
                  <ThemedText style={[styles.emptyText, { color: mutedTextColor }]}>
                    {search ? "No users found matching search." : "No new users to add right now."}
                  </ThemedText>
                </View>
              }
              renderItem={({ item }) => {
                const userId = item.id;
                const isPending = pendingEmailsSet.has(item.email.toLowerCase());
                const isSent = userId ? sentRequestIds.has(userId) : false;
                const isActionLoading = actionLoadingId === userId;

                return (
                  <View
                    style={[styles.card, { backgroundColor: cardBg, borderColor }]}
                  >
                    <View style={styles.userInfoRow}>
                      {renderAvatar(item.fullName || item.displayName, item.email)}
                      <View style={styles.userDetails}>
                        <ThemedText type="defaultSemiBold">
                          {item.fullName || item.displayName || item.email.split("@")[0]}
                        </ThemedText>
                        <ThemedText style={{ color: mutedTextColor, fontSize: 13 }}>
                          {item.email}
                        </ThemedText>
                      </View>
                    </View>

                    {isPending || isSent ? (
                      <View style={styles.pendingBadge}>
                        <ThemedText style={styles.pendingBadgeText}>Pending</ThemedText>
                      </View>
                    ) : (
                      <Pressable
                        style={[styles.button, !userId && { opacity: 0.5 }]}
                        onPress={() => userId && handleSendRequest(userId)}
                        disabled={isActionLoading || !userId}
                      >
                        {isActionLoading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <ThemedText style={styles.buttonText}>+ Add</ThemedText>
                        )}
                      </Pressable>
                    )}
                  </View>
                );
              }}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    gap: 4,
  },
  backButtonText: {
    color: BLUE,
    fontWeight: "700",
    fontSize: 14,
  },
  refreshIconBtn: {
    padding: 6,
  },
  tabBar: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  clearSearchBtn: {
    position: "absolute",
    right: 12,
    zIndex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 10,
    paddingLeft: 38,
    paddingRight: 36,
    borderRadius: 10,
    fontSize: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: BLUE,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  userDetails: {
    flex: 1,
  },
  button: {
    backgroundColor: BLUE,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
  },
  actionBtn: {
    backgroundColor: BLUE,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  chatButton: {
    backgroundColor: "#10B981",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  pendingBadge: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  pendingBadgeText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 15,
    textAlign: "center",
  },
});