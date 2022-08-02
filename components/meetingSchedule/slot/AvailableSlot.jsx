import React from "react";
import { useRecoilState } from 'recoil';
import { MeetingFormState } from "../../../atoms/FormAtom";

function AvailableSlot({ slot, amOrpm , activeDate }) {
    const [pickedDates,setPickedDates] = useRecoilState(MeetingFormState);
    const slotamOrpm = slot + amOrpm;
  return (
    <div
    onClick={()=>setPickedDates({...pickedDates,selectedDate:{date:activeDate,slot:slotamOrpm}})}
    className="w-full border border-black/5 py-2 my-3 hover:border-black smooth cursor-pointer flex items-center justify-center">
      <h1>
        {slotamOrpm}
      </h1>
    </div>
  );
}

export default AvailableSlot;
