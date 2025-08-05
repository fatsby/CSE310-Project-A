import { useParams } from 'react-router-dom';
import useUserStore from '../stores/userStore';

import YourProfilePage from './YourProfilePage';
import OtherProfilePage from './OtherProfilePage';

function ProfileController() {
  const { id } = useParams();

  const userData = useUserStore((state) => state.userData);
  
  const isOwnProfile = userData && userData.id.toString() === id;

  return isOwnProfile ? <YourProfilePage /> : <OtherProfilePage />;
}

export default ProfileController;