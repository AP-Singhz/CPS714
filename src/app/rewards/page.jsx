"use client";
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/clientApp';
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';

const RewardsPage = () => {
  // State to hold the list of rewards from Firestore
  const [rewards, setRewards] = useState([]);
  
  // State to hold the list of users for the dropdown
  const [users, setUsers] = useState([]); 
  
  // State to track the selected user from the dropdown
  const [selectedUser, setSelectedUser] = useState("");
  
  // State to track points earned by the selected user
  const [pointsEarned, setPointsEarned] = useState(0);
  
  // State to track points the user wants to redeem
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  
  // State to track the description of the reward
  const [rewardDescription, setRewardDescription] = useState("");

  // Fetch rewards and users from Firestore when the component mounts
  useEffect(() => {
    fetchRewards();
    fetchUsers();
  }, []);

  // Fetch rewards from Firestore
  const fetchRewards = async () => {
    // Query to fetch rewards ordered by reward_id
    const rewardsCollection = query(collection(db, "rewards"), orderBy("reward_id", "asc"));
    
    // Get the snapshot of the rewards collection
    const rewardsSnapshot = await getDocs(rewardsCollection);
    
    // Map the snapshot data to an array and set the rewards state
    const rewardsList = rewardsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRewards(rewardsList);
  };

  // Fetch users from Firestore to populate the user dropdown
  const fetchUsers = async () => {
    // Fetch the users collection from Firestore
    const usersCollection = collection(db, "users");
    
    // Get the snapshot of the users collection
    const usersSnapshot = await getDocs(usersCollection);
    
    // Map the snapshot data to an array and set the users state
    const usersList = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(usersList);
  };

  // Add a new reward to the Firestore
  const addReward = async () => {
    // Validate inputs: check if the points earned and points to redeem are valid
    if (!selectedUser || pointsEarned <= 0 || pointsToRedeem < 0 || pointsToRedeem > pointsEarned) {
      alert("Please check your inputs. Points to redeem cannot exceed points earned and must be greater than 0.");
      return;
    }

    // Fetch the current max reward_id to increment
    const rewardsCollection = query(collection(db, "rewards"), orderBy("reward_id", "desc"));
    const rewardsSnapshot = await getDocs(rewardsCollection);
    const maxRewardId = rewardsSnapshot.docs.length > 0 ? rewardsSnapshot.docs[0].data().reward_id + 1 : 1;

    // Add the new reward document to the Firestore collection
    await addDoc(collection(db, "rewards"), {
      reward_id: maxRewardId,       // Add incremented reward_id
      user_id: selectedUser,        // The user ID who earned the reward
      points_earned: pointsEarned,  // Points earned by the user
      earned_date: serverTimestamp(), // Timestamp of when the reward was earned
      points_redeemed: pointsToRedeem, // Points redeemed by the user
      reward_description: rewardDescription, // Description of the reward
      is_active: true,              // Reward is active by default when added
      redeemed_date: "N/A",        // Default to "N/A" before redemption
    });

    // Refresh the rewards list after adding the new reward
    fetchRewards();
  };

  // Handle approving the redemption of points for a reward
  const approveRedemption = async (rewardId, pointsEarned) => {
    // Prompt the user to enter the number of points to redeem
    const pointsToRedeem = prompt("Enter the number of points to redeem (must be greater than 0 and less than or equal to points earned):");

    const points = parseInt(pointsToRedeem);
    
    // Validate the entered points
    if (isNaN(points) || points <= 0 || points > pointsEarned) {
      alert("Invalid points. Please make sure points redeemed are greater than 0 and not more than points earned.");
      return;
    }

    // Get a reference to the reward document in Firestore
    const rewardRef = doc(db, "rewards", rewardId);

    // Determine if the redemption points match the earned points to deactivate
    const isActive = points !== pointsEarned;

    // Update the reward with redemption details and active status
    await updateDoc(rewardRef, {
      points_redeemed: points,       // Set the points redeemed
      redeemed_date: serverTimestamp(), // Set the timestamp for redemption
      is_active: isActive,           // Set active status based on redemption
    });

    // Refresh the rewards list after updating redemption
    fetchRewards();
  };

  // Calculate the number of unique users based on the rewards list
  const getNumberOfUniqueUsers = () => {
    // Extract all user_ids from the rewards array
    const userIds = rewards.map(reward => reward.user_id);
    
    // Create a Set from the user IDs to ensure uniqueness
    const uniqueUserIds = new Set(userIds);
    
    // Return the size of the Set (number of unique users)
    return uniqueUserIds.size;
  };

  return (
    <div style={containerStyle}>
      {/* Title Section */}
      <h1 style={titleStyle}>Rewards Oversight</h1>

      {/* User Input Section */}
      <div style={inputContainerStyle}>
        {/* Dropdown for selecting a user */}
        <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser} style={inputStyle}>
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.user_id}>
              {user.name || `User ${user.user_id}`}  {/* Display user name or user ID */}
            </option>
          ))}
        </select>

        {/* Input for entering points earned */}
        <input
          type="number"
          placeholder="Enter points earned"
          onChange={(e) => setPointsEarned(parseInt(e.target.value))}
          min="1"
          style={inputStyle}
        />

        {/* Input for entering reward description */}
        <input
          type="text"
          placeholder="Enter reward description"
          value={rewardDescription}
          onChange={(e) => setRewardDescription(e.target.value)}
          style={inputStyle}  // Ensure consistent styling
        />

        {/* Button to add the new reward */}
        <button onClick={addReward} style={addButtonStyle}>Add New Reward</button>
      </div>

      {/* Display the number of unique users in the loyalty program */}
      <div style={userCountStyle}>
        <p style={textStyle}>Number of participants in the loyalty program: {getNumberOfUniqueUsers()}</p>
      </div>

      {/* Rewards Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            {["Reward ID", "User ID", "Points Earned", "Earned Date", "Description", "Active", "Points Redeemed", "Redeemed Date", "Action"].map((header) => (
              <th key={header} style={tableHeaderStyle}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rewards.map((reward) => (
            <tr key={reward.id}>
              <td style={tableCellStyle}>{reward.reward_id}</td>
              <td style={tableCellStyle}>{reward.user_id}</td>
              <td style={tableCellStyle}>{reward.points_earned}</td>
              <td style={tableCellStyle}>{reward.earned_date?.toDate().toLocaleString()}</td>
              <td style={tableCellStyle}>{reward.reward_description}</td>
              <td style={tableCellStyle}>{reward.is_active ? "Yes" : "No"}</td>
              <td style={tableCellStyle}>{reward.points_redeemed}</td>
              <td style={tableCellStyle}>{reward.redeemed_date !== "N/A" ? reward.redeemed_date.toDate().toLocaleString() : "N/A"}</td>
              <td style={tableCellStyle}>
                {reward.redeemed_date === "N/A" && (
                  <button onClick={() => approveRedemption(reward.id, reward.points_earned)} style={approveButtonStyle}>
                    Approve Redemption
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Style objects
const containerStyle = {
  backgroundColor: "black",
  color: "white",
  padding: "20px",
  minHeight: "100vh",
};

const titleStyle = {
  color: "white",
  display: "flex",
  marginTop: "20px",
  marginLeft: "20px",
  textDecoration: "none",
};

const inputContainerStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "10px",
  marginTop: "40px",
  flexWrap: "wrap", 
};

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
};

const addButtonStyle = {
  marginTop: "10px",
  padding: "10px 20px",
  borderRadius: "5px",
  backgroundColor: "#228B22", 
  color: "black",
  border: "none",
  cursor: "pointer",
};

const approveButtonStyle = {
  marginTop: "10px",
  padding: "10px 20px",
  borderRadius: "5px",
  backgroundColor: "blue", 
  color: "white",
  border: "none",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  marginTop: "20px",
  borderCollapse: "collapse",
};

const tableHeaderStyle = {
  backgroundColor: "orange",  
  color: "black",
  padding: "10px",
  border: "1px solid white",
};

const tableCellStyle = {
  backgroundColor: "#333", 
  color: "white",
  padding: "8px",
  border: "1px solid white",
};

const userCountStyle = {
  marginTop: "20px",
};

const textStyle = {
  color: "white",
  fontSize: "18px",
};

export default RewardsPage; // Export the component for use in other parts of the app