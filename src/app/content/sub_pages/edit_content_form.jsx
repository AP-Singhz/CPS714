
import React, { useState, useEffect } from 'react';
import { db } from "../../firebase/clientApp.ts";
import { collection, updateDoc, where, query, serverTimestamp, getDocs } from 'firebase/firestore';



const EditContentForm = ({updateSelectedContent, content}) => {
  
  const [form, setForm] = useState({
    content_id: content.content_id,
    title: content.title,
    content_type: content.content_type,
    content: content.content,
    created_by: content.created_by,
    created_at: content.created_at,
    updated_at: content.updated_at
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

    const contentRef = collection(db, "contents");
    const q = query(contentRef, where('content_id', '==', content.content_id));
    const queryScnapshot = await getDocs(q);

    if (!queryScnapshot.empty){
      queryScnapshot.forEach(async (docSnapshot) => {
        const docRef = docSnapshot.ref;

        try {
          await updateDoc(docRef, {
            ...form,
            updated_at: serverTimestamp()
          });

          alert('Content Edited successfully!');
    
          setForm({
            content_id: '',
            title: '',
            content_type:  '',
            content:  '',
            created_by:  '',
            created_at:  '',
            updated_at: ''
          });
    
          updateSelectedContent(null);
    
        } catch (error) {
          console.error('Error editing document: ', error);
          alert('Failed to edit content.');
        }

      })
    }else{
      console.log('No document found with the specified content_id' + content.content_id);
    }   
  };

  return (
    <form onSubmit={handleUpdate} className=" w-screen h-fit space-y-8 p-14 border rounded ">
        
      <div className='font-bold, text-center text-4xl'>Content Editing Form</div>
      
      <button className=' absolute right-14 top-0 font-bold text-2xl hover:font-extrabold hover:text-3xl' onClick={()=>updateSelectedContent(null)}>X</button>      

      <div>
        <label className="block text-sm font-semibold text-gray-700">Conten Id</label>
        <input
          type="number"
          name="content_id"
          value={form.content_id}
          onChange={handleChange}
          readOnly
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
      </div>

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
          className="mt-1 block w-full min-h-40 p-2 border border-gray-300 rounded-md" />
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

      <div>
        <label className="block text-sm font-semibold text-gray-700">Last Update</label>
        <input
          type="datetime-local"
          name="updated_at"
          value={formatDateTimeLocal(form.updated_at.toDate())}
          onChange={handleChangeDate}
          readOnly
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md" /> 
      </div>
      
      <div className='flex justify-center items-center space-x-14'>
        <button
            onClick={()=>updateSelectedContent(null)}
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

export default EditContentForm;
