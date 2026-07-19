import { create } from "zustand";

export interface CompletedWorkout {
  id: string;
  title: string;
  durationMinutes: number;
  calories: number;
  exercises: number;
  completedAt: string;
}

export interface DailyPlan {
  title: string;
  description: string;
  durationMinutes: number;
  exercises: number;
  updatedAt: string;
}

interface WorkoutStore {
  totalWorkouts: number;
  streakDays: number;
  lastCompletedAt: string | null;
  latestWorkout: CompletedWorkout | null;
  recentWorkouts: CompletedWorkout[];
  plansByDay: Record<string, DailyPlan>;
  recordWorkout: (
    workout: Omit<CompletedWorkout, "id" | "completedAt">,
  ) => void;
  setPlanForDay: (dayKey: string, plan: Omit<DailyPlan, "updatedAt">) => void;
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  totalWorkouts: 0,
  streakDays: 0,
  lastCompletedAt: null,
  latestWorkout: null,
  recentWorkouts: [],
  plansByDay: {},
  recordWorkout: (workout) => {
    const completedAt = new Date().toISOString();
    const dayKey = completedAt.slice(0, 10);

    set((state) => {
      const previousDay = state.lastCompletedAt?.slice(0, 10);
      let nextStreak = 1;

      if (previousDay) {
        const prevDate = new Date(previousDay);
        const currentDate = new Date(dayKey);
        const diffDays = Math.round(
          (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays === 1) {
          nextStreak = state.streakDays + 1;
        } else if (diffDays === 0) {
          nextStreak = state.streakDays;
        } else {
          nextStreak = 1;
        }
      }

      const completedWorkout: CompletedWorkout = {
        id: Date.now().toString(),
        completedAt,
        ...workout,
      };

      return {
        totalWorkouts: state.totalWorkouts + 1,
        streakDays: nextStreak,
        lastCompletedAt: dayKey,
        latestWorkout: completedWorkout,
        recentWorkouts: [completedWorkout, ...state.recentWorkouts].slice(0, 3),
      };
    });
  },
  setPlanForDay: (dayKey, plan) => {
    set((state) => ({
      plansByDay: {
        ...state.plansByDay,
        [dayKey]: {
          ...plan,
          updatedAt: new Date().toISOString(),
        },
      },
    }));
  },
}));
