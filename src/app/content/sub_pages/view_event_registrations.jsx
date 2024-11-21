import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, getDoc, where } from 'firebase/firestore';
import { db } from "../../firebase/clientApp.ts";
import { FiEdit2, FiTrash2, FiEye, FiPlusSquare } from 'react-icons/fi';

const ViewEventRegistration = ({updateSelectedRegistration, eventToView }) => {
    const [registrations, setRegistrations] = useState([]);  
    
    const [selectedRegistration, setSelectedRegistration] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try{
                console.log(eventToView.event_id);
                const qreg = query(collection(db, 'registrations'),  where('event_id', '==', parseInt(eventToView.event_id))); 
                const regSnapshot = await getDocs(qreg);
                const registrationList = [];

                for(const regDoc of regSnapshot.docs){ 

                    const userRef = collection(db, "users");
                    const quser = query(userRef, where('user_id', '==', parseInt(regDoc.data().user_id)));
                    const queryUserSnapshot = await getDocs(quser);                    
                    const userData = !queryUserSnapshot.empty ? queryUserSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0] : {user_name: 'Unknown User'}; 

                    const eventRef = collection(db, "events");
                    const qevent = query(eventRef, where('event_id', '==', parseInt(regDoc.data().event_id)));
                    const queryEventSnapshot = await getDocs(qevent);                    
                    const eventData = !queryEventSnapshot.empty ? queryEventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0] : {event_name: 'Unknown Event', event_date:''}; 

                    registrationList.push({
                        id:regDoc.id,
                        ...regDoc.data(),
                        user_name: userData.first_name + " " + userData.last_name,
                        event_name: eventData.event_name,
                        event_date: eventData.event_date
                    })

                }

                setRegistrations(registrationList);
            }catch (error){
                console.error('Failed to fetch registrations', error);
            }
        };

        fetchData();
    }, []);


    // Function to handle deleting an Registration with confirmation 
    const handleDeleteRegistration = async (registrationId) => { 
        const isConfirmed = window.confirm('Are you sure you want to delete this event?'); 
        if (isConfirmed) { 
            const registrationRef = collection(db, "registrations");
            const q = query(registrationRef, where('registration_id', '==', registrationId));
            const queryScnapshot = await getDocs(q);

            if (!queryScnapshot.empty){
                queryScnapshot.forEach(async (docSnapshot) => {
                    const docRef = docSnapshot.ref;

                    try { 
                        await deleteDoc(docRef); 
                        setRegistrations(prevRegistrations => prevRegistrations.filter(registration => registration.registration_id !== registrationId)); 
                        alert(`Registration with ID ${registrationId} deleted successfully`);
                        console.log(`Registration with ID ${registrationId} deleted successfully`); 
                    } catch (error) { 
                        console.error("Error deleting Registration:", error); 
                    } 
                })
            }
        } 
    }; 

    // Function to handle fetching registration details by ID 
    const handleEditRegistration = async (registrationId) => { 
        try { 
            const q = query(collection(db,'registrations'), where('registration_id', '==', registrationId));
            const regSnpashot = await getDocs(q); 

            if (!regSnpashot.empty) { 
                const regDoc = regSnpashot.docs[0];
                setSelectedRegistration(regDoc.data()); 
                updateSelectedRegistration(regDoc.data()); 
                console.log("Registration details:", regDoc.data()); 
            } else { 
                console.log("No such document!");
            } 
        } catch (error) { 
            console.error("Error fetching Registration details:", error);
        } 
    };

    return (
        <div className="overflow-auto">

            <div className='p-4 flex justify-center space-x-6 text-white'>
                <div className='text-xl p-2' >
                    <strong>Event Id :</strong> {eventToView.event_id}
                </div>
                <div className='text-xl p-2' >
                    <strong>Event :</strong> {eventToView.event_name}
                </div>
                <div className=' text-xl p-2'> 
                    <strong>Date :</strong> {new Date(eventToView.event_date.seconds * 1000).toLocaleString()} 
                </div>
            </div>

            <table className="min-w-full bg-gray-700 text-white border">
                <thead className='bg-gray-800'> 
                    <tr>
                        <th className="py-2 px-4 border text-center">Registration ID</th>
                        <th className="py-2 px-4 border text-center">User ID</th>
                        <th className="py-2 px-4 border text-center">User Name</th>
                        <th className="py-2 px-4 border text-center">Registration Date</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {registrations.map(registration => (
                        <tr className = "hover:border-slate-300 hover:text-black hover:border-2 hover:shadow hover:bg-violet-100 hover:font-semibold" key={registration.id}>
                            <td className="py-2 px-4 border text-center w-1/12">{registration.registration_id}</td>
                            <td className="py-2 px-4 border text-center w-1/12">{registration.user_id}</td>
                            <td className="py-2 px-4 border text-center w-1/12">{registration.user_name}</td>
                            <td className="py-2 px-4 border text-center w-1/12">{new Date(registration.registration_date.seconds * 1000).toLocaleString()}</td>
                            <td className="py-2 px-4 border w-2/12 text-center align-middle">
                                <div className="flex justify-center items-center space-x-8">
                                    <button className="text-white shadow-2xl w-16 h-16 rounded-full bg-[#d4d445] hover:bg-[#c3b549] flex justify-center items-center" onClick={ () => handleEditRegistration(registration.registration_id) }>
                                    <FiEdit2 size={30} />
                                    </button>
                                    
                                    <button className="text-black shadow-2xl w-16 h-16 rounded-full bg-[#f36c73] hover:bg-[#90474c] flex justify-center items-center" onClick={ () => handleDeleteRegistration(registration.registration_id) } >
                                    <FiTrash2 size={30} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
      );
};
    
    export default ViewEventRegistration;