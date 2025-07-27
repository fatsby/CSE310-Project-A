import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { getCurrentUser } from '../data/SampleData';

const useUserStore = create()(
  devtools(
    persist(
      (set, get) => ({
        // State
        userData: null,
        error: null,
        isLoading: false,

        // Actions
        loadUser: async () => {
          try {
            const user = getCurrentUser();
            set({ 
              userData: user, 
              error: null 
            });
          } catch (error) {
            console.error('Error loading user:', error);
            set({ 
              userData: null, 
              error: error.message 
            });
          }
        },

        //LOGIN ACTION
        login: async (credentials) => {
          set({ isLoading: true, error: null });
          
          try {
            // const response = await fetch('/api/login', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(credentials)
            // });
            // const userData = await response.json();

            // Simulate login with sample data
            const user = getCurrentUser(); // DELETE THIS ON BACKEND IMPLEMENTATION
            
            set({ 
              userData: user, 
              isLoading: false,
              error: null 
            });
            
            return { success: true, user };
          } catch (error) {
            console.error('Login error:', error);
            set({ 
              userData: null, 
              isLoading: false,
              error: error.message 
            });
            return { success: false, error: error.message };
          }
        },

        updateUser: (updates) => {
          const currentUser = get().userData;
          if (currentUser) {
            set({ 
              userData: { ...currentUser, ...updates } 
            });
          }
        },
        
        // DELETE THIS ON BACKEND IMPLEMENTATION
        updateBalance: (newBalance) => {
          const currentUser = get().userData;
          if (currentUser) {
            set({ 
              userData: { ...currentUser, balance: newBalance } 
            });
          }
        },

        clearUser: () => {
          set({ 
            userData: null, 
            error: null 
          });
        },

        // Selectors
        getUser: () => get().userData,
        getBalance: () => get().userData?.balance || 0,
        getProfilePicture: () => get().userData?.profilePicture,
        getUserName: () => get().userData?.name || 'User',
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({ 
          userData: state.userData 
        }),
      }
    ),
    {
      name: 'user-store',
    }
  )
);

export default useUserStore;
