"use client";
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/clientApp';
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';

export default function RewardsOversight() {
  // State variables for rewards, number of participants, and loading status
  const [rewards, setRewards] = useState([]);
  const [participants, setParticipants] = useState(0);
  const [loading, setLoading] = useState(true);
  const [nextUserId, setNextUserId] = useState(1); // Local state to simulate auto-increment user_id

   // Fetch rewards data from Firestore and track unique participants
  useEffect(() => {
    async function fetchRewards() {
      try {
        // Query rewards collection, ordered by earned date
        const rewardsCollection = collection(db, "rewards");
        const q = query(rewardsCollection, orderBy("earned_date", "desc"));
        const querySnapshot = await getDocs(q);
         // Map fetched documents to an array of rewards
        const rewardsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Determine the next user_id (simulate auto-increment)
        const maxUserId = rewardsData.reduce(
          (max, reward) => Math.max(max, reward.user_id || 0),
          0
        );

      // Count unique user IDs to determine the number of participants
        const uniqueUsers = new Set(rewardsData.map((reward) => reward.user_id));
        setParticipants(uniqueUsers.size);
        setNextUserId(maxUserId + 1);
        // Update state with rewards data
        setRewards(rewardsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rewards:", error);
        setLoading(false);
      }
    }
    fetchRewards();
  }, []);

  // Add a new reward to Firestore with dynamic data
  const addReward = async () => {
    try {
      const newReward = {
        user_id: nextUserId, // Use next available user_id
        points_earned: 100, // Example point
        points_redeemed: 0, // Initial redemption points
        reward_description: "Special reward", // Example description
        is_active: true, // Reward is active by default
        earned_date: new Date(), // Current date for earned date
        redeemed_date: new Date(),
      };

      // Add the reward to Firestore
      await addDoc(collection(db, "rewards"), newReward);
      alert(`Reward added successfully for user_id: ${nextUserId}`);
      setNextUserId(nextUserId + 1); // Increment the user_id for the next entry
      window.location.reload(); // Refresh the page to fetch updated rewards
    } catch (error) {
      console.error("Error adding reward:", error);
    }
  };

  // Approve redemption of a reward (update Firestore document)
  const approveRedemption = async (id) => {
    try {
      const rewardDoc = doc(db, "rewards", id); // Reference to the specific reward
      await updateDoc(rewardDoc, {
        points_redeemed: 50, // Example redemption points
        redeemed_date: new Date(), // Set current date for redemption
        is_active: false, // Deactivate the reward
      });
      alert("Redemption approved!");
      window.location.reload(); // Refresh the page to fetch updated rewards
    } catch (error) {
      console.error("Error approving redemption:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Rewards Oversight</h1>
      <br />
      <br />
      <br />
      <br />
       {/* Button to add a new reward */}
      <button style={styles.addButton} onClick={addReward}>
        Add New Reward
      </button>
      <p style={styles.participants}>
        Number of Participants in Loyalty Program: <strong>{participants}</strong>
      </p>
      
      {/* Display a loading message or the rewards table */}
      {loading ? (
        <p style={styles.loading}>Loading rewards...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.headerCell}>User ID</th>
              <th style={styles.headerCell}>Points Earned</th>
              <th style={styles.headerCell}>Earned Date</th>
              <th style={styles.headerCell}>Points Redeemed</th>
              <th style={styles.headerCell}>Redeemed Date</th>
              <th style={styles.headerCell}>Description</th>
              <th style={styles.headerCell}>Award Active</th>
              <th style={styles.headerCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map((reward) => (
              <tr key={reward.id} style={styles.bodyRow}>
                <td style={styles.cell}>{reward.user_id}</td>
                <td style={styles.cell}>{reward.points_earned}</td>
                <td style={styles.cell}>
                  {new Date(reward.earned_date?.seconds * 1000).toLocaleDateString()}
                </td>
                <td style={styles.cell}>{reward.points_redeemed}</td>
                <td style={styles.cell}>{reward.points_redeemed
                  ? new Date(reward.redeemed_date?.seconds * 1000).toLocaleDateString()
                  : "N/A"}</td>
                <td style={styles.cell}>{reward.reward_description}</td>
                <td style={styles.cell}>{reward.is_active ? "Yes" : "No"}</td>
                
                <td style={styles.cell}>
                  {reward.is_active && (
                    <button
                      style={styles.button}
                      onClick={() => approveRedemption(reward.id)}
                    >
                      Approve Redemption
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Inline styles
const styles = {
  container: {
    backgroundColor: "#000",
    color: "#fff",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
  },
  title: {
    position: "absolute",
    top: "20px",
    left: "20px",
    fontSize: "2rem",
    color: "#fff",
    textDecoration: "none",
  },
  addButton: {
    display: "block",
    margin: "0 auto 20px",
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  loading: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#aaa",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "60px",
  },
  headerRow: {
    backgroundColor: "#333",
  },
  headerCell: {
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#ff9900",
    border: "1px solid #444",
    color: "black",
  },
  bodyRow: {
    backgroundColor: "#111",
  },
  cell: {
    padding: "10px",
    border: "1px solid #444",
    color: "#ddd",
  },
  button: {
    padding: "5px 10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  },
};
