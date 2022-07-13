import { atom } from "recoil";

export const SelectedDaysState = atom({
  key: "SelectedDaysState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export const activeDayState = atom({
  key: "activeDayState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export const TimeSlotsState = atom({
  key: "TimeSlotsState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});


