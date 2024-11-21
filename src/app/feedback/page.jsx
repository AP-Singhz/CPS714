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
        rating: Number(rating),
        comments,
        isAnonymous,
        submittedAt: new Date()
      });
      alert('Feedback submitted!');

      // Refetch the feedback list after successful submission
      const feedbackCollection = collection(db, 'feedback');
      const feedbackQuery = query(feedbackCollection, orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(feedbackQuery);

      const feedbackData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeedbackList(feedbackData);

      // Reset form fields
      setRating(1);
      setComments('');
      setIsAnonymous(false);
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
    <div className="dark-section" style={{ padding: '20px', minHeight: '100vh' }}>
      <h2 className="h1">Feedback Management</h2>
      <form onSubmit={submitFeedback} className="form-container">
        <label>
          Rating:
          <input 
            type="number" 
            min="1" 
            max="5" 
            value={rating} 
            onChange={(e) => setRating(e.target.value)} 
            required 
            className="input-field"
          />
        </label>
        <label>
          Comments:
          <textarea 
            value={comments} 
            onChange={(e) => setComments(e.target.value)} 
            required 
            className="textbox"
          />
        </label>
        <label>
          Submit Anonymously:
          <input 
            type="checkbox" 
            checked={isAnonymous} 
            onChange={(e) => setIsAnonymous(e.target.checked)} 
            style={{ marginTop: '1rem' }}
          />
        </label>
        <button type="submit" className="btn">
          Submit Feedback
        </button>
      </form>

      <h3>Feedback Analytics</h3>
      <p>Total Feedback: {totalFeedback}</p>
      <p>Average Rating: {averageRating}</p>

      <h3>Feedback List</h3>
      <ul className="list">
        {feedbackList.map((feedback, index) => (
          <li key={index} className="list__item">
            <div className="list__stats">
              <p>Rating: {feedback.rating}</p>
              <p>Comments: {feedback.comments}</p>
              <p>Anonymous: {feedback.isAnonymous ? 'Yes' : 'No'}</p>
              <p>Submitted At: {new Date(feedback.submittedAt.seconds * 1000).toLocaleString()}</p>
              <p>Classification: {feedback.classification || 'Unclassified'}</p>
              <p>Reviewed: {feedback.reviewed ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <button onClick={() => classifyFeedback(feedback.id, 'Positive')} className="btn tiny">
                Mark as Positive
              </button>
              <button onClick={() => classifyFeedback(feedback.id, 'Neutral')} className="btn tiny">
                Mark as Neutral
              </button>
              <button onClick={() => classifyFeedback(feedback.id, 'Negative')} className="btn tiny">
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
