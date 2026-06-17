import { api } from "@/utils/api";

export type VideoResult = {
  id: string;
  title: string;
  thumbnail?: string;
  channel?: string;
  duration?: string;
};

export async function searchVideos(
  query: string,
  params?: Record<string, any>,
): Promise<VideoResult[]> {
  const res = await api.get("/videos/search", {
    params: { q: query, ...params },
  });
  return res.data?.items || [];
}

export async function getSavedVideos(): Promise<VideoResult[]> {
  const res = await api.get("/videos/saved");
  return res.data || [];
}
