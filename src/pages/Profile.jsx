import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../firebase/config';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import StoryCard from '../components/StoryCard';
import toast from 'react-hot-toast';

function Profile() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userStories, setUserStories] = useState([]);
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || '');

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        const q = query(
          collection(db, 'stories'),
          where('authorId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const stories = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserStories(stories);
      } catch (error) {
        console.error('Error fetching user stories:', error);
        toast.error('Failed to load your stories');
      }
    };

    fetchUserStories();
  }, [currentUser.uid]);

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let newAvatarUrl = avatarUrl;
      if (avatar) {
        const storageRef = ref(storage, `avatars/${currentUser.uid}`);
        await uploadBytes(storageRef, avatar);
        newAvatarUrl = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, 'users', currentUser.uid), {
        bio,
        avatar: newAvatarUrl
      });

      setAvatarUrl(newAvatarUrl);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="flex items-center space-x-6">
            <img
              src={avatarUrl || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Change Avatar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={currentUser.username}
              disabled
              className="input-field bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="input-field"
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">My Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userStories.map(story => (
            <StoryCard
              key={story.id}
              story={story}
              onFavorite={() => {}}
              onBookmark={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;