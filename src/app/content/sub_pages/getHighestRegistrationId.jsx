
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from "../../firebase/clientApp.ts";

const GetHighestRegistrationId = async () => {
  const q = query(collection(db, 'registrations'), orderBy('registration_id', 'desc'), limit(1));
  const querySnapshot = await getDocs(q);
  let highestRegistrationId = null;

  querySnapshot.forEach((doc) => {
    highestRegistrationId = doc.data().registration_id;
  });

  return highestRegistrationId;
};

export default GetHighestRegistrationId;