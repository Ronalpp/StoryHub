import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import { HeartIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

function Read() {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { storyId } = useParams();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const storyDoc = await getDoc(doc(db, 'stories', storyId));
        if (storyDoc.exists()) {
          setStory({ id: storyDoc.id, ...storyDoc.data() });
          // Increment read count
          await updateDoc(doc(db, 'stories', storyId), {
            reads: increment(1)
          });
        }
      } catch (error) {
        console.error('Error fetching story:', error);
        toast.error('Failed to load story');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId]);

  const handleFavorite = async () => {
    if (!currentUser) {
      toast.error('Please login to favorite stories');
      return;
    }

    try {
      setIsFavorited(!isFavorited);
      // Implement favorite logic with Firebase
      toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      console.error('Error updating favorites:', error);
      setIsFavorited(!isFavorited); // Revert on error
      toast.error('Failed to update favorites');
    }
  };

  const handleBookmark = async () => {
    if (!currentUser) {
      toast.error('Please login to bookmark stories');
      return;
    }

    try {
      setIsBookmarked(!isBookmarked);
      // Implement bookmark logic with Firebase
      toast.success(isBookmarked ? 'Removed from library' : 'Added to library');
    } catch (error) {
      console.error('Error updating bookmarks:', error);
      setIsBookmarked(!isBookmarked); // Revert on error
      toast.error('Failed to update library');
    }
  };

  if (loading) {
    return <div className="text-center">Loading story...</div>;
  }

  if (!story) {
    return <div className="text-center">Story not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <img
          src={story.coverImage}
          alt={story.title}
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{story.title}</h1>
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-600">
            By {story.authorName} · {story.reads} reads
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleFavorite}
              className="text-gray-600 hover:text-red-500"
            >
              {isFavorited ? (
                <HeartIconSolid className="h-6 w-6 text-red-500" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={handleBookmark}
              className="text-gray-600 hover:text-purple-500"
            >
              {isBookmarked ? (
                <BookmarkIconSolid className="h-6 w-6 text-purple-500" />
              ) : (
                <BookmarkIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        <p className="text-gray-600 mb-8">{story.description}</p>
      </div>

      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: story.content }} />
      </div>
    </div>
  );
}

export default Read;