import { atom } from "recoil";

export const ActiveSlotsState = atom({
  key: "ActiveSlotsState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export const IsAmState = atom({
  key: "IsAmState", // unique ID (with respect to other atoms/selectors)
  default: { isAm_0: false, isAm_1: false, isAm_2: false }, // default value (aka initial value)
});
