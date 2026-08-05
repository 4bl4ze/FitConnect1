import API from "./client";

export type VideoResult = {
  id: number | string;
  youtubeId?: string;
  title: string;
  channel?: string;
  thumbnailUrl?: string;
  category?: string;
  difficultyLevel?: string;
  durationMinutes?: number;
  videoUrl?: string;
  views?: string;
  description?: string;
  tags?: string[];
};

export const MOCK_RECOMMENDED_VIDEOS: VideoResult[] = [
  // WORKOUTS
  {
    id: "v1",
    youtubeId: "cbKybXVi9jY",
    title: "15-Min High Intensity Fat Burner",
    channel: "FitConnect Studio",
    category: "workouts",
    difficultyLevel: "Intermediate",
    durationMinutes: 15,
    views: "124K views",
    thumbnailUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=cbKybXVi9jY",
    description: "No-equipment high-intensity workout to boost endurance and burn calories rapidly.",
    tags: ["hiit", "fat burn", "cardio", "full body"],
  },
  {
    id: "v2",
    youtubeId: "gC_L9qAHVJ8",
    title: "Upper Body Hypertrophy Masterclass",
    channel: "Coach Marcus",
    category: "workouts",
    difficultyLevel: "Advanced",
    durationMinutes: 25,
    views: "89K views",
    thumbnailUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=gC_L9qAHVJ8",
    description: "Focus on chest, back, and arm progressive overload for muscle growth.",
    tags: ["strength", "hypertrophy", "upper body", "dumbbell"],
  },
  {
    id: "v5",
    youtubeId: "ml6cT4AZdqI",
    title: "Core Power & Abs Sculpting Circuit",
    channel: "Core Master",
    category: "workouts",
    difficultyLevel: "Intermediate",
    durationMinutes: 12,
    views: "175K views",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=ml6cT4AZdqI",
    description: "Target your obliques and deep core muscles for maximum stability.",
    tags: ["abs", "core", "circuit"],
  },
  {
    id: "v7",
    youtubeId: "r31T9s-q7Jk",
    title: "Full Body Dumbbell Strength & Conditioning",
    channel: "Iron Fitness",
    category: "workouts",
    difficultyLevel: "Intermediate",
    durationMinutes: 30,
    views: "95K views",
    thumbnailUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=r31T9s-q7Jk",
    description: "Build functional strength and endurance using basic dumbbells.",
    tags: ["strength", "dumbbell", "full body"],
  },

  // NUTRITION
  {
    id: "v3",
    youtubeId: "Vf0wS21B590",
    title: "Optimal Meal Prep & Macros for Athletes",
    channel: "Nutrition Daily",
    category: "nutrition",
    difficultyLevel: "Beginner",
    durationMinutes: 18,
    views: "210K views",
    thumbnailUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=Vf0wS21B590",
    description: "Easy step-by-step guide to preparing high-protein weekly lunches & dinners.",
    tags: ["meal prep", "protein", "macros", "diet"],
  },
  {
    id: "v6",
    youtubeId: "2pLT-olgUJs",
    title: "Post-Workout Recovery & Hydration Guide",
    channel: "Sports Science Lab",
    category: "nutrition",
    difficultyLevel: "Beginner",
    durationMinutes: 14,
    views: "64K views",
    thumbnailUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=2pLT-olgUJs",
    description: "Science-backed recovery strategies: hydration, protein synthesis, and rest.",
    tags: ["recovery", "hydration", "post workout"],
  },
  {
    id: "v8",
    youtubeId: "5qap5aO4i9A",
    title: "High Protein Meal Ideas for Muscle Building",
    channel: "Fit Eats",
    category: "nutrition",
    difficultyLevel: "All Levels",
    durationMinutes: 16,
    views: "142K views",
    thumbnailUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=5qap5aO4i9A",
    description: "Delicious, easy-to-cook recipes packed with 40g+ protein per serving.",
    tags: ["high protein", "recipes", "muscle building"],
  },

  // WARMUP
  {
    id: "v4",
    youtubeId: "inpok4MKVLM",
    title: "10-Min Dynamic Warmup & Joint Mobility",
    channel: "Flexibility & Form",
    category: "warmup",
    difficultyLevel: "All Levels",
    durationMinutes: 10,
    views: "45K views",
    thumbnailUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=inpok4MKVLM",
    description: "Essential pre-workout mobility drills to protect joints and activate core.",
    tags: ["warmup", "mobility", "flexibility"],
  },
  {
    id: "v9",
    youtubeId: "L_xrDAtykMI",
    title: "Full Body Foam Rolling & Recovery Warmup",
    channel: "Flexibility & Form",
    category: "warmup",
    difficultyLevel: "Beginner",
    durationMinutes: 12,
    views: "38K views",
    thumbnailUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=L_xrDAtykMI",
    description: "Release muscle tightness and improve blood flow before intense training.",
    tags: ["foam rolling", "warmup", "recovery"],
  },
];

export async function getRecommendations(focus: string = "all"): Promise<VideoResult[]> {
  try {
    const res = await API.get<VideoResult[]>("/v1/videos/recommendations", {
      params: { focus },
    });
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (error) {
    console.warn("Backend video endpoint note:", (error as any)?.message);
  }

  // Strict local category/topic filtering fallback
  const cleanFocus = focus.trim().toLowerCase();
  if (!cleanFocus || cleanFocus === "all") {
    return MOCK_RECOMMENDED_VIDEOS;
  }

  const filtered = MOCK_RECOMMENDED_VIDEOS.filter((v) => {
    const categoryMatch = v.category?.toLowerCase() === cleanFocus;
    const titleMatch = v.title.toLowerCase().includes(cleanFocus);
    const descMatch = v.description?.toLowerCase().includes(cleanFocus);
    const tagMatch = v.tags?.some((t) => t.toLowerCase().includes(cleanFocus));

    return categoryMatch || titleMatch || descMatch || tagMatch;
  });

  return filtered;
}

export async function searchVideos(query: string, category?: string): Promise<VideoResult[]> {
  try {
    const res = await API.get<VideoResult[]>("/v1/videos/search", {
      params: { query, category },
    });
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (error) {
    console.warn("Backend video search note:", (error as any)?.message);
  }

  const q = query.trim().toLowerCase();
  const cat = category?.trim().toLowerCase();

  return MOCK_RECOMMENDED_VIDEOS.filter((v) => {
    const matchesCategory =
      !cat || cat === "all" || cat === "buddies" || cat === "gyms" || v.category?.toLowerCase() === cat;

    const matchesQuery =
      !q ||
      v.title.toLowerCase().includes(q) ||
      v.channel?.toLowerCase().includes(q) ||
      v.description?.toLowerCase().includes(q) ||
      v.category?.toLowerCase().includes(q) ||
      v.tags?.some((t) => t.toLowerCase().includes(q));

    return matchesCategory && matchesQuery;
  });
}
