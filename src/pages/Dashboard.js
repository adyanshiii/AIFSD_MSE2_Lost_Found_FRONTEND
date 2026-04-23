import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { token, logout } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '' });
    const [editId, setEditId] = useState(null);

    // Part D: View all reported items - Cleaned for Vercel Build [cite: 16]
    const fetchItems = async () => {
        try {
            const res = await axios.get('/items');
            setItems(res.data);
        } catch (err) {
            console.error("Error fetching items", err);
        }
    };

    // Effect with empty dependency array to prevent infinite loops
    useEffect(() => {
        fetchItems();
    }, []); 

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`/items/search?name=${searchQuery}`);
            setItems(res.data);
        } catch (err) {
            console.error("Search failed", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            if (editId) {
                await axios.put(`/items/${editId}`, formData, config);
                setEditId(null);
            } else {
                await axios.post('/items', formData, config);
            }
            setFormData({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '' });
            fetchItems();
        } catch (err) {
            alert("Action failed. Ensure you are authorized.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/items/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchItems();
        } catch (err) {
            alert("Unauthorized: You can only delete your own reports.");
        }
    };

    const startEdit = (item) => {
        setEditId(item._id);
        setFormData({ 
            itemName: item.itemName, 
            description: item.description, 
            type: item.type, 
            location: item.location, 
            contactInfo: item.contactInfo 
        });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Campus Lost & Found</h1>
                <button onClick={logout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer' }}>Logout</button>
            </header>

            {/* Part D: Search Items [cite: 16] */}
            <form onSubmit={handleSearch} style={{ margin: '20px 0' }}>
                <input 
                    type="text" 
                    placeholder="Search items..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    style={{ padding: '8px', width: '250px' }}
                />
                <button type="submit" style={{ padding: '8px 15px', marginLeft: '5px' }}>Search</button>
                <button type="button" onClick={fetchItems} style={{ padding: '8px 15px', marginLeft: '5px' }}>Reset</button>
            </form>

            {/* Part D: Add/Update Item Form [cite: 16] */}
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h3>{editId ? "Update Reported Item" : "Report New Item"}</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Item Name" value={formData.itemName} onChange={(e) => setFormData({...formData, itemName: e.target.value})} required style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }} />
                    <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }} />
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={{ display: 'block', margin: '10px 0', padding: '8px' }}>
                        <option value="Lost">Lost</option>
                        <option value="Found">Found</option>
                    </select>
                    <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }} />
                    <input type="text" placeholder="Contact Info" value={formData.contactInfo} onChange={(e) => setFormData({...formData, contactInfo: e.target.value})} required style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }} />
                    <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
                        {editId ? "Save Changes" : "Post Report"}
                    </button>
                </form>
            </div>

            {/* Part D: Display Items [cite: 16] */}
            <h3>Recent Reports</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
                {items.length === 0 ? <p>No items reported yet.</p> : items.map(item => (
                    <div key={item._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', position: 'relative' }}>
                        <span style={{ float: 'right', fontWeight: 'bold', color: item.type === 'Lost' ? '#d9534f' : '#5cb85c' }}>{item.type}</span>
                        <h4>{item.itemName}</h4>
                        <p>{item.description}</p>
                        <p style={{ fontSize: '0.9em', color: '#555' }}>📍 {item.location} | 📞 {item.contactInfo}</p>
                        <div style={{ marginTop: '10px' }}>
                            <button onClick={() => startEdit(item)} style={{ marginRight: '10px' }}>Edit</button>
                            <button onClick={() => handleDelete(item._id)} style={{ color: 'red' }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;