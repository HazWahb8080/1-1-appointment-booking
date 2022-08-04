import React from "react";
import { MeetingFormState } from "../../../../atoms/FormAtom";
import { useRecoilState } from "recoil";
import { format, toDate,
} from "date-fns";

const Label = ({title}) => {
  return (
    <label className="self-center"> {title} </label>
  )
}

function Step3() {
  const [FinalData, setFinalData] = useRecoilState(MeetingFormState);
  return (
    <main className="w-full px-6 md:w-3/4 flex items-center justify-center md:py-48">
      <div className="w-full flex flex-col space-y-6 items-center justify-center ">
        <div className="grid grid-cols-3 gap-4 w-full">
          <Label title={"Name"}/>
          <input
            type="text"
            className="input col-span-2 "
            value={FinalData.name}
            onChange={(e) =>
              setFinalData({ ...FinalData, name: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-3 gap-4 w-full">
          <Label title={"Email"}/>
          <input
            type="email"
            className="input col-span-2 "
            value={FinalData.email}
            onChange={(e) =>
              setFinalData({ ...FinalData, email: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-3 gap-4 w-full">
          <Label title={"selected date"}/>
          <input
            disabled
            className="input col-span-2 text-lg"
            value={`${format(toDate(new Date(FinalData.selectedDate.date)), "dd-MM-yyy")} at ${FinalData.selectedDate.slot} `}
          />
        </div>
      </div>
    </main>
  );
}

export default Step3;
