import React from "react";
import Step1 from "../steps/step1/Step1";
import Step2 from "../steps/step2/Step2";
import Step3 from "../steps/step3/Step3";
import { useRecoilState } from "recoil";
import { MeetingFormState } from "../../../atoms/FormAtom";
function MultiForm({ meetingData }) {
  // data has the title
  // dates has the docs of the dates avaialable to this appointment with slots within
  const { data, dates } = meetingData;
  const [meetingFormState, setMeetingFormState] =
    useRecoilState(MeetingFormState);
  const { step, email, name, selectedDates } = meetingFormState;

  return (
    <div className="w-full h-3/4 items-center justify-center flex flex-col">
      {step === 1 ? (
        <Step1 data={data} />
      ) : step === 2 ? (
        <Step2 data={data} />
      ) : (
        <Step3 data={data} />
      )}
      <button>{ step < 3 ? "Next" : "Back"} </button>
    </div>
  );
}

export default MultiForm;
