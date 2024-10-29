import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PencilSquareIcon, BookOpenIcon, UserIcon } from '@heroicons/react/24/outline';

function Navbar() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-purple-600">
            StoryHub
          </Link>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link
                  to="/write"
                  className="flex items-center space-x-1 text-gray-600 hover:text-purple-600"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                  <span>Write</span>
                </Link>
                <Link
                  to="/library"
                  className="flex items-center space-x-1 text-gray-600 hover:text-purple-600"
                >
                  <BookOpenIcon className="h-5 w-5" />
                  <span>Library</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-600 hover:text-purple-600"
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;