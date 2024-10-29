import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import StoryCard from '../components/StoryCard';
import toast from 'react-hot-toast';

function Library() {
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const [favoritedStories, setFavoritedStories] = useState([]);
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        // Fetch bookmarked stories
        const bookmarksQuery = query(
          collection(db, 'bookmarks'),
          where('userId', '==', currentUser.uid)
        );
        const bookmarksSnapshot = await getDocs(bookmarksQuery);
        const bookmarkedIds = bookmarksSnapshot.docs.map(doc => doc.data().storyId);

        // Fetch favorited stories
        const favoritesQuery = query(
          collection(db, 'favorites'),
          where('userId', '==', currentUser.uid)
        );
        const favoritesSnapshot = await getDocs(favoritesQuery);
        const favoritedIds = favoritesSnapshot.docs.map(doc => doc.data().storyId);

        // Fetch story details
        const fetchStoryDetails = async (storyId) => {
          const storyDoc = await getDocs(doc(db, 'stories', storyId));
          return { id: storyDoc.id, ...storyDoc.data() };
        };

        const bookmarkedStoriesData = await Promise.all(
          bookmarkedIds.map(fetchStoryDetails)
        );
        const favoritedStoriesData = await Promise.all(
          favoritedIds.map(fetchStoryDetails)
        );

        setBookmarkedStories(bookmarkedStoriesData);
        setFavoritedStories(favoritedStoriesData);
      } catch (error) {
        console.error('Error fetching library:', error);
        toast.error('Failed to load library');
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [currentUser.uid]);

  if (loading) {
    return <div className="text-center">Loading library...</div>;
  }

  return (
    <div>
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'bookmarks'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Bookmarks
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'favorites'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Favorites
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'bookmarks' ? (
          bookmarkedStories.map(story => (
            <StoryCard
              key={story.id}
              story={story}
              onFavorite={() => {}}
              onBookmark={() => {}}
              isBookmarked={true}
            />
          ))
        ) : (
          favoritedStories.map(story => (
            <StoryCard
              key={story.id}
              story={story}
              onFavorite={() => {}}
              onBookmark={() => {}}
              isFavorited={true}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Library;