import React, { useState } from 'react';
import axios from 'axios';
import './PincodeLookup.css';

const PincodeLookup = () => {
    const [pincode, setPincode] = useState('');
    const [postOffices, setPostOffices] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pincode.length !== 6) {
            setError('Pincode must be 6 digits long.');
            setPostOffices([]);
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = response.data[0];

            if (data.Status === 'Error') {
                setError('Invalid Pincode.');
                setPostOffices([]);
            } else {
                setPostOffices(data.PostOffice || []);
            }
        } catch (err) {
            setError('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    const filteredPostOffices = postOffices.filter((office) =>
        office.Name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="pincode-lookup-container">
            <h1>Pincode Lookup</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter 6-digit Pincode"
                />
                <button type="submit">Lookup</button>
            </form>

            {error && <p className="error">{error}</p>}
            {loading && <div className="loader"></div>}

            <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter by post office name"
                disabled={postOffices.length === 0}
            />

            {filteredPostOffices.length === 0 && !loading && (
                <p className="error">Couldn’t find the postal data you’re looking for…</p>
            )}

            <div className="post-office-list">
                {filteredPostOffices.map((office) => (
                    <div key={office.Name} className="post-office-item">
                        <h2>{office.Name}</h2>
                        <p>Pincode: {office.Pincode}</p>
                        <p>District: {office.District}</p>
                        <p>State: {office.State}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PincodeLookup;

