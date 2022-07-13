import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  parse,
  startOfToday,
  formatISO,
} from "date-fns";
import { Fragment, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { FormState } from "../../atoms/FormAtom";
import Day from "./Day";
import {
  collection,
  deleteDoc,
  setDoc,
  doc,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Slot from "./Slot";

export default function Calendar() {
  let today = startOfToday();
  const [formData, setFormData] = useRecoilState(FormState);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }
  const { data: session } = useSession();
  const router = useRouter();
  const { create: query } = router.query;
  const usermail = session?.user?.email;
  // get dates created to add timeslots to it
  const [dates, setDates] = useState([]);
  const [interval, setInterval] = useState(15);
  const [activeDate, setActiveDate] = useState();
  const [Loading, setLoading] = useState();
  useEffect(() => {
    onSnapshot(
      collection(db, "users", usermail, "appointments", query, "dates"),
      (snapshot) => {
        setDates(snapshot.docs);
      }
    );
  }, []);

  return (
    <div className="pt-16">
      <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
          <div className="md:pr-14">
            <div className="flex items-center">
              <h2 className="flex-auto font-semibold text-gray-900">
                {format(firstDayCurrentMonth, "MMMM yyyy")}
              </h2>
              <button
                type="button"
                onClick={previousMonth}
                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Previous month</span>
                <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={nextMonth}
                type="button"
                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Next month</span>
                <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>
            <div className="grid grid-cols-7 mt-2 text-sm">
              {days.map((day, dayIdx) => (
                <Day
                  key={day.toString()}
                  day={day}
                  currentMonth={currentMonth}
                />
              ))}
            </div>
          </div>

          <section className="mt-12 md:mt-0 md:pl-14 space-y-6 ">
            <select
              placeholder="choose date"
              onChange={(e) => {
                setActiveDate(e.target.value);
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  setActiveDate(e.target.value);
                }, 500);
              }}
              className="select input cursor-pointer"
            >
              <option>choose date</option>
              {dates.map((date) => (
                <option key={date.id} value={date.id}>
                  {formatISO(new Date(date.id), {
                    representation: "date",
                  })}
                </option>
              ))}
            </select>
            <div className="w-full">
              <p className="text-gray-600">Interval</p>
              <input
                value={interval}
                type="number"
                step={15}
                onChange={(e) => setInterval(e.target.value)}
                max="45"
                min="15"
                className="w-full border border-gray-300 py-2 px-2"
              />
            </div>
            {!Loading && (
              <div className="border-t border-black py-3 px-3 h-[300px] scrollbar-hide overflow-y-scroll ">
                {Array.from({ length: 12 }, (_, i) => (
                  <Slot
                    hour={i + 1}
                    int={interval}
                    am
                    activeDate={activeDate}
                  />
                ))}

                <div className="border border-black/10 p-0 w-full my-4" />
                {Array.from({ length: 12 }, (_, i) => (
                  <Slot
                    hour={i + 1}
                    int={interval}
                    pm
                    activeDate={activeDate}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
