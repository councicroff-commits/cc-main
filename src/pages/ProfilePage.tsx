import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';   // ← use the real context
import api from '../api';

// --- Type Definitions ---
interface UserProfileData {
  fullName: string;
  username: string;
  email: string;
  mobile: string;
  birthDate: string;
  gender: string;
  facebook: string;
  avatar: string;
  age: number | string;
  status: string;
  isVerified: boolean;
  created_at: string;
}

// --- Minimized Draggable Orders Button (unchanged) ---
const DraggableOrderButton: React.FC = () => {
  const navigate = useNavigate();
  
  const [position, setPosition] = useState({ 
    x: window.innerWidth - 60, 
    y: window.innerHeight - 80 
  });
  const [isDragging, setIsDragging] = useState(false);
  
  const dragInfo = useRef({ 
    startX: 0, 
    startY: 0, 
    initialX: 0, 
    initialY: 0, 
    hasMoved: false 
  });

  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 50),
        y: Math.min(prev.y, window.innerHeight - 50)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
      hasMoved: false
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragInfo.current.startX;
    const deltaY = e.clientY - dragInfo.current.startY;
    
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      dragInfo.current.hasMoved = true;
    }

    setPosition({
      x: dragInfo.current.initialX + deltaX,
      y: dragInfo.current.initialY + deltaY
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    if (!dragInfo.current.hasMoved) {
      navigate('/orders'); 
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        touchAction: 'none' 
      }}
      className="fixed z-[100] w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-black text-xs shadow-[0_2px_10px_rgba(0,0,0,0.35)] cursor-grab active:cursor-grabbing border border-indigo-400 select-none hover:bg-gray-800 transition-colors"
      title="Go to Orders"
    >
      CC
    </div>
  );
};

export const ProfilePage = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserProfileData>({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    birthDate: '',
    gender: '',
    facebook: '',
    avatar: '',
    age: '',
    status: 'Active',
    isVerified: false,
    created_at: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Helper – map whatever the backend returns into the form shape
  const mapToForm = (data: any): UserProfileData => ({
    fullName:
      data.fullName ||
      (data.profile
        ? `${data.profile.firstName || ''} ${data.profile.lastName || ''}`.trim()
        : '') ||
      '',
    username: data.username || (data.email ? data.email.split('@')[0] : 'user'),
    email: data.email || '',
    mobile: data.mobile || data.profile?.mobile || '',
    birthDate: data.birthDate || data.profile?.birthDate || '',
    gender: data.gender || data.profile?.gender || '',
    facebook: data.facebook || data.profile?.facebook || '',
    avatar: data.avatar || data.profile?.avatar || '',
    age: data.age || '',
    status: data.status || data.accountStatus || 'Active',
    isVerified: !!data.isVerified,
    created_at: data.created_at || data.createdAt || '',
  });

  // --- Live Data Fetching (with graceful fallback) ---
  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Updated with full /api/v1/auth/profile route path
        const response = await api.get('/api/v1/auth/profile');
        if (cancelled) return;

        const data = response.data;
        setFormData(mapToForm(data));
      } catch (err: any) {
        if (cancelled) return;

        console.error('Profile Fetch Error:', err);

        // Prefer already-loaded user from AuthContext / localStorage
        if (user) {
          setFormData(mapToForm(user));
          setError('Could not refresh profile from server. Showing cached data.');
        } else {
          // Try localStorage as last resort
          try {
            const cached = localStorage.getItem('userProfileData');
            if (cached) {
              setFormData(mapToForm(JSON.parse(cached)));
              setError('Could not reach server. Showing cached profile.');
            } else {
              if (err.response?.status === 401) {
                logout();
                navigate('/login');
                return;
              }

              if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
                setError('Server took too long to respond. Please try again.');
              } else if (err.code === 'ERR_NETWORK') {
                setError('Network Error: Cannot establish connection to backend.');
              } else {
                setError(err.response?.data?.message || 'Failed to load profile data.');
              }
            }
          } catch {
            setError('Failed to load profile data.');
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [user, logout, navigate]);

  // --- Input Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Save Profile Data ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Updated with full /api/v1/auth/profile route path
      await api.put('/api/v1/auth/profile', formData);
      setSuccess('Your account information has been updated successfully.');
      setIsEditing(false);

      // Keep AuthContext in sync
      if (refreshUser) {
        await refreshUser();
      }
    } catch (err: any) {
      console.error('Profile Save Error:', err);
      setError(err.response?.data?.message || 'Save operation failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-500 font-medium">Loading your account...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-gray-900 relative">
      
      <DraggableOrderButton />

      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Account</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your personal information and security settings</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 sm:mt-0 px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-md shadow-sm transition-colors"
          >
            Sign Out
          </button>
        </div>

        {error && (
          <div className="w-full bg-red-50 border-l-4 border-red-500 text-red-700 p-4 shadow-sm">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="w-full bg-green-50 border-l-4 border-green-500 text-green-700 p-4 shadow-sm">
            <p className="text-sm font-medium">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-3xl mb-4 border-4 border-white shadow-md overflow-hidden">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  formData.fullName.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{formData.fullName}</h2>
              <p className="text-sm text-gray-500">@{formData.username}</p>
              
              <div className="mt-6 w-full space-y-3">
                <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-3">
                  <span className="text-gray-500">Account Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${formData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {formData.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-3">
                  <span className="text-gray-500">Verification</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${formData.isVerified ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                    {formData.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-3">
                  <span className="text-gray-500">Member Since</span>
                  <span className="text-gray-900 font-medium">{formatDate(formData.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSave} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors sm:text-sm"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors sm:text-sm"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors sm:text-sm"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                      <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors sm:text-sm"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="text" 
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="YYYY-MM-DD"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors sm:text-sm"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors sm:text-sm"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors sm:text-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-Binary">Non-Binary</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                      <input
                        type="text"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="https://facebook.com/..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors sm:text-sm"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-5 mt-5 border-t border-gray-200 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setError(null);
                          setSuccess(null);
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
