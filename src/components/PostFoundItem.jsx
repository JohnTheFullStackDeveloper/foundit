import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, setDataFG } from '../firebase';
import { push, ref } from 'firebase/database';

function PostFoundItem() {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newItem = {
      id: Date.now(),
      type: 'found',
      ...formData,
      photo: preview,
      dateCreated: new Date().toISOString(),
      userId: user.uid
    };

    const re = ref(db,"items")
    const id = push(re).key
    // console.log(id)
    // console.log(newItem)
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

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="post-item-container">
      <div className="post-item-header">
        <h2>Post a Found Item</h2>
        <p>Help reunite someone with their lost item by posting what you found.</p>
      </div>

      {success && (
        <div className="success-message">
          Found item posted successfully! It will appear in the dashboard.
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
              <label htmlFor="location">Where Found *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Central Park bench, Bus stop on 5th Ave"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="date">Date Found *</label>
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
            <label htmlFor="photo">Upload Photo *</label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            <small>Please upload a clear photo of the found item</small>
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
          Post Found Item
        </button>
      </form>
    </div>
  );
}

export default PostFoundItem;