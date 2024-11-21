
import React, { useState, useEffect } from 'react';
import { db } from "../../firebase/clientApp.ts";
import { collection, addDoc, doc, where, query, getDocs, serverTimestamp } from 'firebase/firestore';
import GetHighestRegistrationId from './getHighestRegistrationId.jsx';

const CreateRegistrationForm = ({updateState}) => {

    const [highestregistrationId, setHighestRegistrationId] = useState(null); 

    useEffect(() => { 
        const fetchHighestRegistrationId = async () => { 
            const id = await GetHighestRegistrationId(); 
            setHighestRegistrationId(id); 
        };       

        fetchHighestRegistrationId(); 
    }, []);

    const [form, setForm] = useState({
        registration_id: '',
        user_id: '',
        event_id: '',
        registration_date: ''
    });

    const [user, setUser] = useState({first_name: '', last_name: ''});
    const [event, setEvent] = useState({event_name: '', event_date: ''});


    const handleEventIdChange = async (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: parseInt(value) });

        if (name === 'event_id' && value !== '') {
            try{

                const eventRef = collection(db, "events");
                const qevent = query(eventRef, where('event_id', '==', parseInt(value)));
                const queryEventSnapshot = await getDocs(qevent);       

                const eventData = !queryEventSnapshot.empty ? queryEventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0] : {event_name: 'Unknown User', event_date:''}; 
                
                setEvent({event_name: eventData.event_name, event_date: eventData.event_date});

            }catch (error){
                console.error('Error fetching event data:', error); 
                setUser({ first_name: 'Error', last_name: 'Occurred' });
            }
        }else{
            setEvent({event_name: '', event_date: ''});
        }

    };

    const handleUserIdChange = async (e) => {
        const { name, value } = e.target;

        setForm({ ...form, [name]: parseInt(value) });

        if (name === 'user_id' && value !== '') {
            try{
                const userRef = collection(db, "users");
                const quser = query(userRef, where('user_id', '==', parseInt(value)));
                const queryUserSnapshot = await getDocs(quser);   
                    
                const userData = !queryUserSnapshot.empty ? queryUserSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0] : {first_name: 'Unknown', last_name: 'User'}; 

                setUser({ first_name: userData.first_name, last_name: userData.last_name });

            }catch (error){
                console.error('Error fetching user data:', error); 
                setUser({ first_name: 'Error', last_name: 'Occurred' });
            }
        }else{
            setUser({ first_name: '', last_name: '' });
        }
    };

    const clearForm = () =>{
        setForm({
            registration_id: '',
            user_id: '',
            event_id: '',
            registration_date: ''
        });
        setUser({first_name: '', last_name: ''});
        setEvent({event_name: '', event_date:''});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, 'registrations'), {
            ...form,
            registration_id: Number(highestregistrationId) + 1,
            registration_date: serverTimestamp()
            });

            alert('registration created successfully!');

            clearForm();

        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Failed to create new registration.');
        }
    };

    const formatDateTimeLocal = (date) => { 
        const pad = (num) => (num < 10 ? '0' + num : num); 
        const year = date.getFullYear(); 
        const month = pad(date.getMonth() + 1); 
        const day = pad(date.getDate()); 
        const hours = pad(date.getHours()); 
        const minutes = pad(date.getMinutes()); 

        return `${year}-${month}-${day}T${hours}:${minutes}`;

    };

  return (
    <form onSubmit={handleSubmit} className="w-screen h-fit text-white space-y-8 p-14 border rounded">

        <div className='font-bold text-blue-400 text-center text-4xl'>Event Registration Creation Form</div>

        <button className=' absolute right-14 top-0 font-bold text-2xl hover:font-extrabold hover:text-3xl' onClick={()=>updateState('nothing')}>X</button>

        <div className='border text-white p-4 border-spacing-0 space-y-2'> 
            <div className='flex justify-center items-center text-xl font-semibold'>Event Info</div>
            <div> 
                <label className="block text-l font-semibold text-white">Event ID</label>
                <input
                    type="number"
                    name="event_id"
                    value={form.event_id}
                    onChange={handleEventIdChange}
                    required
                    className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md" />
            </div>

            <div>
                <label className="block text-l font-semibold text-white">Event Name (readOnly)</label>
                <input
                    type="text"
                    name="event_name"
                    value={event.event_name}
                    readOnly
                    className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md" />
            </div>

            {event.event_date !=='' && (
                <div>
                    <label className="block text-l font-semibold text-white">Event Date (readOnly)</label>
                    <input
                        type="datetime-local"
                        name="event_date"
                        value={formatDateTimeLocal(event.event_date.toDate())}
                        readOnly
                        className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md" />
                </div>
            )}
            {event.event_date == '' && (
                <div>
                    <label className="block text-l font-semibold text-white">Event Date (readOnly)</label>
                    <input                        
                        name="event_date"
                        value={form.event_id ? 'N/A' : ''}
                        readOnly
                        className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md" />
                </div>
            )}

        </div>

        <div className='border p-4 border-spacing-0 space-y-2'>
            <div className='flex justify-center items-center text-white text-xl font-semibold'>User Info</div>
            <div>
                <label className="block text-l font-semibold text-white">User ID</label>
                <input
                    type="number"
                    name="user_id"
                    value={form.user_id}
                    onChange={handleUserIdChange}
                    required
                    className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md" />
            </div>

            <div>
                <label className="block text-sm font-semibold text-white">User First Name (readOnly)</label>
                <input
                    type="text"
                    name="first_name"
                    value={user.first_name}
                    readOnly
                    className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md" />
            </div>

            <div>
                <label className="block text-sm font-semibold text-white">User Last Name (readOnly)</label>
                <input
                    type="text"
                    name="Last_name"
                    value={user.last_name}
                    readOnly
                    className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md" />
            </div>
        </div>

        <div className='flex justify-center items-center space-x-14'>
        <button
            onClick={()=>updateState('nothing')}
            className="w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-700 font-semibold" >
            Discard and Exit
        </button>
        <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 font-semibold">
            Submit/Save
        </button>
        <button
            onClick={clearForm}
            className="w-full p-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 font-semibold" >
            Clear Form
        </button>
      </div>
    </form>
  );
};

export default CreateRegistrationForm;
