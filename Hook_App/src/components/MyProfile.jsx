import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, updateProfile } from '../lib/api/profiles';

export default function MyProfile() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    age: '',
    bio: '',
    university: '',
    interests: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await getProfile(user.id);
      setProfile(data);
      if (data) {
        setForm({
          name: data.name || '',
          age: data.age || '',
          bio: data.bio || '',
          university: data.university || '',
          interests: data.interests?.join(', ') || ''
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updateProfile(user.id, {
        name: form.name,
        age: form.age ? parseInt(form.age) : null,
        bio: form.bio,
        university: form.university,
        interests: form.interests.split(',').map(i => i.trim()).filter(Boolean)
      });
      setMessage('Profile updated!');
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-6">My Profile</h2>

      {message && (
        <div className={`p-3 rounded-lg mb-4 ${
          message.includes('Error') 
            ? 'bg-red-500/20 border border-red-500 text-red-300' 
            : 'bg-green-500/20 border border-green-500 text-green-300'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-gray-800 rounded-xl p-6 space-y-4">
        <div>
          <label className="text-gray-300 text-sm block mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF3E6E]"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm block mb-1">Age</label>
          <input
            type="number"
            value={form.age}
            onChange={(e) => setForm({...form, age: e.target.value})}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF3E6E]"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm block mb-1">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({...form, bio: e.target.value})}
            rows={3}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF3E6E]"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm block mb-1">University</label>
          <input
            type="text"
            value={form.university}
            onChange={(e) => setForm({...form, university: e.target.value})}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF3E6E]"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm block mb-1">Interests (comma separated)</label>
          <input
            type="text"
            value={form.interests}
            onChange={(e) => setForm({...form, interests: e.target.value})}
            placeholder="e.g. hiking, music, cooking"
            className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF3E6E]"
          />
        </div>

        <div className="flex space-x-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#FF3E6E] hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
          <button
            type="button"
            onClick={signOut}
            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Sign Out
          </button>
        </div>
      </form>

      {/* Email info */}
      <div className="mt-4 bg-gray-800 rounded-xl p-4">
        <p className="text-gray-400 text-sm">Email: {user?.email}</p>
        <p className="text-gray-400 text-sm">User ID: {user?.id?.slice(0, 8)}...</p>
      </div>
    </div>
  );
}
