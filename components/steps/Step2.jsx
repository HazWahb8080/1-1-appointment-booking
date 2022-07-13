import React from "react";
import Calendar from "../calendar/Calendar";

function Step2() {
  return (
    <div className="h-full w-full flex space-y-12 border  flex-col items-center justify-start py-12 px-12">
      <div className="w-full space-y-3 py-4">
        <Calendar />
      </div>
    </div>
  );
}

export default Step2;
