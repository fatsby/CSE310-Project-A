import { useParams } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import { useState, useEffect } from 'react';
import { Loader } from '@mantine/core';

import YourProfilePage from './YourProfilePage';
import OtherProfilePage from './OtherProfilePage';

// IMPORTANT: import the simulated sensitive-user fetch
import { getCurrentUser } from '../data/SampleData';

function ProfileController() {
  const { id } = useParams();

  // Zustand selectors
  const userData = useUserStore((state) => state.userData);
  const loadUser = useUserStore((state) => state.loadUser);

  // Local state for sensitive data and loading
  const [sensitiveUserData, setSensitiveUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ensure non-sensitive data is present
  useEffect(() => {
    if (!userData) {
      loadUser();
    }
  }, [userData, loadUser]);

  // Fetch sensitive data once non-sensitive data exists
  useEffect(() => {
    let isMounted = true;

    const fetchSensitive = async () => {
      if (!userData) return;
      try {
        // Replace with real API call in production
        const fullUser = getCurrentUser();
        if (isMounted) {
          setSensitiveUserData(fullUser);
          setIsLoading(false);
        }
      } catch (e) {
        if (isMounted) {
          setSensitiveUserData(null);
          setIsLoading(false);
        }
      }
    };

    fetchSensitive();

    return () => {
      isMounted = false;
    };
  }, [userData]);

  //  Loading state
  if (isLoading || !sensitiveUserData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader color="blue" />
      </div>
    );
  }

  // Safely compare IDs (string vs number)
  const isOwnProfile =
    sensitiveUserData?.id != null && id != null
      ? String(sensitiveUserData.id) === String(id)
      : false;

  return isOwnProfile ? <YourProfilePage /> : <OtherProfilePage />;
}

export default ProfileController;
