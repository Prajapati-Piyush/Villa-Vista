import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(UserContext);


  useEffect(() => {

    const fetchFeedback = async () => {
      try {
        if (user.role === 'admin') {
          const response = await axios.get('/feedbacks');
        }
        else{
          const response = await axios.get('/owner/feedbacks');
        }
        setFeedbacks(response.data);
        setFilteredFeedbacks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load feedbacks.');
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);


  const handleFilterChange = () => {
    let filtered = feedbacks;
    if (categoryFilter) {
      filtered = filtered.filter((feedback) => feedback.category === categoryFilter);
    }
    if (ratingFilter) {
      filtered = filtered.filter((feedback) => feedback.rating == ratingFilter);
    }
    setFilteredFeedbacks(filtered);
  };


  useEffect(() => {
    handleFilterChange();
  }, [categoryFilter, ratingFilter]);

  if (loading) {
    return <div>Loading feedback...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-8">Customer Feedbacks</h1>

      {/* Filter Section */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-4">
          <select
            className="p-2 border border-gray-300 rounded-lg"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="General">General</option>
            <option value="Service">Service</option>
            <option value="Product">Product</option>
            <option value="Other">Other</option>
          </select>

          <select
            className="p-2 border border-gray-300 rounded-lg"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="">All Ratings</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <p>No feedback available.</p>
        ) : (
          filteredFeedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="p-6 border border-gray-300 rounded-lg shadow-md bg-white"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xl font-semibold">{feedback.userId.name}</p>
                  <p className="text-sm text-gray-500">{new Date(feedback.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">
                    {'★'.repeat(feedback.rating)}
                    {'☆'.repeat(5 - feedback.rating)}
                  </span>
                  <p className="text-sm text-gray-400">{feedback.rating} / 5</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="font-medium text-gray-700">Category: {feedback.category}</p>
              </div>
              <div className="text-gray-800">
                <p>{feedback.feedback}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feedbacks;
