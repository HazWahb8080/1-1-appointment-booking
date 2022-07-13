import React, { useEffect, useState } from "react";
import Header from "./../components/Header";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import Appointment from "./../components/Appointment";

function Dash() {
  const router = useRouter();
  const { create: query } = router.query;
  const { data: session } = useSession();
  const usermail = session?.user?.email;
  // let's fetch the created appointments
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    if (usermail) {
      const collRef = collection(db, "users", usermail, "appointments");
      onSnapshot(collRef, (snapshot) => {
        setAppointments(snapshot.docs);
        setLoading(false);
      });
    }
  }, [usermail]);

  return (
    <div className="w-full items-center h-full justify-center flex flex-col space-y-6">
      <Header />
      {/*created appointments  list */}
      <div className="flex items-center justify-center w-full ">
        {loading ? (
          <div className="w-full h-screen items-center justify-center flex flex-col">
            loading
          </div>
        ) : (
          <div
            className="w-full lg:w-3/4 items-center justify-center flex 
          flex-col h-fit overflow-y-scroll scrollbar-hide  border-b px-4 py-4 border-black/50"
          >
            {appointments.map((appointment) => (
              <Appointment
                key={appointment.id}
                data={appointment.data()}
                id={appointment.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dash;
