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
};

export const MOCK_RECOMMENDED_VIDEOS: VideoResult[] = [
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
  },
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
  },
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

  // Smart local filtering fallback
  const cleanFocus = focus.trim().toLowerCase();
  if (!cleanFocus || cleanFocus === "all") {
    return MOCK_RECOMMENDED_VIDEOS;
  }

  const filtered = MOCK_RECOMMENDED_VIDEOS.filter((v) => {
    return (
      v.category?.toLowerCase().includes(cleanFocus) ||
      v.title.toLowerCase().includes(cleanFocus) ||
      v.description?.toLowerCase().includes(cleanFocus) ||
      v.difficultyLevel?.toLowerCase().includes(cleanFocus)
    );
  });

  return filtered.length > 0 ? filtered : MOCK_RECOMMENDED_VIDEOS;
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
  return MOCK_RECOMMENDED_VIDEOS.filter((v) => {
    const matchesQuery =
      !q ||
      v.title.toLowerCase().includes(q) ||
      v.channel?.toLowerCase().includes(q) ||
      v.description?.toLowerCase().includes(q) ||
      v.category?.toLowerCase().includes(q);

    const matchesCategory =
      !category || category === "all" || v.category?.toLowerCase() === category.toLowerCase();

    return matchesQuery && matchesCategory;
  });
}
