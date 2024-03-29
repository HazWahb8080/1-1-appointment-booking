import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  parse,
  startOfToday,
  formatISO,
  toDate,
} from "date-fns";
import { Fragment, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  FormState,
  MeetingFormState,
  activeDateSlotsState,
  ActiveDateState,
} from "../../atoms/FormAtom";
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
import AvailableSlot from "../meetingSchedule/slot/AvailableSlot";

export default function Calendar({
  meetingPage,
  meetingDates,
  meetingData,
  meetingEmail,
  meetingId,
}) {
  let today = startOfToday();
  const [formData, setFormData] = useRecoilState(FormState);
  const [meetingFormState, setMeetingFormState] =
    useRecoilState(MeetingFormState);
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
  const [activeDate, setActiveDate] = useRecoilState(ActiveDateState);
  const [activeDateSlots, setActiveDateSlots] =
    useRecoilState(activeDateSlotsState);
  const [Loading, setLoading] = useState();
  // fetching the slots of the available date on the meeting page
  if (usermail && query) {
    const docRef = collection(
      db,
      "users",
      usermail,
      "appointments",
      query,
      "dates"
    );
  }
  useEffect(() => {
    // here we are getting the slots available for each date
    if (!activeDate || !meetingEmail || !meetingId) return;
    setLoading(true);
    const slotsRef = collection(
      db,
      "users",
      meetingEmail,
      "appointments",
      meetingId,
      "dates",
      activeDate,
      "slots"
    );
    onSnapshot(slotsRef, (snapshot) => {
      setActiveDateSlots(snapshot.docs);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDate, meetingEmail, meetingId]);

  useEffect(() => {
    if (meetingPage) return;
    onSnapshot(docRef, (snapshot) => {
      setDates(snapshot.docs);
    });
  }, [meetingPage]);

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
                  meetingDates={meetingDates}
                  meetingPage={meetingPage ? meetingPage : false}
                  key={day.toString()}
                  day={day}
                  currentMonth={currentMonth}
                />
              ))}
            </div>
          </div>

          <section className="mt-12 md:mt-0 md:pl-14 space-y-6 ">
            <select
              defaultValue={activeDate && activeDate}
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
              <option> choose a date</option>
              {meetingDates
                ? meetingDates.map((date, i) => (
                    <option key={date.id + i} value={date.id}>
                      {formatISO(new Date(date.id), {
                        representation: "date",
                      })}
                    </option>
                  ))
                : dates.map((date, i) => (
                    <option key={date.id + i} value={date.id}>
                      {formatISO(new Date(date.id), {
                        representation: "date",
                      })}
                    </option>
                  ))}
            </select>
            {!meetingPage && (
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
            )}
            {Loading && (
              <div className="border-t border-black py-3 px-3 h-[300px] scrollbar-hide overflow-y-scroll items-center justify-center flex ">
                loading...!
              </div>
            )}
            {!Loading &&
              (meetingDates ? (
                <div className="border-t border-black py-3 px-3 h-[300px] scrollbar-hide overflow-y-scroll ">
                  {activeDateSlots.map((slot) => (
                    <AvailableSlot
                      key={slot.data().slot}
                      slot={slot.data().slot}
                      amOrpm={slot.id.includes("am") ? "am" : "pm"}
                      activeDate={activeDate}
                    />
                  ))}
                </div>
              ) : (
                <div className="border-t border-black py-3 px-3 h-[300px] scrollbar-hide overflow-y-scroll ">
                  {Array.from({ length: 12 }, (_, i) => (
                    <Slot
                      key={i}
                      hour={i + 1}
                      int={interval}
                      am
                      activeDate={activeDate}
                    />
                  ))}

                  <div className="border border-black/10 p-0 w-full my-4" />
                  {Array.from({ length: 12 }, (_, i) => (
                    <Slot
                      key={i}
                      hour={i + 1}
                      int={interval}
                      pm
                      activeDate={activeDate}
                    />
                  ))}
                </div>
              ))}
          </section>
        </div>
      </div>
    </div>
  );
}
