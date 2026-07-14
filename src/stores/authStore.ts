import { create } from "zustand";
import { AUTH_STORAGE_KEY } from "@/constants/auth";
import { getEmployeeById } from "@/services/employees";
import type { Employee } from "@/types/employee";
import { useOrdersStore } from "@/stores/ordersStore";

interface AuthState {
  employee: Employee | null;
  isAuthLoading: boolean;
  signIn: (employee: Employee) => void;
  signOut: () => void;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  employee: null,
  isAuthLoading: true,

  signIn: (employee) => {
    localStorage.setItem(AUTH_STORAGE_KEY, employee.id);
    set({ employee, isAuthLoading: false });
  },

  signOut: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    useOrdersStore.getState().resetOrders();
    set({ employee: null });
  },

  restoreSession: async () => {
    const employeeId = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!employeeId) {
      set({ employee: null, isAuthLoading: false });
      return;
    }

    try {
      const employee = await getEmployeeById(employeeId);

      if (employee) {
        set({ employee, isAuthLoading: false });
        return;
      }

      localStorage.removeItem(AUTH_STORAGE_KEY);
      set({ employee: null, isAuthLoading: false });
    } catch (error) {
      console.error(error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      set({ employee: null, isAuthLoading: false });
    }
  },
}));

export const useIsAuthenticated = () =>
  useAuthStore((state) => state.employee !== null);

export const useCurrentEmployee = () => useAuthStore((state) => state.employee);

export const useIsAuthLoading = () =>
  useAuthStore((state) => state.isAuthLoading);

export const useSignIn = () => useAuthStore((state) => state.signIn);

export const useSignOut = () => useAuthStore((state) => state.signOut);
