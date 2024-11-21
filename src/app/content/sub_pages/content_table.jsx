// components/ContentTable.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, getDoc, where } from 'firebase/firestore';
import { db } from "../../firebase/clientApp.ts";
import { FiEdit2, FiTrash2} from 'react-icons/fi';

const ContentTable = ({updateSelected, collapsed}) => {
  const [contents, setContent] = useState([]);  
  const [selectedContent, setSelectedContent] = useState(null);

  
    useEffect(() => { const fetchData = async () => { 
        const q = query(collection(db, 'contents'), orderBy('content_id', 'desc')); 
        const querySnapshot = await getDocs(q); 
        const contentList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); 
        setContent(contentList); }; 
        fetchData();
    }, []);

    // Function to handle deleting a content with confirmation 
    const handleDeleteContent = async (contentId) => { 
        const isConfirmed = window.confirm('Are you sure you want to delete this content?'); 
        if (isConfirmed) { 
            const contentRef = collection(db, "contents");
            const q = query(contentRef, where('content_id', '==', contentId));
            const queryScnapshot = await getDocs(q);

            if (!queryScnapshot.empty){
                queryScnapshot.forEach(async (docSnapshot) => {
                    const docRef = docSnapshot.ref;

                    try { 
                        await deleteDoc(docRef); 
                        setContents(prevContents => prevContents.filter(content => content.content_id !== contentId)); 
                        alert(`Content with ID ${contentId} deleted successfully`);
                        console.log(`Content with ID ${contentId} deleted successfully`); 
                    } catch (error) { 
                        console.error("Error deleting content:", error); 
                    } 
                })
            }
        } 
    };     

    // Function to handle fetching content details by ID 
    const handleEditContent = async (contentId) => { 
        try { 
            const q = query(collection(db,'contents'), where('content_id', '==', contentId));
            const contentSnpashot = await getDocs(q); 

            if (!contentSnpashot.empty) { 
                const contentDoc = contentSnpashot.docs[0];
                setSelectedContent(contentDoc.data()); 
                updateSelected(contentDoc.data()); 
                console.log("Content details:", contentDoc.data()); 
            } else { 
                console.log("No such document!");
            } 
        } catch (error) { 
            console.error("Error fetching Content details:", error);
        } 
    };

    return (
        <div className="overflow-auto">
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                    <th className="py-2 px-4 border text-center">Content ID</th>
                    <th className="py-2 px-4 border">Title</th>
                    <th className="py-2 px-4 border text-center">Content Type</th>
                    <th className="py-2 px-4 border text-center">Content</th>
                    <th className="py-2 px-4 border text-center">Created By</th>
                    <th className="py-2 px-4 border text-center">Created At</th>
                    <th className="py-2 px-4 border text-center">Updated At</th>
                    <th className="py-2 px-4 border">Actions</th>
                    </tr>
                </thead>
                {collapsed === "No" && (
                    <tbody>
                        {contents.map(item => (
                        <tr className = "hover:border-slate-300 hover:border-2 hover:shadow hover:bg-green-100 hover:font-semibold" key={item.id}>
                            <td className="py-2 px-4 border text-center w-1/12">{item.content_id}</td>
                            <td className="py-2 px-4 border text-center w-1/12">{item.title}</td>
                            <td className="py-2 px-4 border text-center w-1/12">{item.content_type}</td>
                            <td className="py-2 px-4 border w-4/12">{item.content}</td>
                            <td className="py-2 px-4 border text-center w-1/12">{item.created_by}</td>
                            <td className="py-2 px-4 border text-center w-1/12">{new Date(item.created_at.seconds * 1000).toLocaleString()}</td>
                            <td className="py-2 px-4 border text-center w-1/12">{new Date(item.updated_at.seconds * 1000).toLocaleString()}</td>
                            <td className="py-2 px-4 border w-3-/12 text-center align-middle">
                                <div className="flex justify-center items-center space-x-8">
                                    
                                    <button className="text-white shadow-2xl w-16 h-16 rounded-full bg-[#dbdb4f] hover:bg-[#c2c27d] flex justify-center items-center" onClick={ () => handleEditContent(item.content_id) } >
                                    <FiEdit2 size={30} />
                                    </button>
                                    <button className="text-black shadow-2xl w-16 h-16 rounded-full bg-[#f36c73] hover:bg-[#90474c] flex justify-center items-center" onClick={ () => handleDeleteContent(item.content_id) } >
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

export default ContentTable;
