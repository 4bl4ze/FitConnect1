import API from './client';

// Interface matching your Spring Boot Workout model properties
export interface Workout {
  
  id?: number;
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;         // Adjust property names if Workout.java uses different names
 
  
}

// 1. GET ALL USER WORKOUTS -> @GetMapping in WorkoutController
export const getMyWorkouts = async (): Promise<Workout[]> => {
  const response = await API.get('/workouts');
  return response.data;
};

// 2. GET USER STREAK -> @GetMapping("/streak") in WorkoutController
export const getMyStreak = async (): Promise<number> => {
  const response = await API.get('/workouts/streak');
  return response.data;
};

// 3. CREATE WORKOUT -> @PostMapping in WorkoutController
export const createWorkout = async (workoutData: Workout): Promise<Workout> => {
  const response = await API.post('/workouts', workoutData);
  return response.data;
};