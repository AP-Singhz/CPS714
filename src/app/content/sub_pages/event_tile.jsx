import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, getDoc, where } from 'firebase/firestore';
import { db } from "../../firebase/clientApp.ts";
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

export function Event_tile({updateSelected, setViewEventRegistration, isnew}){
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

    return(
        <div className=" flex justify-center space-x-6 ">
            {events.map(item => (
            <div key={item.event_id} className=" bg-white  hover:text-[#53d183] hover:border hover:border-violet-500 hover:shadow-xl hover:shadow-violet-500 shadow-md rounded-tr-[32]  max-w-sm">
                <div className="relative bg-gray-200 h-48 w-96 flex justify-center items-center">
                    <div>
                        {item.imageUrl ? ( 
                            <img src={item.imageUrl} alt={item.event_name} className="h-full w-full object-cover" /> 
                        ) : ( 
                            <span className="text-gray-500">Image Placeholder</span> 
                        )}
                    </div>

                    {isnew === "true" &&(
                    <div className="absolute top-0 right-0 w-24 h-12 bg-blue-700 bg-opacity-70 rounded-bl-[24] flex justify-center items-center text-white font-medium">
                        New!
                    </div>
                    )}
                    <div className="absolute w-full flex justify-between mt-6">
                        <div></div>

                        <button className="text-white shadow-2xl w-20 h-20 rounded-full bg-[#7a716f] hover:bg-[#625b59] flex justify-center items-center"  onClick={ () => handleViewEventRegistrations(item.event_id) }>
                        <FiEye size={50} />
                        </button>

                        <button className="text-white shadow-2xl w-20 h-20 rounded-full bg-[#dbdb4f] hover:bg-[#c2c27d] flex justify-center items-center" onClick={ () => handleEditEvent(item.event_id) }>
                        <FiEdit2 size={50} />
                        </button>

                        <button className="text-black shadow-2xl w-20 h-20 rounded-full bg-[#f36c73] hover:bg-[#90474c] flex justify-center items-center" onClick={ () => handleDeleteEvent(item.event_id) }>
                        <FiTrash2 size={50} />
                        </button>

                        <div></div>
                    </div>
                </div>
                <div className="p-4"> 
                    <h3 className="text-xl font-semibold">{item.event_name}</h3>                 
                </div>
                
            </div>
        ))}
        </div>
    );
}