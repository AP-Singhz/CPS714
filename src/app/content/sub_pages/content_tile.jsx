import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, getDoc, where } from 'firebase/firestore';
import { db } from "../../firebase/clientApp.ts";
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';


export function Content_tile({updateSelected, isnew}){
    const [contents, setContents] = useState([]);
    const [selectedContent, setSelectedContent] = useState(null);


    useEffect(() => { const fetchData = async () => { // Create a query to order documents by 'content_id' in descending order 
        const q = query(collection(db, 'contents'), orderBy('content_id', 'desc')); 
        const querySnapshot = await getDocs(q); 
        const contentList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); 
        setContents(contentList); }; 
        fetchData();
     }, []);

    // Function to handle deleting a content with confirmation 
    const handleDeleteContent = async (contentId) => { 
        const isConfirmed = window.confirm('Are you sure you want to delete this content?'); 
        if (isConfirmed) { 
            const contentRef = collection(db, "contents");
            const q = query(contentRef, where('content_id', '==', contentId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty){
                querySnapshot.forEach(async (docSnapshot) => {
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


    return(
        <div className=" flex flex-grow justify-center space-x-6 ">
            {contents.map(item => (
                <div key={item.content_id} className=" bg-white hover:text-[#0f56f6] hover:border hover:border-green-500 hover:shadow-xl hover:shadow-lime-500 shadow-md rounded-tr-[32] max-w-sm">
                    <div className="relative bg-gray-200 h-48 w-96 flex justify-center items-center">
                        <div>
                            {item.imageUrl ? ( 
                                <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" /> 
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

                            <button className="text-white shadow-2xl w-20 h-20 rounded-full bg-[#dbdb4f] hover:bg-[#c2c27d] flex justify-center items-center" onClick={ () => handleEditContent(item.content_id) } >
                               <FiEdit2 size={50} /> 
                            </button>

                            <button className="text-black shadow-2xl w-20 h-20 rounded-full bg-[#f36c73] hover:bg-[#90474c] flex justify-center items-center" onClick={ () => handleDeleteContent(item.content_id) } >
                               <FiTrash2 size={50} />
                            </button>

                            <div></div>
                        </div>
                    </div>
                    <div className="p-4"> 
                        <h3 className="text-xl font-semibold">{item.title}</h3>                 
                    </div>
                </div>
            ))}
        </div>
    );
}