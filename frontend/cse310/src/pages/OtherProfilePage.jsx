import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { getUserById } from '../data/SampleData';

function OtherProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUserById(id);
    setUser(userData);
  }, [id]);

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{user.name}'s Profile</h1>
      <p>Bio: {user.bio}</p>
      <button>Follow {user.name}</button>
    </div>
  );
}

export default OtherProfilePage;