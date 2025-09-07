import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, setDataFG } from '../firebase';
import { push, ref } from 'firebase/database';

function PostLostItem() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    contactName: user?.name || '',
    contactPhone: '',
    contactEmail: user?.email || '',
    photo: null
  });
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);

  const categories = [
    'Electronics', 'Jewelry', 'Clothing', 'Bags/Wallets', 'Keys', 
    'Documents', 'Pets', 'Vehicles', 'Sports Equipment', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // compress function
  const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.6) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // maintain aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // JPEG = smaller size
          const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedBase64);
        };
      };
    });
  };

  // compress the selected image
  const compressedBase64 = await compressImage(file, 400, 400, 0.5);

  // store compressed image in form data
  setFormData(prev => ({
    ...prev,
    photo: compressedBase64, // 👈 now it's small base64 string, not full file
  }));

  // also show preview
  setPreview(compressedBase64);
  console.log("Compressed size:", (compressedBase64.length / 1024).toFixed(2), "KB");
};


  const handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      id: Date.now(),
      type: 'lost',
      ...formData,
      photo: preview,
      dateCreated: new Date().toISOString(),
      userId: user.uid
    };
    const re = ref(db,"items")
    const id = push(re).key
    setDataFG(`${id}`,newItem)
    setSuccess(true);
    setFormData({
      title: '',
      description: '',
      category: '',
      location: '',
      date: '',
      contactName: user?.name || '',
      contactPhone: '',
      contactEmail: user?.email || '',
      photo: null
    });
    setPreview(null);
  };

  return (
    <div className="post-item-container">
      <div className="post-item-header">
        <h2>Post a Lost Item</h2>
        <p>Help us help you find your lost item by providing as much detail as possible.</p>
      </div>

      {success && (
        <div className="success-message">
          Lost item posted successfully! It will appear in the dashboard.
        </div>
      )}

      <form onSubmit={handleSubmit} className="post-item-form">
        <div className="form-section">
          <h3>Item Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Item Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Black iPhone 14, Blue Backpack"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the item (color, size, brand, unique features, etc.)"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Last Seen Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Central Park, Coffee Shop on Main St"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="date">Date Lost *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="photo">Upload Photo (if available)</label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handleFileChange}
            />
            {preview && (
              <div className="photo-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactName">Full Name *</label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contactPhone">Phone Number *</label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contactEmail">Email Address *</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          Post Lost Item
        </button>
      </form>
    </div>
  );
}

export default PostLostItem;