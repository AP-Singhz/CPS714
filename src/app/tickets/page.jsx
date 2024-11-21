"use client";
import { useEffect, useState, FormEvent } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/clientApp.ts";



const Tickets = () => {
  //would be greate to create a reusable component but for now thisll work.
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  //ticket management stuff
  /*
• ticket_id (PK) - INT, Auto Increment 
• user_id (FK) - INT, References user(user_id) 
• category - ENUM ('Technical Support', 'Product Inquiry', 'General Question') 
• status - ENUM ('Open', 'In-Progress', 'Resolved', 'Closed') 
• priority - ENUM ('Low', 'Medium', 'High') 
• description – TEXT 
• internal_notes - TEXT 
• assigned_agent_id (FK) - INT, Nullable, References user(user_id) for support agents • created_at - TIMESTAMP, Default Current Timestamp 
• updated_at - TIMESTAMP, On Update Current Timestamp 
*/

//state value, then function to update value
  const [ticketlist, setTickets] = useState([]);
  const [ticket_id, setID] = useState("");
  const [user_id, setUserID] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDesc] = useState("");
  const [internal_notes, setNotes] = useState("");
  const [assigned_agent_id, setAssignedAgent] = useState("");
  const [updated_at, setUpdated] = useState("");
  const [total, setTotal] = useState();


  useEffect(() => {
    const fetchUserandTicks = async () => {
      setLoading(true);
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);

        const ticketCollection = collection(db, 'tickets');
        const ticketQuery = query(ticketCollection, orderBy('ticket_id', 'desc'));
        const querySnapshot = await getDocs(ticketQuery);
        //const querySnapshot = await query(ticketCollection, orderBy('ticket_id', 'desc'));
        const ticketData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTickets(ticketData);

        const total = ticketData.length;
        setTotal(total);
        


      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserandTicks();

  }, []);



  const updateAssignment = async (e) => {
    try {
      const ticketDoc = doc(db, 'tickets', ticket_id);
      await updateDoc(ticketDoc, { assignment_id });
      alert('Feedback classified successfully!');
      setTickets(ticketlist.map(tickets => 
        tickets.ticket_id === ticket_id ? { ...tickets, assignment_id} : tickets
      ));
    } catch (error) {
      console.error('Error classifying feedback: ', error);
      alert('Failed to classify feedback.');
    }
  }

  const submitTicket = async (e) => {
    e.preventDefault();

    if ((category === "") || (status === "") || (priority === "") || (assigned_agent_id === "")) {
      alert("Please complete all ticket inputs!");
      return;
    }

    setLoading(true);
    try {
        const ticketCollection = collection(db, "tickets");
        const ticketQuery = query(ticketCollection, orderBy("ticket_id", "desc"), limit(1));
        const ticketsSnapshot = await getDocs(ticketQuery);

        let newTicketId = 1; // Default user_id is 1
        if (!ticketsSnapshot.empty) {
          const lastTick = ticketsSnapshot.docs[0].data();
          newTicketId = lastTick.ticket_id + 1; // Increment the highest user_id by 1
        }


      let newID = Math.floor(Math.random() * 10);
      const docRef = await addDoc(ticketCollection, {
        ticket_id: newTicketId,
        user_id: newID, // yeah..
        category,
        status,
        priority,
        description,
        internal_notes,
        assigned_agent_id,
        updated_at: new Date()
      });
      alert('Ticket submitted!');
    /*
• ticket_id (PK) - INT, Auto Increment 
• user_id (FK) - INT, References user(user_id) 
• category - ENUM ('Technical Support', 'Product Inquiry', 'General Question') 
• status - ENUM ('Open', 'In-Progress', 'Resolved', 'Closed') 
• priority - ENUM ('Low', 'Medium', 'High') 
• description – TEXT 
• internal_notes - TEXT 
• assigned_agent_id (FK) - INT, Nullable, References user(user_id) for support agents • created_at - TIMESTAMP, Default Current Timestamp 
• updated_at - TIMESTAMP, On Update Current Timestamp 
*/
      setTickets([...ticketlist, {
        ticket_id: newTicketId,
        user_id: newID, // yeah..
        category,
        status,
        priority,
        description,
        internal_notes,
        assigned_agent_id,
        updated_at: new Date()
      }]);

    } catch (error) {
      console.error('Error submitting ticket: ', error);
      alert('Failed to submit ticket.');
    } finally {
      setLoading(false);
    }
    e.preventDefault();
  };

  return (
    <div><h1> TICKET MANAGEMENT
      </h1>

<h3>List of Available Users</h3>
<ul className="card__list">
  {users.map((user) => (
    <li key={user.id} className="card__element dark-card flex flex-col items-center justify-between">
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
            <select id = "cat" required name="category_type" 
            value={category}
            onChange={(e) => setCategory(e.target.value)} 
             >
              <option value=""> Select....</option>
              <option value ="Technical Support"> Technical Support</option>
              <option value ="Product Inquiry"> Product Inquiry</option>
              <option value ="General Question"> General Question </option>
            </select>
        </label>
        <label htmlFor="stat" className="tiny" > 
            Status:
            <select id = "stat" required name="stat_type" 
            value={status}
            onChange={(e) => setStatus(e.target.value)} 
             >
              <option value=""> Select....</option>
              <option value="Open"> Open</option>
              <option value="In-Progress"> In-Progress</option>
              <option value="Resolved"> Resolved </option>
              <option value="Closed"> Closed </option>
            </select>
        </label>
        <label htmlFor="priority" className="tiny" > 
            Priority:
            <select id = "priority" name="priority_type"  required
            value={priority}
            onChange={(e) => setPriority(e.target.value)} 
            >
              <option value=""> Select....</option>
              <option value="Low"> Low</option>
              <option value="Medium"> Medium</option>
              <option value="High"> High </option>
            </select>
        </label>
    </div>
    

    <div className="element textinput">
      <label htmlFor= "description">
                Description:
                <textarea  id="description" description="desc" className="textbox"
                value={description}
                onChange={(e) => setDesc(e.target.value)} 
                required/>
          </label>
      <label htmlFor ="internal_notes">
            Internal Notes:
            <textarea  id="internal_notes" description="notes" className="textbox"
            value={internal_notes}
            onChange={(e) => setNotes(e.target.value)} 
            required/>
      </label>
    </div>
    

    <label htmlFor="assignment" className="element" > 
        Assign this Ticket to:
        <select id = "assignment" name="assignment_id"  required
        value={assigned_agent_id}
        onChange={(e) => setAssignedAgent(e.target.value)} 
        >
          <option value=""> Select....</option>
        {users.map((user) => (
            <option key={user.id}>
              {user.user_id}: {user.first_name}
            </option>
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
          <p className="">Description: {tickets.description}</p>
          <p className="">Internal Notes: {tickets.internal_notes}</p>
        </div>
  <form onSubmit={updateAssignment} className="element"> 
      <label htmlFor="assignment" className="element" > 
            Assign this Ticket to:
            <select id = "assignment" name="assignment_id"  required
            value={assigned_agent_id}
            onChange={(e) => setAssignedAgent(e.target.value)} 
            >
              <option value=""> Select....</option>
            {users.map((user) => (
                <option key={user.id}>
                  {user.user_id}: {user.first_name}
                </option>
              ))}
            </select>
        </label>

        <input type="checkbox" value={tickets.ticket_id} onChange={(e) => setID(e.target.value)} required></input>
        <button type="submit" className="btn"> Assign Ticket</button>
  </form>
      

        <div className="element list__assignment">
          <p className="">Assigned Agent: {tickets.assigned_agent_id}</p>
        </div>
        
        

    </li>
  ))}
</ul>



    </div>
    

  )
}


export default Tickets;
/* <ul>
  {ticketlist.map((tickets) => (
    <li key={tickets.id} className="">
        <p className="">Ticket Id: {tickets.ticket_id}</p>
        <p className="">User submitted: {tickets.user_id}</p>
        <p className="">Category: {tickets.cateogory}</p>
        <p className="">Status: {tickets.status}</p>
        <p className="">Priority: {tickets.priority}</p>
        <p className="">Description: {tickets.description}</p>
        <p className="">Internal Notes: {tickets.internal_notes}</p>
        <p className="">Assigned Agent: {tickets.assigned_agent_id}</p>
        

    </li>
  ))}
</ul> */