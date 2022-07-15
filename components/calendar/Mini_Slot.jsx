import React, { useState } from "react";
import {
  collection,
  deleteDoc,
  setDoc,
  doc,
  addDoc,
  serverTimestamp,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useRecoilState } from "recoil";
import { TimeSlotsState } from "../../atoms/SelectedDays";

function Mini_Slot({
  hour,
  int,
  slots,
  isAm,
  am,
  usermail,
  query,
  activeDate,
}) {
  const [timeSlots, setTimeSlots] = useRecoilState(TimeSlotsState);
  const [ActiveMiniSlot, setActiveMiniSlot] = useState([]);
  const handleMiniSlotes = (i, e) => {
    e.preventDefault();
    setActiveMiniSlot([ ...ActiveMiniSlot , i]);
    setTimeSlots([...timeSlots, `${hour}:${i * int}`]);
    let slotToUpdate = `${hour}:${i * int}`;
    addMiniSlotsToDb(slotToUpdate);
  };
  const addMiniSlotsToDb = async (slotToUpdate) => {
    await setDoc(
      doc(
        db,
        "users",
        usermail,
        "appointments",
        query,
        "dates",
        activeDate,
        "slots",
        `date_${slotToUpdate}_${am ? "am" : "pm"}`
      ),
      {
        slot: slotToUpdate,
      }
    );
  };

  return (
    <>
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          onClick={(e) => {
            handleMiniSlotes(i, e);
          }}
          className={`border-b hover:bg-black hover:text-gray-100 
              smooth px-3 duration-200 border-black cursor-pointer
               ${ActiveMiniSlot.includes(i) && "bg-black text-white"}
                  `}
        >
          {hour} : {i * int}
          {i === 0 ? "0" : ""}
          {am ? " am " : " pm "}
        </div>
      ))}
    </>
  );
}

export default Mini_Slot;
// ${
//                  slot.data().slot === `${hour}:${i * int}` ||
//                  ActiveMiniSlot === i
//                    && "bg-black text-gray-100"
//                }
