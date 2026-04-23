import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { token, logout } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '' });
    const [editId, setEditId] = useState(null);

    // Part D: View all reported items 
    const fetchItems = useCallback(async () => {
        try {
            const res = await axios.get('/items');
            setItems(res.data);
        } catch (err) {
            console.error("Error fetching items", err);
        }
    }, []);

    useEffect(() => {
    fetchItems();
     }, []);

    // Part D: Search items by name 
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`/items/search?name=${searchQuery}`);
            setItems(res.data);
        } catch (err) {
            console.error("Search failed", err);
        }
    };

    // Part D: Report (Add) or Update items 
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
            alert("Action failed. Ensure you are logged in.");
        }
    };

    // Part D: Delete their own entries 
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/items/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchItems();
        } catch (err) {
            alert("You can only delete your own reports.");
        }
    };

    const startEdit = (item) => {
        setEditId(item._id);
        setFormData({ itemName: item.itemName, description: item.description, type: item.type, location: item.location, contactInfo: item.contactInfo });
    };

    return (
        <div style={{ padding: '20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>Lost & Found Dashboard</h1>
                <button onClick={logout} style={{ background: 'red', color: 'white' }}>Logout</button>
            </header>

            {/* Search Form  */}
            <form onSubmit={handleSearch} style={{ margin: '20px 0' }}>
                <input type="text" placeholder="Search by item name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <button type="submit">Search</button>
                <button type="button" onClick={fetchItems}>Reset</button>
            </form>

            {/* Add/Edit Item Form  */}
            <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                <h3>{editId ? "Update Item" : "Report New Item"}</h3>
                <input type="text" placeholder="Item Name" value={formData.itemName} onChange={(e) => setFormData({...formData, itemName: e.target.value})} required /><br/>
                <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required /><br/>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="Lost">Lost</option>
                    <option value="Found">Found</option>
                </select><br/>
                <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required /><br/>
                <input type="text" placeholder="Contact Info" value={formData.contactInfo} onChange={(e) => setFormData({...formData, contactInfo: e.target.value})} required /><br/>
                <button type="submit">{editId ? "Update Item" : "Report Item"}</button>
            </form>

            {/* Items Display  */}
            <div style={{ display: 'grid', gap: '10px' }}>
                {items.map(item => (
                    <div key={item._id} style={{ border: '1px solid #ddd', padding: '10px' }}>
                        <h4>{item.itemName} ({item.type})</h4>
                        <p>{item.description}</p>
                        <small>Location: {item.location} | Contact: {item.contactInfo}</small><br/>
                        <button onClick={() => startEdit(item)}>Edit</button>
                        <button onClick={() => handleDelete(item._id)} style={{ marginLeft: '10px' }}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;