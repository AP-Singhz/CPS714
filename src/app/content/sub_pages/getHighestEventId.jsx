
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from "../../firebase/clientApp.ts";

const GetHighestEventId = async () => {
  const q = query(collection(db, 'events'), orderBy('event_id', 'desc'), limit(1));
  const querySnapshot = await getDocs(q);
  let highestEventId = null;

  querySnapshot.forEach((doc) => {
    highestEventId = doc.data().event_id;   
  });

  //console.log("highest event Id is: " + highestEventId)
  return highestEventId;
};

export default GetHighestEventId;
