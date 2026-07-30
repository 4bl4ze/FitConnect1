import client from "./client"; // Your Axios instance

// Matches your Spring Boot User model structure (minimal fields)
export interface User {
  id: number;
  email: string;
  fullName?: string;
  profilePictureUrl?: string;
}

// Matches your Spring Boot Friendship model
export interface Friendship {
  id: number;
  sender: User;
  receiver: User;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt?: string;
}

class FriendshipService {
  /**
   * Send a friend request to a user by their user ID.
   * Route: POST /api/friends/request/{receiverId}
   */
  async sendFriendRequest(receiverId: number): Promise<Friendship> {
    const response = await client.post<Friendship>(
      `/api/friends/request/${receiverId}`
    );
    return response.data;
  }

  /**
   * Accept an incoming friend request by friendship ID.
   * Route: PUT /api/friends/accept/{friendshipId}
   */
  async acceptFriendRequest(friendshipId: number): Promise<Friendship> {
    const response = await client.put<Friendship>(
      `/api/friends/accept/${friendshipId}`
    );
    return response.data;
  }

  /**
   * Fetch all pending friend requests for the authenticated user.
   * Route: GET /api/friends/requests/pending
   */
  async getPendingRequests(): Promise<Friendship[]> {
    const response = await client.get<Friendship[]>(
      "/api/friends/requests/pending"
    );
    return response.data;
  }

  /**
   * Fetch the list of accepted friends for the authenticated user.
   * Route: GET /api/friends/list
   */
  async getFriendsList(): Promise<Friendship[]> {
    const response = await client.get<Friendship[]>("/api/friends/list");
    return response.data;
  }
}

export const friendshipService = new FriendshipService();