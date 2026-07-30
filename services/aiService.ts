import API from "./client";

export interface AiWorkoutRequest {
  goal: string;
  experienceLevel: string;
  daysPerWeek: number;
}

export interface Exercise {
  id?: number;
  name: string;
  sets: number;
  reps: number;
  targetMuscle?: string;
}

export interface WorkoutPlan {
  id: number;
  title?: string;
  description?: string;
  goal?: string;
  experienceLevel?: string;
  daysPerWeek?: number;
  exercises?: Exercise[];
  createdAt?: string;
}

export interface ImageFile {
  uri: string;
  name?: string;
  type?: string;
}

export const generateAiWorkoutPlan = async (
  data: AiWorkoutRequest,
  manualUserId?: number
): Promise<WorkoutPlan> => {
  const response = await API.post<WorkoutPlan>("/ai/workouts", data, {
    params: manualUserId ? { userId: manualUserId } : undefined,
  });
  return response.data;
};

export const analyzeBodyPhysique = async (
  image: ImageFile,
  manualUserId?: number
): Promise<string> => {
  const formData = new FormData();
  formData.append("image", {
    uri: image.uri,
    name: image.name || "physique.jpg",
    type: image.type || "image/jpeg",
  } as any);

  const response = await API.post<string>("/ai/workouts/analyze-body", formData, {
    params: manualUserId ? { userId: manualUserId } : undefined,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllWorkoutPlans = async (): Promise<WorkoutPlan[]> => {
  const response = await API.get<WorkoutPlan[]>("/ai/workouts/all");
  return response.data;
};

export const getWorkoutPlanById = async (id: number): Promise<WorkoutPlan> => {
  const response = await API.get<WorkoutPlan>(`/ai/workouts/${id}`);
  return response.data;
};