import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { MeetingFormState,SelectedSlotState } from "../../../atoms/FormAtom";

function AvailableSlot({ slot, amOrpm, activeDate }) {
  const [currentSelectedSlot, setCurrentSelectedSlot] =
    useRecoilState(SelectedSlotState);
  const [pickedDates, setPickedDates] = useRecoilState(MeetingFormState);
  const slotamOrpm = slot + amOrpm;
  const handleClicking = () => {
    setPickedDates({
      ...pickedDates,
      selectedDate: { date: activeDate, slot: slotamOrpm },
    });
    setCurrentSelectedSlot(slotamOrpm);
  };
  return (
    <div
      onClick={handleClicking}
      className={`${
        currentSelectedSlot === slotamOrpm
          ? "available-slot-selected"
          : "available-slot "
      }`}
    >
      <h1>{slotamOrpm}</h1>
    </div>
  );
}

export default AvailableSlot;
