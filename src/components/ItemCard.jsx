function ItemCard({ item }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`item-card ${item.type}`}>
      <div className="item-header">
        <div className="item-type">
          {item.type === 'lost' ? '🔍 LOST' : '✅ FOUND'}
        </div>
        <div className="item-date">
          {formatDate(item.dateCreated)}
        </div>
      </div>
      
      {item.photo && (
        <div className="item-image">
          <img src={item.photo} alt={item.title} />
        </div>
      )}
      
      <div className="item-content">
        <h3 className="item-title">{item.title}</h3>
        <p className="item-category">{item.category}</p>
        <p className="item-description">{item.description}</p>
        
        <div className="item-details">
          <div className="item-detail">
            <strong>Location:</strong> {item.location}
          </div>
          <div className="item-detail">
            <strong>Date {item.type === 'lost' ? 'Lost' : 'Found'}:</strong> {formatDate(item.date)}
          </div>
        </div>
        
        <div className="contact-info">
          <h4>Contact Information:</h4>
          <div className="contact-detail">
            <strong>Name:</strong> {item.contactName}
          </div>
          <div className="contact-detail">
            <strong>Phone:</strong> {item.contactPhone}
          </div>
          <div className="contact-detail">
            <strong>Email:</strong> {item.contactEmail}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;