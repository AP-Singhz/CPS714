

'use client'
import React, {useState} from 'react';
import Link from 'next/link';
import { FiUser, FiSearch, FiPlusSquare} from 'react-icons/fi';
import './content_style.css';
import {Event_tile} from './sub_pages/event_tile.jsx';
import {Content_tile} from './sub_pages/content_tile.jsx';
import ContentTable from './sub_pages/content_table.jsx';
import EventTable from './sub_pages/event_table.jsx';
import CreateContentForm from './sub_pages/create_content_form.jsx';
import CreateEventForm from './sub_pages/create_event_form.jsx';
import EditEventForm from './sub_pages/edit_event_form.jsx';
import EditContentForm from './sub_pages/edit_content_form.jsx';
import EventRegistrationManagmentTable from './sub_pages/event_registrations.jsx';
import CreateRegistrationForm from './sub_pages/create_registration_form.jsx';
import EditRegistrationForm from './sub_pages/edit_registration_form.jsx';
import ViewEventRegistration from './sub_pages/view_event_registrations.jsx';


export default function ContentEventsManagement() {
  
  const [selectedView, setSelectedView] = useState('card'); 
  const [eventTileAction, setEventTileAction] = useState('nothing');
  const [contentTileAction, setContentTileAction] = useState('nothing');
  const [eventTableAction, setEventTableAction] = useState('nothing');
  const [contentTableAction, setContentTableAction] = useState('nothing');
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [managingRegistrations, setManagingRegistrations] = useState("No");
  const [addRegistration, setAddRegistration] = useState("No");
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [contentTableCollapsed, setContentTableCollapsed] = useState("Yes");
  const [eventTableCollapsed, setEventTableCollapsed] = useState("Yes");
  const [contentTileCollapsed, setContentTileCollapsed] = useState("Yes");
  const [eventTileCollapsed, setEventTileCollapsed] = useState("Yes");
  const [viewEventRegistration, setViewEventRegistration] = useState("No");
  

  const handleRadioChange = (e) => { 
    setSelectedView(e.target.value); 
    setContentTileAction('nothing');
    setEventTileAction('nothing');
  };  

  function add_content_tile(){
    setContentTileAction('add');
    setEventTileAction('nothing');
    console.log("Adding Content, Content Tile Action = " + contentTileAction);
  }

  function add_event_tile(){
    setContentTileAction('nothing');
    setEventTileAction('add');
    console.log("Adding Event, Event Tile Action = " + eventTileAction);
  }

  function add_content_table(){
    setContentTableAction('add');
    setEventTableAction('nothing');
    console.log("Adding Content, Content Tile Action = " + contentTileAction);
  }

  function add_event_table(){
    setContentTableAction('nothing');
    setEventTableAction('add');
    console.log("Adding Event, Event Tile Action = " + eventTileAction);
  }

  const handleExitFromViewEventRegistrations = () => {
    setViewEventRegistration("No");
    setSelectedEvent(null);
  }
  

  return (
    
    <div className="min-h-screen bg-gray-900 rounded-lg ">
      
      <div>
        <h2 className="text-3xl py-5 px-6 font-bold text-slate-200 ml-1 mb-1">Content and Events Management</h2>
      </div>

      <header className="bg-gray-600 h-44 text-white py-4 pl-4">
        <div className="ml-10 h-15 text-slate-900 bg-slate-400 font-bold p-2 mb-2">
        <Link href="../" passHref>
          <button className="backbutton hover:text-sky-700">BACK TO ADMIN DASHBOARD</button>
        </Link>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-5xl text-green-600 text-pretty font-bold ml-10">GreenGrove Farms Education Platform</h1>
          <div className='flex'>
          <FiUser size={40} />
          <button className="ml-4 mr-10 text-2xl font-semibold text-blue-400 hover:text-teal-600">LOG OUT</button>
          </div>
        </div>
        <div className="flex justify-end mt-6">
            <div className='flex justify-items-end'>
              <div className="flex justify-between items-center mr-16">
                <input id="card_radio" type="radio" name="views" value="card" defaultChecked className="mr-4 form-radio h-6 w-6 text-blue-600" onChange={handleRadioChange}/>
                <label htmlFor="card_radio" className="ml-2 block text-xl font-semibold text-gray-100" >Cards view</label>  
              </div>
              <div className="flex justify-between items-center mr-10">
                <input id="table_radio" type="radio" name="views" value="table" className="mr-4 form-radio h-6 w-6 text-blue-600" onChange={handleRadioChange}/>
                <label htmlFor="table_radio" className="ml-2 block text-xl font-semibold text-gray-100">Table view</label>
              </div>
          </div>
        </div>
      </header>

      <div className=' relative h-5 bg-slate-500'></div>

      <main className=" relative p-6">
        
        <div className="relative flex justify-end mb-14">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search Content / Event"
              className="px-4 py-2 rounded-full w-96 border-gray-400 border-2"
            />
            <FiSearch className='absolute right-4  text-blue-600 font-bold hover:text-teal-500' size={30}/>
          </div>
        </div>

        {selectedView === "card" && managingRegistrations === 'No' && viewEventRegistration === "No" && (
        <div className="space-y-8">
          {/* Content Section */}
          <section className="mb-20">
            <div className="flex justify-between items-center">

              <h3 className="text-2xl text-[#26b96a] font-bold">Contents</h3>

              <div className="flex items-center space-x-16" >
                <FiPlusSquare size={70} className=' text-lime-200 hover:text-lime-700' onClick={add_content_tile}/>

                {contentTileCollapsed === "No" && (
                  <div>
                    <button onClick={()=> setContentTileCollapsed("Yes")} className="text-2xl italic font-semibold text-blue-500">Collapse</button>
                  </div>
                )}

                {contentTileCollapsed === "Yes" && (
                  <div>
                    <button onClick={()=> setContentTileCollapsed("No")} className="text-2xl italic font-semibold text-blue-500">Expand</button>
                  </div>
                )}
                
              </div>

            </div>

            <hr className='h-1 bg-cyan-700'/>

            {contentTileCollapsed === "Yes" && (
              
              <div className="flex gap-8 mt-6 items-center overflow-x-auto">
                {/* Example Content Card */}
                <div className='max-w-max'><Content_tile updateSelected={ setSelectedContent} isnew={"true"} collapsed={"Yes"}/></div>
               
              </div>
            )}

            {contentTileCollapsed === "No" && (
              
              <div className="flex gap-8 mt-6 items-center overflow-x-auto">
                {/* Example Content Card */}
                <div className='max-w-max'><Content_tile updateSelected={ setSelectedContent} isnew={"true"} collapsed={"No"}/></div>

              </div>
            )}

          </section>

          {/* Events Section */}
          <section className="mb-10">

            <div className="flex justify-between items-center">

              <h3 className="text-2xl text-[#7832da] font-bold">Events</h3>

              <div className="flex items-center space-x-16" >

                <div className='text-xl font-semibold bg-orange-400 m-2 p-3 border-slate-500 rounded-xl hover:bg-orange-600'><button onClick={() => setManagingRegistrations("Yes")}>Manage Event Registrations</button></div>

                <FiPlusSquare size={70} className='text-violet-400 hover:text-violet-700' onClick={add_event_tile}/>

                {eventTileCollapsed === "No" && (
                  <div>
                    <button onClick={()=> setEventTileCollapsed("Yes")} className="text-2xl italic font-semibold text-blue-500">Collapse</button>
                  </div>
                )}

                {eventTileCollapsed === "Yes" && (
                  <div className="flex items-center space-x-16" >
                    
                    <button onClick={()=> setEventTileCollapsed("No")} className="text-2xl italic font-semibold text-blue-500">Expand</button>
                  </div>
                )}
              </div>

            </div>

            <hr className='h-1 bg-cyan-700'/>
            {eventTileCollapsed === "Yes" && (

              <div className="flex gap-8 mt-6 items-center overflow-x-auto">
                {/* Example Event Card */}
                <div className='max-w-max'><Event_tile updateSelected={setSelectedEvent} isnew={"true"} setViewEventRegistration={setViewEventRegistration} collapsed={"Yes"} /></div>
                <div className='w-10'></div>
              </div>
            )}

            {eventTileCollapsed === "No" && (

            <div className="flex gap-8 mt-6 items-center overflow-x-auto">
              {/* Example Event Card */}
              <div className='max-w-max'><Event_tile updateSelected={setSelectedEvent} isnew={"true"} setViewEventRegistration={setViewEventRegistration}  collapsed={"No"} /></div>
              
            </div>
            )}

          </section>  
        </div>
        )}


        {selectedView === "table" && managingRegistrations === 'No' && viewEventRegistration === "No" && (
          <div className="space-y-8">
            {/* Content Section */}
            <section className="mb-20">
              <div className="flex justify-between items-center">              
                  <h3 className="text-2xl text-[#28c16f] font-bold">Contents</h3>
                  <div className="flex items-center space-x-16" >
                    <FiPlusSquare size={70} className='text-lime-400 hover:text-lime-700' onClick={add_content_table}/>
                    {contentTableCollapsed === "No" && (
                      <div>
                        <button onClick={()=> setContentTableCollapsed("Yes")} className="text-2xl italic font-semibold text-blue-500">Collapse</button>
                      </div>
                    )}

                    {contentTableCollapsed === "Yes" && (
                      <div>
                        <button onClick={()=> setContentTableCollapsed("No")} className="text-2xl italic font-semibold text-blue-500">Expand</button>
                      </div>
                    )}
                  </div>
              </div>

              <hr className='h-1 bg-cyan-700'/>

              {contentTableCollapsed === "No" && (
                <ContentTable updateSelected={ setSelectedContent} collapsed={"No"} />  
              )}

              {contentTableCollapsed === "Yes" && (
                <ContentTable updateSelected={ setSelectedContent} collapsed={"Yes"} />  
              )}

            </section>

            {/* Events Section */}
            <section className="mb-10">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl text-[#8346da] font-bold">Events</h3>
                <div className="flex items-center space-x-16" >
                <div className='text-xl font-semibold bg-orange-400 m-2 p-3 border-slate-500 rounded-xl hover:bg-orange-600'><button onClick={() => setManagingRegistrations("Yes")}>Manage Event Registrations</button></div>
                  <FiPlusSquare size={70} className='text-violet-400 hover:text-violet-700' onClick={add_event_table}/>  {eventTableCollapsed === "No" && (
                      <div>
                        <button onClick={()=> setEventTableCollapsed("Yes")} className="text-2xl italic font-semibold text-blue-500">Collapse</button>
                      </div>
                    )}

                    {eventTableCollapsed === "Yes" && (
                      <div>
                        <button onClick={()=> setEventTableCollapsed("No")} className="text-2xl italic font-semibold text-blue-500">Expand</button>
                      </div>
                    )}
                </div>
              </div>
              <hr className='h-1 bg-cyan-700'/>

              {eventTableCollapsed === "No" && (
                <EventTable updateSelected={setSelectedEvent} setViewEventRegistration={setViewEventRegistration}  collapsed={"No"}/>
              )}

              {eventTableCollapsed === "Yes" && (
                <EventTable updateSelected={setSelectedEvent} setViewEventRegistration={setViewEventRegistration}  collapsed={"Yes"}/>
              )}

            </section>
          </div>
        )}

      
        {contentTileAction === "add" && (
          
          <div className=' absolute bg-slate-300  max-h-max inset-56 inset-y-4 flex items-center justify-center'>
            <CreateContentForm updateState={setContentTileAction} />
          </div>
        )}
        

        <div>
        {eventTileAction === "add" && (
          
          <div className=' absolute bg-slate-300  max-h-max inset-56 inset-y-4 flex items-center justify-center'>
            <CreateEventForm updateState={setEventTileAction} />
          </div>
        )}
        </div>

        {contentTableAction === "add" && (
          
          <div className=' absolute bg-slate-300 max-h-max inset-56 inset-y-4 flex items-center justify-center'>
            <CreateContentForm updateState={setContentTableAction} />
          </div>
        )}
        
        
        {eventTableAction === "add" && (
          
          <div className=' absolute bg-slate-300  max-h-max inset-56 inset-y-4 flex items-center justify-center'>
            <CreateEventForm updateState={setEventTableAction} />
          </div>
        )}
        
        <div>
          {selectedEvent !== null && viewEventRegistration === "No" && (
            
            <div className=' absolute bg-slate-300  max-h-max inset-56 inset-y-4 flex items-center justify-center'>
              <EditEventForm updateSelectedEvent={setSelectedEvent} event={selectedEvent} />
            </div>
          )}
        </div>

        <div>
          {selectedContent !== null && (
            
            <div className=' absolute bg-slate-300  max-h-max inset-56 inset-y-4 flex items-center justify-center'>
              <EditContentForm updateSelectedContent={setSelectedContent} content={selectedContent} />
            </div>
          )}
        </div>

        {managingRegistrations === "Yes" && (
          <div>
            
            <section className="mb-10">

              <div className="flex justify-between items-center">

                <h3 className="text-2xl text-[#575eea] font-bold">Event Registration Mangement</h3>

                <div className="flex items-center space-x-16" >
                  <div className='text-xl font-semibold bg-orange-400 m-2 p-3 border-slate-500 rounded-xl hover:bg-orange-600'><button onClick={() => setManagingRegistrations("No")}>Return to Content and Event Management</button></div>
                </div>

              </div>

              <hr className='h-1 bg-cyan-700'/>
              <EventRegistrationManagmentTable updateSelectedRegistration={setSelectedRegistration} updateAddRegistration={setAddRegistration}/>
            </section> 
          </div>
        )}

        {
          addRegistration === "Yes" && (
            <div className=' absolute bg-slate-600  max-h-max inset-56 inset-y-4 flex items-center justify-center'>
              <CreateRegistrationForm updateState={setAddRegistration} u/>
            </div>
          )
        }
      
      <div>
          {selectedRegistration !== null && (
            <div className=' absolute bg-slate-600 text-white  max-h-max inset-56 inset-y-4 flex items-center justify-center'>
              <EditRegistrationForm updateSelectedRegistration={setSelectedRegistration} registration={selectedRegistration} />
            </div>
          )}
      </div>

      
      {viewEventRegistration === "Yes" && (
        
        <div >
          <section className="mb-10">

            <div className="flex justify-between items-center">

              <h3 className="text-2xl text-[#c43da7] font-bold">View Single Event Registrations </h3>

              <div className="flex items-center space-x-16" >
                <div className='text-xl font-semibold bg-orange-400 m-2 p-3 border-slate-500 rounded-xl hover:bg-orange-600'><button onClick={() => handleExitFromViewEventRegistrations()}>Return to Content and Event Management</button></div>
              </div>

            </div>

            <hr className='h-1 bg-cyan-700'/>

            <ViewEventRegistration updateSelectedRegistration={setSelectedRegistration} eventToView={selectedEvent}/>

          </section> 
          
        </div>
      )}

      </main>
      {/*<footer className="bg-gray-800 h-44 text-white py-4 pl-4"> </footer>*/}
      
    </div>
  );
}