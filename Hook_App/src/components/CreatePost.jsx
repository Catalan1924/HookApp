import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function CreatePost({ onClose, onPostCreated }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      let imageUrl = null;

      // Upload image if selected
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Create post
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          caption,
          image_url: imageUrl
        });

      if (postError) throw postError;

      if (onPostCreated) onPostCreated();
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={onClose} className="text-gray-400 hover:text-white">Cancel</button>
          <h3 className="text-white font-semibold">New Post</h3>
          <div className="w-14" />
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 mx-4 mt-4 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Image picker */}
          <div 
            className="aspect-video bg-gray-700 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors overflow-hidden"
            onClick={() => document.getElementById('image-input').click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">+</div>
                <p>Add Photo</p>
              </div>
            )}
          </div>
          <input
            id="image-input"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Caption */}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF3E6E] resize-none"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading || (!caption && !image)}
            className="w-full bg-[#FF3E6E] hover:bg-pink-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50 transition-colors"
          >
            {uploading ? 'Posting...' : 'Share Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
