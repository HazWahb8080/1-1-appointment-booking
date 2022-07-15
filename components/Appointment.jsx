import React, { useEffect, useState } from "react";
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
import { formatISO, format, getYear } from "date-fns";
import Slots from "./Slots";

function Appointment({ data, id }) {
  const { title } = data;
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([]);
  const [slots, setSlots] = useState([]);
  const [openDate, setOpenDate] = useState(false);
  const { data: session } = useSession();
  const usermail = session?.user?.email;
  const router = useRouter();
  const [Published, setPublished] = useState({ state: false, id: null });
  // let's fetch the dates of each appointment
  useEffect(() => {
    setLoading(true);
    if (usermail) {
      const collRef = collection(
        db,
        "users",
        usermail,
        "appointments",
        id,
        "dates"
      );
      onSnapshot(collRef, (snapshot) => {
        setDates(snapshot.docs);
        setLoading(false);
      });
      // let's check if published or not
      onSnapshot(
        query(collection(db, "published"), orderBy("timestamp", "desc")),
        (snapshot) => {
          snapshot.docs.forEach((doc) => {
            if (doc.data().date === id) {
              setPublished({
                state: true,
                id: doc.data().title.trim().replace(" ", "-"),
              });
            }
          });
        }
      );
    }
  }, [usermail]);

  const [ActiveDate, setActiveDate] = useState();
  const getSlots = (datesId) => {
    setActiveDate(datesId);
    if (ActiveDate === datesId) {
      setActiveDate(null);
    }
    const collRef_2 = collection(
      db,
      "users",
      usermail,
      "appointments",
      id,
      "dates",
      datesId,
      "slots"
    );
    onSnapshot(collRef_2, (snapshot) => {
      setSlots(snapshot.docs);
      setOpenDate(!openDate);
    });
  };

  return (
    <div className=" items-center justify-center flex w-full py-4 px-4">
      <div className="w-full items-center justify-center flex flex-col border border-black py-4 px-4 space-y-6">
        <div className="w-full justify-between items-center flex border-b">
          <h1 className="font-medium self-center pb-1 text-xl w-full text-gray-800">
            {title}
          </h1>
          <div className="flex justify-between items-center space-x-6">
            {Published.state && (
              <button
                onClick={() =>
                  router.push(
                    `/meeting/${Published.id.trim().replace(/ /g, "-")}`
                  )
                }
                className="pb-1 text-sm  self-center border-t border-x 
            border-white text-green-800 bg-green-200 hover:border-green-700 smooth px-4 py-1 -mb-1"
              >
                published
              </button>
            )}
            <button
              onClick={() => router.push(`/create/${id}`)}
              className="pb-1 text-sm text-gray-800 self-center border-t border-x 
             hover:border-black smooth px-4 py-1 -mb-1"
            >
              update
            </button>
          </div>
        </div>
        <div className="items-start justify-start flex-col-1 lg:flex w-full lg:space-y-0 space-y-4 lg:space-x-4">
          {dates.map((date) => (
            <div
              onClick={() => getSlots(date.id)}
              key={date.id}
              className={`mini-slot
              ${ActiveDate === date.id && "bg-black text-gray-100 smooth"}
              `}
            >
              <h1 className="text-xs text-left w-full  text-gray-400">
                {getYear(new Date(date.data().date.toDate()))}
              </h1>
              <h1 className=" text-lg ">
                {format(new Date(date.data().date.toDate()), "MM/dd")}
              </h1>
            </div>
          ))}
        </div>
        <Slots open={openDate} slots={slots} />
      </div>
    </div>
  );
}

export default Appointment;
