"use client"; // Next.js client directive

import React, { useState, useEffect } from 'react';
import { db } from '../firebase/clientApp';
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';

const FeedbackPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [rating, setRating] = useState(1);
  const [comments, setComments] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [averageRating, setAverageRating] = useState('0.00');
  const [totalFeedback, setTotalFeedback] = useState(0);

  useEffect(() => {
    const fetchFeedback = async () => {
      const feedbackCollection = collection(db, 'feedback');
      const feedbackQuery = query(feedbackCollection, orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(feedbackQuery);

      const feedbackData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeedbackList(feedbackData);

      // Calculate average rating correctly
      const total = feedbackData.length;
      if (total > 0) {
        const sumOfRatings = feedbackData.reduce((sum, feedback) => sum + Number(feedback.rating), 0);
        const average = (sumOfRatings / total).toFixed(2);
        setAverageRating(average);
      } else {
        setAverageRating('0.00');
      }
      setTotalFeedback(total);
    };
    fetchFeedback();
  }, []);

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'feedback'), {
        user_id: null,
        rating: Number(rating), // Ensure rating is a number
        comments,
        isAnonymous,
        submittedAt: new Date()
      });
      alert('Feedback submitted!');
    } catch (error) {
      console.error('Error submitting feedback: ', error);
      alert('Failed to submit feedback.');
    }
  };

  const classifyFeedback = async (id, classification) => {
    try {
      const feedbackDoc = doc(db, 'feedback', id);
      await updateDoc(feedbackDoc, { classification, reviewed: true });
      alert('Feedback classified successfully!');
      setFeedbackList(feedbackList.map(feedback => 
        feedback.id === id ? { ...feedback, classification, reviewed: true } : feedback
      ));
    } catch (error) {
      console.error('Error classifying feedback: ', error);
      alert('Failed to classify feedback.');
    }
  };

  return (
    <div style={{ backgroundColor: 'black', color: 'white', padding: '20px', minHeight: '100vh' }}>
      <h2>Feedback Management</h2>
      <form onSubmit={submitFeedback} style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Rating:
          <input 
            type="number" 
            min="1" 
            max="5" 
            value={rating} 
            onChange={(e) => setRating(e.target.value)} 
            required 
            style={{ marginLeft: '10px', color:'black' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Comments:
          <textarea 
            value={comments} 
            onChange={(e) => setComments(e.target.value)} 
            required 
            style={{ marginLeft: '10px', width: '100%', height: '80px' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Submit Anonymously:
          <input 
            type="checkbox" 
            checked={isAnonymous} 
            onChange={(e) => setIsAnonymous(e.target.checked)} 
            style={{ marginLeft: '10px' }}
          />
        </label>
        <button type="submit" style={{ backgroundColor: 'orange', color: 'black', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
          Submit Feedback
        </button>
      </form>

      <h3>Feedback Analytics</h3>
      <p>Total Feedback: {totalFeedback}</p>
      <p>Average Rating: {averageRating}</p>

      <h3>Feedback List</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {feedbackList.map((feedback, index) => (
          <li key={index} style={{ backgroundColor: '#333', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
            <p>Rating: {feedback.rating}</p>
            <p>Comments: {feedback.comments}</p>
            <p>Anonymous: {feedback.isAnonymous ? 'Yes' : 'No'}</p>
            <p>Submitted At: {new Date(feedback.submittedAt.seconds * 1000).toLocaleString()}</p>
            <p>Classification: {feedback.classification || 'Unclassified'}</p>
            <p>Reviewed: {feedback.reviewed ? 'Yes' : 'No'}</p>
            <div>
              <button onClick={() => classifyFeedback(feedback.id, 'Positive')} style={{ backgroundColor: 'orange', color: 'black', border: 'none', marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}>
                Mark as Positive
              </button>
              <button onClick={() => classifyFeedback(feedback.id, 'Neutral')} style={{ backgroundColor: 'orange', color: 'black', border: 'none', marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}>
                Mark as Neutral
              </button>
              <button onClick={() => classifyFeedback(feedback.id, 'Negative')} style={{ backgroundColor: 'orange', color: 'black', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                Mark as Negative
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackPage;
