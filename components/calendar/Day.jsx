import React, { useState, useEffect } from "react";
import {
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parseISO,
  parse,
  format,
} from "date-fns";
import { SelectedDaysState, ActiveDaysState } from "../../atoms/SelectedDays";
import { constSelector, useRecoilState } from "recoil";
import {
  collection,
  deleteDoc,
  setDoc,
  doc,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { db } from "../../firebase";
import { FormState } from "../../atoms/FormAtom";
import { useRouter } from "next/router";

function Day({ day, dayIdx, currentMonth, meetingPage }) {
  const { data: session } = useSession();
  const [formData, setFormData] = useRecoilState(FormState);
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  let [selectedDay, setSelectedDay] = useRecoilState(SelectedDaysState);
  const [active, setActive] = useState(null);
  const router = useRouter();
  const { create: query } = router.query;

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    if (meetingPage) return;
    if (session && day && formData) {
      onSnapshot(
        collection(
          db,
          "users",
          session?.user?.email,
          "appointments",
          query,
          "dates"
        ),
        (snapshot) => {
          snapshot.docs.forEach((vDate) => {
            if (vDate.id === day.toString()) {
              setActive(day.toString());
            }
          });
        }
      );
    }
  }, [session, day, formData, meetingPage]);

  const handleDates = async () => {
    const ref_1 = collection(db, "users");
    if (active === day.toString()) {
      setActive(null);
      await deleteDoc(doc(ref_1, session?.user?.email, "dates", active));
    } else {
      const { title, description } = formData;
      setActive(day.toString());
      await setDoc(
        doc(
          ref_1,
          session?.user?.email,
          "appointments",
          query,
          "dates",
          day.toString()
        ),
        {
          date: day,
        }
      );
    }
  };

  return (
    <div
      className={classNames(
        dayIdx === 0 && colStartClasses[getDay(day)],
        "py-1.5"
      )}
    >
      <button
        type="button"
        onClick={() => (meetingPage ? null : handleDates())}
        className={classNames(
          !isEqual(day.toString(), selectedDay) &&
            isToday(day.toString()) &&
            "text-red-500",
          active === day.toString() && "bg-gray-900 text-white",
          "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
        )}
      >
        <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
      </button>
    </div>
  );
}

export default Day;
let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
