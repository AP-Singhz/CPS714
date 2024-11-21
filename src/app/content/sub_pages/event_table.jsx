
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, getDoc, where } from 'firebase/firestore';
import { db } from "../../firebase/clientApp.ts";
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

const EventTable = ({updateSelected, setViewEventRegistration, collapsed}) => {
    const [events, setEvents] = useState([]);  
    
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const q = query(collection(db, 'events'), orderBy('event_id', 'desc')); 
            const querySnapshot = await getDocs(q);
            const eventList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(eventList);
        };

        fetchData();
    }, []);


    // Function to handle deleting an event with confirmation 
    const handleDeleteEvent = async (eventId) => { 
        const isConfirmed = window.confirm('Are you sure you want to delete this event?'); 
        if (isConfirmed) { 
            const eventRef = collection(db, "events");
            const q = query(eventRef, where('event_id', '==', eventId));
            const queryScnapshot = await getDocs(q);

            if (!queryScnapshot.empty){
                queryScnapshot.forEach(async (docSnapshot) => {
                    const docRef = docSnapshot.ref;

                    try { 
                        await deleteDoc(docRef); 
                        setEvents(prevEvents => prevEvents.filter(event => event.event_id !== eventId)); 
                        alert(`Event with ID ${eventId} deleted successfully`);
                        console.log(`Event with ID ${eventId} deleted successfully`); 
                    } catch (error) { 
                        console.error("Error deleting event:", error); 
                    } 
                })
            }
        } 
    }; 

    // Function to handle fetching event details by ID 
    const handleEditEvent = async (eventId) => { 
        try { 
            const q = query(collection(db,'events'), where('event_id', '==', eventId));
            const eventSnpashot = await getDocs(q); 
            
            if (!eventSnpashot.empty) { 
                const eventDoc = eventSnpashot.docs[0];
                setSelectedEvent(eventDoc.data()); 
                updateSelected(eventDoc.data());
                console.log("Event details:", eventDoc.data()); 
            } else { 
                console.log("No such document with id:" + eventId);
            } 
        } catch (error) { 
            console.error("Error fetching event details:", error);
        } 
    };

    const handleViewEventRegistrations = async (eventId) => { 
        try { 
            const q = query(collection(db,'events'), where('event_id', '==', eventId));
            const eventSnpashot = await getDocs(q); 
            
            if (!eventSnpashot.empty) { 
                const eventDoc = eventSnpashot.docs[0];
                setSelectedEvent(eventDoc.data()); 
                updateSelected(eventDoc.data());
                setViewEventRegistration("Yes");
                console.log("Event details:", eventDoc.data()); 
            } else { 
                console.log("No such document with id:" + eventId);
            } 
        } catch (error) { 
            console.error("Error fetching event details:", error);
        } 
    };

  return (
    <div className="pt-2 overflow-auto text-white">
      <table className="min-w-full bg-gray-700 border">
        <thead className='bg-gray-800'>
          <tr>
            <th className="py-2 px-4 border text-center">Event ID</th>
            <th className="py-2 px-4 border">Event Name</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border text-center">Event Date</th>
            <th className="py-2 px-4 border text-center">Created By</th>
            <th className="py-2 px-4 border text-center">Created At</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        
        {collapsed === "No" && (
            <tbody>
                {events.map(event => (
                    <tr className = "hover:border-slate-300 hover:text-black hover:border-2 hover:shadow hover:bg-violet-100 hover:font-semibold" key={event.id}>
                        <td className="py-2 px-4 border text-center w-1/12">{event.event_id}</td>
                        <td className="py-2 px-4 border w-1/12">{event.event_name}</td>
                        <td className="py-2 px-4 border overflow-hidden w-4/12">{event.description}</td>
                        <td className="py-2 px-4 border text-center w-1/12">{new Date(event.event_date.seconds * 1000).toLocaleString()}</td>
                        <td className="py-2 px-4 border text-center w-1/12">{event.created_by}</td>
                        <td className="py-2 px-4 border text-center w-1/12">{new Date(event.created_at.seconds * 1000).toLocaleString()}</td>
                        <td className="py-2 px-4 border w-3-/12 text-center align-middle">
                            <div className="flex justify-center items-center space-x-8">
                                <button className="text-white shadow-2xl w-16 h-16 rounded-full bg-[#7a716f] hover:bg-[#625b59] flex justify-center items-center" onClick={ () =>  handleViewEventRegistrations(event.event_id) }>
                                <FiEye size={30} />
                                </button>
                                <button className="text-white shadow-2xl w-16 h-16 rounded-full bg-[#dbdb4f] hover:bg-[#c2c27d] flex justify-center items-center" onClick={ () => handleEditEvent(event.event_id) } >
                                <FiEdit2 size={30} />
                                </button>
                                <button className="text-black shadow-2xl w-16 h-16 rounded-full bg-[#f36c73] hover:bg-[#90474c] flex justify-center items-center" onClick={ () => handleDeleteEvent(event.event_id) } >
                                <FiTrash2 size={30} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        )}
        
      </table>
    </div>
  );
};

export default EventTable;
