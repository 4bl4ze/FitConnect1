import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "./client"; // Your Axios instance

// Matches your Spring Boot ChatMessage model
export interface ChatMessage {
  id?: string;
  senderEmail?: string;
  receiverEmail: string;
  content: string;
  timestamp?: string | Date;
}

type MessageCallback = (message: ChatMessage) => void;

class ChatService {
  private stompClient: Client | null = null;
  private subscription: StompSubscription | null = null;
  private isConnected: boolean = false;
  private isConnecting: boolean = false;

  // ==========================================
  // 1. REST Endpoints (Using client.ts)
  // ==========================================

  /**
   * Fetches chat history with another user using ChatHistoryController.
   * Route: GET /api/chat/history/{otherUserEmail}
   */
  async getChatHistory(otherUserEmail: string): Promise<ChatMessage[]> {
    const response = await client.get<ChatMessage[]>(`/api/chat/history/${otherUserEmail}`);
    return response.data;
  }

  // ==========================================
  // 2. STOMP Real-Time Connections
  // ==========================================

  /**
   * Connects to Spring Boot STOMP WebSocket.
   */
  async connect(
    onMessageReceived: MessageCallback,
    onError?: (error: any) => void
  ): Promise<void> {
    if (this.isConnected || this.isConnecting) return;

    this.isConnecting = true;

    const baseURL = client.defaults.baseURL || "http://10.0.2.2:8080";
    const socketUrl = `${baseURL.replace(/\/$/, "")}/ws`;

    // Retrieve JWT token (matches storage key used by client.ts)
    const token = await AsyncStorage.getItem("token");

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),

      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : "",
      },

      debug: (str) => {
        if (__DEV__) {
          console.log("[STOMP Debug]:", str);
        }
      },

      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        this.isConnected = true;
        this.isConnecting = false;
        console.log("Connected to STOMP WebSocket");

        if (this.subscription) {
          this.subscription.unsubscribe();
        }

        // Subscribe to current user's private queue (/user/queue/messages)
        this.subscription =
          this.stompClient?.subscribe("/user/queue/messages", (message: IMessage) => {
            if (message.body) {
              const parsedMessage: ChatMessage = JSON.parse(message.body);
              onMessageReceived(parsedMessage);
            }
          }) || null;
      },

      onStompError: (frame) => {
        this.isConnecting = false;
        console.error("STOMP Frame Error:", frame.headers["message"]);
        if (onError) onError(frame);
      },

      onWebSocketClose: () => {
        this.isConnected = false;
        this.isConnecting = false;
        console.log("STOMP WebSocket Disconnected");
      },
    });

    this.stompClient.activate();
  }

  /**
   * Publishes live message to Spring @MessageMapping("/chat") endpoint.
   */
  sendMessage(receiverEmail: string, content: string): boolean {
    if (!this.stompClient || !this.isConnected) {
      console.warn("Cannot send message: WebSocket is not connected.");
      return false;
    }

    const payload: ChatMessage = {
      receiverEmail,
      content,
    };

    this.stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify(payload),
    });

    return true;
  }

  /**
   * Disconnects from WebSocket.
   */
  disconnect(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }

    this.isConnected = false;
    this.isConnecting = false;
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }
}

export const chatService = new ChatService();