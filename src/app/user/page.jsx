"use client";
import { useEffect, useState, FormEvent } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/clientApp.ts";
import Link from 'next/link';


const Users = () => {
  const [users, setUsers] = useState([]);
  const [newEmail, setNewEmail] = useState(""); // Email only
  const [newContactNumber, setNewContactNumber] = useState(""); // New field for contact number
  const [newFirstName, setNewFirstName] = useState(""); // New field for first name
  const [newLastName, setNewLastName] = useState(""); // New field for last name
  const [newPreferences, setNewPreferences] = useState(""); // New field for preferences
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (newEmail.trim()) { // Only checking email
      setLoading(true);
      try {
        // Query to get the highest user_id in the database
        const usersCollection = collection(db, "users");
        const usersQuery = query(usersCollection, orderBy("user_id", "desc"), limit(1));
        const usersSnapshot = await getDocs(usersQuery);

        let newUserId = 1; // Default user_id is 1
        if (!usersSnapshot.empty) {
          const lastUser = usersSnapshot.docs[0].data();
          newUserId = lastUser.user_id + 1; // Increment the highest user_id by 1
        }

        // Add new user with the new fields
        const docRef = await addDoc(usersCollection, {
          email: newEmail,
          contact_number: newContactNumber,
          first_name: newFirstName,
          last_name: newLastName,
          preferences: newPreferences,
          profile_id: newUserId, // Profile ID
          user_id: newUserId, // Custom user ID
          created_at: new Date(),
          updated_at: new Date(),
        });

        setUsers([...users, {
          id: docRef.id,
          email: newEmail,
          contact_number: newContactNumber,
          first_name: newFirstName,
          last_name: newLastName,
          preferences: newPreferences,
          profile_id: newUserId,
          user_id: newUserId,
          created_at: new Date(),
          updated_at: new Date(),
        }]);

        setNewEmail("");
        setNewContactNumber("");
        setNewFirstName("");
        setNewLastName("");
        setNewPreferences("");
      } catch (error) {
        console.error("Error adding user:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setNewEmail(user.email);
    setNewContactNumber(user.contact_number || "");
    setNewFirstName(user.first_name || "");
    setNewLastName(user.last_name || "");
    setNewPreferences(user.preferences || "");
    setEditingUser(user);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (newEmail.trim() && editingUser) {
      setLoading(true);
      try {
        const userRef = doc(db, "users", editingUser.id);
        await updateDoc(userRef, {
          email: newEmail,
          contact_number: newContactNumber,
          first_name: newFirstName,
          last_name: newLastName,
          preferences: newPreferences,
          updated_at: new Date(), // Update the timestamp when updating
        });

        setUsers(users.map((user) => (user.id === editingUser.id
          ? { ...user, email: newEmail, contact_number: newContactNumber, first_name: newFirstName, last_name: newLastName, preferences: newPreferences, updated_at: new Date() }
          : user
        )));

        setNewEmail("");
        setNewContactNumber("");
        setNewFirstName("");
        setNewLastName("");
        setNewPreferences("");
        setEditingUser(null);
      } catch (error) {
        console.error("Error updating user:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ backgroundColor: 'black', color: 'white', padding: '10px', minHeight: '100vh' }}>
      <h1 className="text-4xl font-bold text-clr-light mb-4">User Management</h1>
      <div>
        <Link href="../" passHref>
          <button className="backbutton hover:text-sky-700">BACK TO ADMIN DASHBOARD</button>
        </Link>
      </div>
      <div className="card-container">
        <ul className="card__list">
          {users.map((user) => (
            <li key={user.id} className="card__element dark-card flex flex-col items-center justify-between">
              <p className="text-clr-light">Email: {user.email}</p>
              <p className="text-clr-light">User ID: {user.user_id}</p>
              <p className="text-clr-light">Contact Number: {user.contact_number}</p>
              <p className="text-clr-light">First Name: {user.first_name}</p>
              <p className="text-clr-light">Last Name: {user.last_name}</p>
              <p className="text-clr-light">Preferences: {user.preferences}</p>
              <div style={{alignContent: "center"}}>
                <button
                  className="edit-btn"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form
          className="form-container bg-clr-darkneon rounded-lg shadow-lg p-6 flex flex-col gap-4 items-center"
          style={{alignItems: "center"}}
          onSubmit={editingUser ? handleUpdateUser : handleAddUser}
        >
          <input
            type="email"
            placeholder="Enter email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Enter contact number"
            value={newContactNumber}
            onChange={(e) => setNewContactNumber(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Enter first name"
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Enter last name"
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Enter preferences"
            value={newPreferences}
            onChange={(e) => setNewPreferences(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="btn">
            {editingUser ? "Update User" : "Add User"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Users;
