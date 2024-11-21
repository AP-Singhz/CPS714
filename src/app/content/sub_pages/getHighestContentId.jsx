
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from "../../firebase/clientApp.ts";

const GetHighestContentId = async () => {
  const q = query(collection(db, 'contents'), orderBy('content_id', 'desc'), limit(1));
  const querySnapshot = await getDocs(q);
  let highestContentId = null;

  querySnapshot.forEach((doc) => {
    highestContentId = doc.data().content_id;
  });

 // console.log("highestcontent Id is: " + highestContentId)
  return highestContentId;
};

export default GetHighestContentId;
