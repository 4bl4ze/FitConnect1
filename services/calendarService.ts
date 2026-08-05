import API from "./client";

// Matching model for ScheduledWorkout entity in Java
export interface ScheduledWorkout {
  id?: number;
  userId?: number;
  workoutPlanId?: number;
  workoutName?: string;
  scheduledDate: string; // ISO Date format YYYY-MM-DD from LocalDate
  completed?: boolean;
  notes?: string;
}

/**
 * Fetch scheduled workouts for a user within a specific date range.
 * 
 * Maps to: GET /api/calendar/{userId}?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
export const getUserCalendar = async (
  userId: number,
  startDate: string | Date,
  endDate: string | Date
): Promise<ScheduledWorkout[]> => {
  // Format Date objects to YYYY-MM-DD string if passed as Date instances
  const formattedStart =
    startDate instanceof Date ? startDate.toISOString().split("T")[0] : startDate;
  const formattedEnd =
    endDate instanceof Date ? endDate.toISOString().split("T")[0] : endDate;

  const response = await API.get<ScheduledWorkout[]>(`/calendar/${userId}`, {
    params: {
      startDate: formattedStart,
      endDate: formattedEnd,
    },
  });

  return response.data;
};