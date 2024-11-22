"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/clientApp.ts";
import Link from 'next/link';

const Tickets = () => {
  // State for users
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ticket management states
  const [ticketlist, setTickets] = useState([]); // List of all tickets
  const [ticket_id, setID] = useState(""); 
  const [user_id, setUserID] = useState(""); //auto gen
  const [category, setCategory] = useState(""); // Ticket category
  const [status, setStatus] = useState(""); // Ticket status
  const [priority, setPriority] = useState(""); // Ticket priority level
  const [description, setDesc] = useState(""); // Ticket description
  const [internal_notes, setNotes] = useState(""); // Internal notes for ticket
  const [assigned_agent_id, setAssignedAgent] = useState(""); // Agent assigned to ticket
  const [updated_at, setUpdated] = useState(""); // Timestamp of last update
  const [total, setTotal] = useState(); // Total number of tickets

  // Fetch users and tickets 
  useEffect(() => {
    fetchUserandTicks();
  }, []);

  // Fetch all users and tickets from Firestore
  const fetchUserandTicks = async () => {
    setLoading(true); // Show loading state
    try {
      // Fetch users
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);

      // Fetch tickets
      const ticketCollection = collection(db, "tickets");
      const ticketQuery = query(ticketCollection, orderBy("ticket_id", "desc"));
      const querySnapshot = await getDocs(ticketQuery);

      const ticketData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(ticketData); // Update tickets state
      setTotal(ticketData.length); // Update total ticket count
    } catch (error) {
      console.error("Error fetching users and tickets:", error);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  // Submit a new ticket
  const submitTicket = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Check if required fields are filled
    if (
      category === "" ||
      status === "" ||
      priority === "" ||
      assigned_agent_id === ""
    ) {
      alert("Please complete all ticket inputs!");
      return;
    }

    setLoading(true);
    try {
      // Generate a new ticket ID
      const ticketCollection = collection(db, "tickets");
      const ticketQuery = query(ticketCollection, orderBy("ticket_id", "desc"));
      const ticketsSnapshot = await getDocs(ticketQuery);

      let newTicketId = 1; // Default ticket_id
      if (!ticketsSnapshot.empty) {
        const lastTick = ticketsSnapshot.docs[0].data();
        newTicketId = lastTick.ticket_id + 1; // Increment last ticket_id
      }

      // Generate a random user ID (placeholder logic)
      let newID = Math.floor(Math.random() * 10);

      // Add ticket to Firestore
      await addDoc(ticketCollection, {
        ticket_id: newTicketId,
        user_id: newID, // Placeholder value
        category,
        status,
        priority,
        description,
        internal_notes,
        assigned_agent_id,
        updated_at: new Date(),
      });

      alert("Ticket submitted!");

      // Add the new ticket to the current state
      setTickets([
        ...ticketlist,
        {
          ticket_id: newTicketId,
          user_id: newID,
          category,
          status,
          priority,
          description,
          internal_notes,
          assigned_agent_id,
          updated_at: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error submitting ticket: ", error);
      alert("Failed to submit ticket.");
    } finally {
      setLoading(false);
      fetchUserandTicks(); // Refresh ticket list
    }
  };

  // Update assigned agent for a ticket
  const updateAssignment = async (ticketObj, userid) => {
    setLoading(true);
    try {
      console.log("Ticket thingy:", ticketObj);
      const idref = ticketObj.id; // Firestore document ID
      console.log("doc ID:", idref);
      console.log("assigned user  ID:", userid);

      const assignref = parseInt(userid); // Ensure ID is an integer
      const ticketRef = doc(db, "tickets", idref);

      // Update Firestore document
      await updateDoc(ticketRef, {
        assigned_agent_id: assignref,
      });

      alert("Assignment updated!");
    } catch (error) {
      console.error("Error updating assignment: ", error);
      alert("Failed to update assignment.");
    } finally {
      setLoading(false);
      fetchUserandTicks(); // Refresh ticket list
    }
  };

  return (
    <div>
      <Link href="../" passHref>
          <button>Return to Dashboard</button>
        </Link>
      <h1>TICKET MANAGEMENT</h1>
      <h3>List of Available Users</h3>
      <ul className="card__list">
        {users.map((user) => (
          <li
            key={user.id}
            className="card__element dark-card flex flex-col items-center justify-between"
          >
            <p className="text-clr-light">User ID: {user.user_id}</p>
            <p className="text-clr-light">Contact Number: {user.contact_number}</p>
            <p className="text-clr-light">First Name: {user.first_name}</p>
          </li>
        ))}
      </ul>

      <h3>Create Tickets</h3>
      <div className="list">
        <form onSubmit={submitTicket} className="list__item">
          <div className="element list__stats">
            <label htmlFor="cat" className="tiny">
              Category:
              <select
                id="cat"
                required
                name="category_type"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Product Inquiry">Product Inquiry</option>
                <option value="General Question">General Question</option>
              </select>
            </label>
            <label htmlFor="stat" className="tiny">
              Status:
              <select
                id="stat"
                required
                name="stat_type"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="Open">Open</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </label>
            <label htmlFor="priority" className="tiny">
              Priority:
              <select
                id="priority"
                name="priority_type"
                required
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
          </div>

          <div className="element textinput">
            <label htmlFor="description">
              Description:
              <textarea
                id="description"
                description="desc"
                className="textbox"
                value={description}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </label>
            <label htmlFor="internal_notes">
              Internal Notes:
              <textarea
                id="internal_notes"
                description="notes"
                className="textbox"
                value={internal_notes}
                onChange={(e) => setNotes(e.target.value)}
                required
              />
            </label>
          </div>

          <label htmlFor="assignment" className="element">
            Assign this Ticket to:
            <select
              id="assignment"
              name="assignment_id"
              required
              value={assigned_agent_id}
              onChange={(e) => setAssignedAgent(e.target.value)}
            >
              <option value="">Select...</option>
              {users.map((user) => (
                <option key={user.id}>{user.user_id}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn">
            Submit Ticket
          </button>
        </form>
      </div>

      <h3>All Tickets</h3>
      <ul className="list">
        {ticketlist.map((tickets, index) => (
          <li key={index} className="list__item">
            <div className="element list__stats">
              <p className="tiny">Ticket Id: {tickets.ticket_id}</p>
              <p className="tiny">User submitted: {tickets.user_id}</p>
              <p className="tiny">Category: {tickets.category}</p>
              <p className="tiny">Status: {tickets.status}</p>
              <p className="tiny">Priority: {tickets.priority}</p>
            </div>
            <div className="element list__desc">
              <p>Description: {tickets.description}</p>
              <p>Internal Notes: {tickets.internal_notes}</p>
            </div>
            <form
              onSubmit={() => updateAssignment(tickets, assigned_agent_id)}
              className="element"
            >
              <label htmlFor="assignment" className="element">
                Assign this Ticket to:
                <select
                  id="assignment"
                  name="assignment_id"
                  required
                  value={assigned_agent_id}
                  onChange={(e) => setAssignedAgent(e.target.value)}
                >
                  <option value="">Select...</option>
                  {users.map((user) => (
                    <option key={user.id}>{user.user_id}</option>
                  ))}
                </select>
              </label>
              <button type="submit" className="btn">
                Assign Ticket
              </button>
            </form>
            <div className="element list__assignment">
              <p>Assigned Agent: {tickets.assigned_agent_id}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tickets;
