import React from "react";

function AvailableSlot({ slot, amOrpm }) {
  return (
    <div className="w-full border border-black/5 py-2 my-3 hover:border-black smooth cursor-pointer flex items-center justify-center">
      <h1>
        {slot}
        {amOrpm}
      </h1>
    </div>
  );
}

export default AvailableSlot;
