
import React, { useState, useEffect } from 'react';
import { db } from "../../firebase/clientApp.ts";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import GetHighestEventId from './getHighestEventId.jsx';

const CreateEventForm = ({updateState}) => {
  const [highestEventId, setHighestEventId] = useState(null); 
  useEffect(() => { 
    const fetchHighestEventId = async () => { 
      const id = await GetHighestEventId(); 
      setHighestEventId(id); 
      //console.log("highest_id: "+id);
    };       
    fetchHighestEventId(); 
  }, []);

  const [form, setForm] = useState({
    event_name: '',
    description: '',
    event_date: '',
    created_by: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const clearForm = () =>{
    setForm({
      event_name: '',
      description: '',
      event_date: '',
      created_by: ''
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'events'), {
        ...form,
        event_id: Number(highestEventId) + 1,
        event_date: new Date(form.event_date),
        created_at: serverTimestamp()
      });
      alert('Event added successfully!');
      setForm({
        event_name: '',
        description: '',
        event_date: '',
        created_by: ''
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to add event.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-screen h-fit space-y-8 p-14 border rounded">

      <div className='font-bold, text-center text-4xl'>Event Creation Form</div>

      <button className=' absolute right-14 top-0 font-bold text-2xl hover:font-extrabold hover:text-3xl' onClick={()=>updateState('nothing')}>X</button>

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
          type="datetime-local"
          name="event_date"
          value={form.event_date}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Created By</label>
        <input
          name="created_by"
          value={form.created_by}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
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

export default CreateEventForm;
