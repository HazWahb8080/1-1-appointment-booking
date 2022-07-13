import React from "react";
import { useRecoilState } from "recoil";
import { FormState } from "../atoms/FormAtom";
import Step1 from "./steps/Step1";
import Step3 from "./steps/Step3";
import Step2 from "./steps/Step2";
import Progress from "./Progress";

function CreateAppointment() {
  const [formData, setFormData] = useRecoilState(FormState);
  const { step, title, description, dates } = formData;
  return (
    <div className=" max-w-5xl w-full  mx-auto  items-center justify-center h-[80vh] flex py-12 px-6">
      <div className="w-full h-full items-center justify-between flex flex-col space-y-6 ">
        {/* step_progress */}
        {/* <Progress step={step} /> */}
        {/* steps */}
        <div className="flex-1 items-center flex justify-center w-full ">
          {step === 1 ? <Step1 /> : step === 2 ? <Step2 /> : <Step3 />}
        </div>
        {/* next - back */}
        <div className="flex items-center justify-between w-full space-x-6">
          {step !== 1 && (
            <button
              className="form-btn"
              onClick={() => setFormData({ ...formData, step: step - 1 })}
            >
              {" "}
              Back{" "}
            </button>
          )}
          {step !== 3 && (
            <button
              className="form-btn"
              onClick={() => {
                if(!formData.title.trim()) return;
                setFormData({ ...formData, step: step + 1 })
              }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateAppointment;
