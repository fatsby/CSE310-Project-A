import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { getCurrentUser } from '../data/SampleData';

const useUserStore = create()(
  devtools(
    persist(
      (set, get) => ({
        // State
        userData: null, // This only hold non-sensitive data
        error: null,
        isLoading: false,

        // Actions
        loadUser: async () => {
          try {
            const user = getCurrentUser();
            const { id, balance, moneyearned, moneyspent, university, purchasedItems, name, email, ...safeUserData } = user;
            set({ 
              userData: safeUserData, 
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

        login: async (credentials) => {
          set({ isLoading: true, error: null });
          try {
            // Simulate login with sample data, REPLACE with actual login logic ON BACKEND IMPLEMENTATION
            // This is a placeholder for actual authentication logic
            const user = getCurrentUser();
            const { id, balance, moneyearned, moneyspent, university, purchasedItems, name, email, ...safeUserData } = user;
            
            set({ 
              userData: safeUserData, 
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
            const { id, balance, moneyearned, moneyspent, university, purchasedItems, name, email, ...safeUpdates } = updates;
            set({ 
              userData: { ...currentUser, ...safeUpdates } 
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
        getProfilePicture: () => get().userData?.profilePicture,
        // Removed getBalance and getUserName
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
