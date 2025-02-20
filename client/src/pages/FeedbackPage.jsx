import React, { useState } from 'react';
import axios from 'axios';

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5); 
  const [category, setCategory] = useState('General');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); 


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false); 

    const feedbackData = {
      feedback,
      rating,
      category,
    };

    try {
      const response = await axios.post('/feedback', feedbackData);

      setIsSuccess(true); 
      setResponseMessage('Thank you for your feedback!'); 
      setFeedback('');
      setRating(5);
      setCategory('General');
      setIsSubmitting(false);
    } catch (error) {
     
      setIsSuccess(false); 
      setResponseMessage('Something went wrong. Please try again.'); 
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h1 className="text-2xl font-semibold text-gray-800">We Value Your Feedback</h1>
      <p className="text-gray-600 mt-2">
        Please share your feedback to help us improve our service. Your opinion matters to us!
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        
        <div>
          <label className="block text-lg font-medium text-gray-700">Category</label>
          <select
            className="w-full p-4 rounded-lg border border-gray-300 mt-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="General">General Feedback</option>
            <option value="Service">Service Quality</option>
            <option value="Product">Product Feedback</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Rating</label>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                fill={star <= rating ? 'yellow' : 'gray'}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 cursor-pointer"
                onClick={() => setRating(star)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
              </svg>
            ))}
          </div>
        </div>

    
        <div>
          <label className="block text-lg font-medium text-gray-700">Your Feedback</label>
          <textarea
            className="w-full p-4 rounded-lg border border-gray-300 mt-2"
            rows="6"
            placeholder="Enter your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          ></textarea>
        </div>

      
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 rounded-lg text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition duration-200`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>

      {responseMessage && (
        <div className={`mt-4 text-center text-lg font-semibold ${isSuccess ? 'text-green-600' : 'text-red-500'}`}>
          {isSuccess ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="green"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{responseMessage}</span>
            </div>
          ) : (
            <span>{responseMessage}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
