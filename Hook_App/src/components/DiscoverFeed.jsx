import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPosts, likePost } from '../lib/api/posts';
import CreatePost from './CreatePost';

export default function DiscoverFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleLike = async (postId) => {
    try {
      await likePost(postId, user.id);
      loadPosts();
    } catch (err) {
      console.error('Failed to like:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Discover</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-[#FF3E6E] hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          + New Post
        </button>
      </div>

      {showCreate && (
        <CreatePost 
          onClose={() => setShowCreate(false)} 
          onPostCreated={loadPosts}
        />
      )}
      
      {posts.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <p className="text-lg">No posts yet</p>
          <p className="text-sm mt-2">Be the first to share something!</p>
        </div>
      )}

      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="flex items-center p-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                {post.profiles?.name?.charAt(0) || '?'}
              </div>
              <div className="ml-3">
                <p className="text-white font-medium">{post.profiles?.name || 'Unknown'}</p>
                <p className="text-gray-400 text-xs">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {post.image_url && (
              <img 
                src={post.image_url} 
                alt="Post" 
                className="w-full h-80 object-cover"
              />
            )}

            {post.caption && (
              <div className="px-4 py-3">
                <p className="text-gray-200">{post.caption}</p>
              </div>
            )}

            <div className="px-4 pb-4 flex items-center">
              <button 
                onClick={() => handleLike(post.id)}
                className="flex items-center text-gray-400 hover:text-pink-500 transition-colors"
              >
                <span className="text-xl mr-1">&#10084;</span>
                <span className="text-sm">{post.likes_count || 0}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
