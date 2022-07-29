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
  const handleStep = (toDo) => {
    setMeetingFormState(
      toDo === "+"
        ? { ...meetingFormState, step: step + 1 }
        : { ...meetingFormState, step: step - 1 }
    );
  };

  return (
    <div className="w-full my-6 md:w-1/2 border h-3/4 items-center justify-center flex flex-col">
      {step === 1 ? (
        <Step1 data={data} />
      ) : step === 2 ? (
        <Step2 data={data} />
      ) : (
        <Step3 data={data} />
      )}
      <div className="w-full flex space-x-4 items-center justify-center">
        {step < 3 && (
          <button onClick={() => handleStep("+")} className="form-btn">
            { step === 1 ? "Let's get started" : "Next"}
          </button>
        )}
        {step > 1 && (
          <button onClick={() => handleStep("-")} className="form-btn">
            Back
          </button>
        )}
      </div>
    </div>
  );
}

export default MultiForm;
