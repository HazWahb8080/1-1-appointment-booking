import React, { useState, useEffect } from "react";
import { close_Icon, open_icon } from "../../utils/svgs/svgs";
import { useRecoilState } from "recoil";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Mini_Slot from "./Mini_Slot";
import { DatabaseIcon } from "@heroicons/react/solid";
import { ActiveSlotsState, IsAmState } from "../../atoms/SlotsAtom";

function Slot({ hour, int, am, pm, activeDate }) {
  const [openSlots, setOpenSlots] = useState(false);
  const router = useRouter();
  const { create: query } = router.query;
  const { data: session } = useSession();
  const usermail = session?.user?.email;
  const [slots, setSlots] = useRecoilState(ActiveSlotsState);
  const [isAm, setIsAm] = useRecoilState(IsAmState);

  // fetch timeslots
  useEffect(() => {
    if (!usermail || !query || !activeDate) return;
    onSnapshot(
      collection(
        db,
        "users",
        usermail,
        "appointments",
        query,
        "dates",
        activeDate,
        "slots"
      ),
      (snapshot) => {
        setSlots(snapshot.docs);
      }
    );
  }, [usermail, query, activeDate]);

  return (
    <div className="slot relative">
      <div
        onClick={() => setOpenSlots(!openSlots)}
        className="items-end flex 
       justify-end hover:text-blue-600 h-4 w-4 smooth absolute top-2 right-[5px]"
      >
        {!openSlots ? close_Icon : open_icon}
      </div>
      {!openSlots && `${hour} : 00 ${am ? "am" : "pm"}`}
      {openSlots && (
        <div className="my-3 px-4 w-full  overflow-y-scroll scrollbar-hide space-y-4">
          <Mini_Slot
            query={query}
            activeDate={activeDate}
            usermail={usermail}
            slots={slots}
            isAm={isAm}
            hour={hour}
            int={int}
            am={am}
          />
        </div>
      )}
    </div>
  );
}

export default Slot;
