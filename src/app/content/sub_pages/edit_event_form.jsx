
import React, { useState, useEffect } from 'react';
import { db } from "../../firebase/clientApp.ts";
import { collection, updateDoc, where, query, serverTimestamp, getDocs, Timestamp } from 'firebase/firestore';

const EditEventForm = ({updateSelectedEvent, event}) => {
  
  const [form, setForm] = useState({
    event_id: event.event_id,
    event_name: event.event_name,
    description: event.description,
    event_date: event.event_date,
    created_by: event.created_by,
    created_at: event.created_at
  });

  const formatDateTimeLocal = (date) => { 
    const pad = (num) => (num < 10 ? '0' + num : num); 
    const year = date.getFullYear(); 
    const month = pad(date.getMonth() + 1); 
    const day = pad(date.getDate()); 
    const hours = pad(date.getHours()); 
    const minutes = pad(date.getMinutes()); 

    return `${year}-${month}-${day}T${hours}:${minutes}`;

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleChangeDate = (e) => {
    const { name, value } = e.target;
    const date = new Date(value);
    const timestamp = Timestamp.fromDate(date);
    setForm({ ...form, [name]: timestamp });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const contentRef = collection(db, "events");
    const q = query(contentRef, where('event_id', '==', event.event_id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty){
      querySnapshot.forEach(async (docSnapshot) => {
        const docRef = docSnapshot.ref;

        try {
          await updateDoc(docRef, {
            ...form,        
            updated_at: serverTimestamp()
          });

          alert('Event edited successfully!');      

          setForm({
            event_id:'',
            event_name: '',
            description: '',
            event_date: '',
            created_by: '',
            created_at:''
          });

          updateSelectedEvent(null);

        } catch (error) {
          console.error('Error editing document: ', error);
          alert('Failed to edit event.');
        }
      })
    }else{
      console.log('No document found with the specified event_id' + event.event_id);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="w-screen h-fit space-y-8 p-14 border rounded">

      <div className='font-bold, text-center text-4xl'>Event Editing Form</div>

      <button className=' absolute right-14 top-0 font-bold text-2xl hover:font-extrabold hover:text-3xl' onClick={()=>updateSelectedEvent(null)}>X</button>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Event Id</label>
        <input
          type="number"
          name="event_id"
          value={form.event_id}
          onChange={handleChange}
          readOnly
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700">Event Name</label>
        <input
          type="text"
          name="event_name"
          value={form.event_name}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full min-h-44 p-2 border border-gray-300 rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Event Date</label>
        <input
          type='datetime-local'
          name="event_date"
          value={formatDateTimeLocal(form.event_date.toDate())}
          onChange={handleChangeDate}
          
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Created By</label>
        <input
          name="created_by"
          value={form.created_by}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Creation Date</label>
        <input
          type="datetime-local"
          name="created_at"
          value={formatDateTimeLocal(form.created_at.toDate())}
          onChange={handleChangeDate}
          readOnly
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md" /> 
      </div>

      <div className='flex justify-center items-center space-x-14'>
        <button
            onClick={()=>updateSelectedEvent(null)}
            className="w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-700 font-semibold" >
            Discard and Exit
        </button>
        <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 font-semibold">
            Submit Change
        </button>
        
      </div>
    </form>
  );
};

export default EditEventForm;
