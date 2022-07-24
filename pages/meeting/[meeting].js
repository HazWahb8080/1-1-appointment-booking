import { query, collection, where,doc, onSnapshot, getDoc,getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect,useState } from 'react';
import MultiForm from '../../components/meetingSchedule/multiForm/MultiForm';
import Step1 from '../../components/meetingSchedule/steps/step1/Step1';
import { db } from '../../firebase';
import Header from './../../components/Header';


function Meeting() {
  const router = useRouter();
  const {meeting:meetingQuery} = router.query;
  const [meetingQueryData,setMeetingQueryData] = useState({});
  const [meetingData,setMeetingData] = useState({});


  // fetching the proper Id and email for this specific meeting
  useEffect(()=>{
    if(!meetingQuery) return;
    onSnapshot(query(collection(db,"published"),where("title","==",meetingQuery)),(snapshot)=> {
      const meetingDoc = snapshot.docs.filter(doc=>doc.id)[0].data();
      const meetingId = meetingDoc.date;
      const meetingEmail = meetingDoc.organizer;
      setMeetingQueryData({Id:meetingId, email:meetingEmail}); //here we are getting the meeting id and email in order to fetch the whole meeting details from inside
    })
  },[meetingQuery]);

  // after getting the id of the original doc we need to use it with the email to fetch the whole data
  useEffect(()=>{
    if(!meetingQueryData.Id) return;
      const {email,Id} = meetingQueryData;
      const getMeetingData = async () => {
        const docRef = doc(db,"users",email,"appointments",Id) //reference for the doc
        const meetingData = await getDoc(docRef) //getting the title of the appointment
        const meetingDatesData = await getDocs(collection(docRef,"dates")) //getting the dates available to this appointment
       setMeetingData({data:meetingData.data(),dates:meetingDatesData.docs});
    }
    getMeetingData();

  },[meetingQueryData]);


  return (
    <div>
      <Header/>
      <MultiForm meetingData={meetingData} />
    </div>
  )
}

export default Meeting;