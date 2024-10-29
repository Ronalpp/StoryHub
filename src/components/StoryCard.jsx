import { Link } from 'react-router-dom';
import { HeartIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

function StoryCard({ story, onFavorite, onBookmark, isFavorited, isBookmarked }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={story.coverImage} 
        alt={story.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <Link to={`/read/${story.id}`}>
          <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2">By {story.author}</p>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{story.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button onClick={onFavorite} className="text-gray-600 hover:text-red-500">
              {isFavorited ? (
                <HeartIconSolid className="h-6 w-6 text-red-500" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
            </button>
            <button onClick={onBookmark} className="text-gray-600 hover:text-purple-500">
              {isBookmarked ? (
                <BookmarkIconSolid className="h-6 w-6 text-purple-500" />
              ) : (
                <BookmarkIcon className="h-6 w-6" />
              )}
            </button>
          </div>
          <div className="text-sm text-gray-500">
            {story.reads} reads
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryCard;