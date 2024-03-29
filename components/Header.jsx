import React, { useState, useRef } from "react";
import { create_Icon, logo } from "./../utils/svgs/svgs";
import { useRouter } from "next/router";
import { signOut, signIn, useSession } from "next-auth/react";
import { Modal, Text, Input, Row, Checkbox, Button } from "@nextui-org/react";
import { useRecoilState } from "recoil";
import { FormState } from "../atoms/FormAtom";
import {
  collection,
  deleteDoc,
  setDoc,
  doc,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

function Header({ meetingPage }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const closeHandler = () => {
    setOpen(false);
  };
  const titleRef = useRef(null);
  const usermail = session?.user?.email;
  const [formData, setFormData] = useRecoilState(FormState);

  const createAppointment = async () => {
    if (!usermail) return;
    const doc = await addDoc(
      collection(db, "users", usermail, "appointments"),
      {
        title: formData.title,
        timestamp: serverTimestamp(),
      }
    );
    router.push(`/create/${doc.id}`);
    setOpen(false);
    setFormData({ ...formData, step: 1 });
  };

  return (
    <div className="shadow-md shadow-gray-50 w-full flex py-6 px-12 items-center justify-between">
      {/* logo */}
      <div
        onClick={() => router.push("/dash")}
        className="flex space-x-1 hover:opacity-80 cursor-pointer "
      >
        <div className="w-8 h-8 items-center justify-center flex">{logo}</div>
        <h1 className="self-center font-medium text-gray-900 text-xl">
          Boookly
        </h1>
      </div>
      {/* navlinks + btn */}
      <div className="items-center justify-evenly space-x-12 flex">
        <h1 className="nav-title hidden lg:flex"> Blog </h1>
        <h1 className="nav-title hidden lg:flex"> Pricing </h1>
        {!meetingPage && session && (
          <h1 className="nav-title" onClick={signOut}>
            signOut
          </h1>
        )}
        {!meetingPage && (
          <div>
            <button
              onClick={() => (session ? setOpen(true) : signIn())}
              className="CTA-btn"
            >
              {session ? "Create Appointment" : "SignIn"}
            </button>
          </div>
        )}
        <Modal
          width="500px"
          css={{ height: "400px" }}
          closeButton
          aria-labelledby="modal-title"
          open={open}
          onClose={() => setOpen(false)}
        >
          <Modal.Header>
            <h1 className="py-2 text-2xl">Create new Appointment</h1>
          </Modal.Header>
          <div className="w-full h-full space-y-6 items-center justify-center flex flex-col border px-6">
            <div className="w-full pb-2 text-lg">
              <h1 className="w-full text-left">Title</h1>
              <div className="w-full flex space-x-3">
                <input
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  type="text"
                  className="input"
                  onKeyPress={(e) => e.key === "Enter" && createAppointment()}
                />
                <div
                  onClick={createAppointment}
                  className="w-6 h-6 items-center justify-center 
                flex self-center hover:text-blue-600 smooth"
                >
                  {create_Icon}
                </div>
              </div>
            </div>
          </div>
          <div className=" w-full bg-gray-50 py-6 px-6  items-center justify-center flex">
            <button
              className="px-4 py-2 form-btn lg:w-1/2 w-full "
              onClick={closeHandler}
            >
              Close
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Header;
