import { useState, useEffect } from 'react';
import ItemCard from './ItemCard';
import { onValue, ref } from 'firebase/database';
import { db } from '../firebase';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const re = ref(db,'/')
    const unsubcscribe = onValue(re,(snapshot)=>{
      let items = []
      snapshot.forEach((childSnapshot)=>{
        items.push(childSnapshot.val())
      })
      setItems(items)
    })
    return () => unsubcscribe();
  }, []);

  useEffect(() => {
    let filtered = items;

    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, filterType]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Recent Posts</h2>
        <div className="dashboard-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search items, location, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Items</option>
              <option value="lost">Lost Items</option>
              <option value="found">Found Items</option>
            </select>
          </div>
        </div>
      </div>

      <div className="items-grid">
        {filteredItems.length === 0 ? (
          <div className="no-items">
            {searchTerm || filterType !== 'all' ? 
              'No items match your search criteria.' : 
              'No items posted yet. Be the first to post!'
            }
          </div>
        ) : (
          filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;