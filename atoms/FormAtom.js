import { atom } from "recoil";

export const FormState = atom({
  key: "FormState", // unique ID (with respect to other atoms/selectors)
  default: {
    step: 1,
    title: null,
    description: null,
    dates: [],
  }, // default value (aka initial value)
});
export const MeetingFormState = atom({
  key: "MeetingFormState", // unique ID (with respect to other atoms/selectors)
  default: {
    step: 1,
    email:"",
    name:"",
    selectedDate: {date:null,slot:null},
  },
});


export const ActiveDateState = atom({
   key: "ActiveDateState", // unique ID (with respect to other atoms/selectors)
  default: null
});
export const activeDateSlotsState = atom({
   key: "activeDateSlotsState", // unique ID (with respect to other atoms/selectors)
  default: []
});

export const SelectedSlotState = atom({
   key: "SelectedSlotState", // unique ID (with respect to other atoms/selectors)
  default: {}
});