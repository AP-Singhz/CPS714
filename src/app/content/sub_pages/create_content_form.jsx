
import React, { useState, useEffect } from 'react';
import { db } from "../../firebase/clientApp.ts";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import GetHighestContentId from './getHighestContentId.jsx';



const CreateContentForm = ({updateState}) => {
  
  const [highestContentId, setHighestContentId] = useState(null); 
  useEffect(() => { 
    const fetchHighestContentId = async () => { 
      const id = await GetHighestContentId(); 
      setHighestContentId(id); 
      //console.log("highest_id: "+id);
    };       
    fetchHighestContentId(); 
  }, []);

  

  const [form, setForm] = useState({
    title: '',
    content_type: 'Article',
    content: '',
    created_by: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const clearForm = () =>{
    setForm({
      title: '',
      content_type: 'Article',
      content: '',
      created_by: ''});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'contents'), {
        ...form,
        content_id: Number(highestContentId) + 1,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      alert('Content added successfully!');
      setForm({
        title: '',
        content_type: 'Article',
        content: '',
        created_by: ''
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to add content.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className=" w-screen h-fit space-y-8 p-14 border rounded ">
        
      <div className='font-bold, text-center text-4xl'>Content Creation Form</div>
      
      <button className=' absolute right-14 top-0 font-bold text-2xl hover:font-extrabold hover:text-3xl' onClick={()=>updateState('nothing')}>X</button>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Content Type</label>
        <select
          name="content_type"
          value={form.content_type}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"  >
          <option value="Article">Article</option>
          <option value="Tutorial">Tutorial</option>
          <option value="Video">Video</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Content</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          required
          className="mt-1 block w-full min-h-44 p-2 border border-gray-300 rounded-md" />
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

export default CreateContentForm;
