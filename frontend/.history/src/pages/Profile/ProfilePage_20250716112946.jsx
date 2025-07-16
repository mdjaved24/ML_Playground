import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MdEdit as EditIcon,
  MdSave as SaveIcon,
  MdCancel as CancelIcon,
  MdVerified as VerifiedIcon,
  MdEmail as EmailIcon,
  MdPerson as PersonIcon,
  MdAccountCircle as AccountIcon
} from 'react-icons/md';
import { Toaster, toast } from 'sonner';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ProfilePage = () => {
  const [user, setUser] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalUser, setOriginalUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const accessToken = localStorage.getItem('access');

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/profile/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        });
        setUser(response.data);
        setOriginalUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/user/profile/`, user, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });
      setOriginalUser(user);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
      // Revert to original data
      setUser(originalUser);
    }
  };

  const handleCancel = () => {
    setUser(originalUser);
    setEditMode(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
    <Toaster position="top-right" />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold">Profile Settings</h1>
                  <p className="text-purple-100">Manage your personal information</p>
                </div>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center bg-white text-purple-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
                  >
                    <EditIcon className="mr-2" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="flex items-center bg-white text-green-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
                    >
                      <SaveIcon className="mr-2" /> Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center bg-white text-gray-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
                    >
                      <CancelIcon className="mr-2" /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 md:p-8">
              <div className="space-y-6">
                {/* Email Field */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <EmailIcon className="text-gray-500 mr-2" />
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    {user.email_verified && (
                      <span className="ml-2 flex items-center text-sm text-green-600">
                        <VerifiedIcon className="mr-1" /> Verified
                      </span>
                    )}
                  </div>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled={user.email_verified} // Don't allow changing verified email
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  )}
                </div>

                {/* Username Field */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <AccountIcon className="text-gray-500 mr-2" />
                    <label className="text-sm font-medium text-gray-700">Username</label>
                  </div>
                  {editMode ? (
                    <input
                      type="text"
                      name="username"
                      value={user.username}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">@{user.username}</p>
                  )}
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <PersonIcon className="text-gray-500 mr-2" />
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                    </div>
                    {editMode ? (
                      <input
                        type="text"
                        name="first_name"
                        value={user.first_name}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {user.first_name || <span className="text-gray-400">Not specified</span>}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <PersonIcon className="text-gray-500 mr-2" />
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                    </div>
                    {editMode ? (
                      <input
                        type="text"
                        name="last_name"
                        value={user.last_name}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {user.last_name || <span className="text-gray-400">Not specified</span>}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Info (can be expanded) */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Account Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Member since</p>
                      <p className="text-gray-900 font-medium">
                        {new Date(user.date_joined).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last updated</p>
                      <p className="text-gray-900 font-medium">
                        {new Date(user.last_updated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;