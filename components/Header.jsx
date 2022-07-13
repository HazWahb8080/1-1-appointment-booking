import React, { useState, useRef } from "react";
import { create_Icon, logo } from "./../utils/svgs/svgs";
import { useRouter } from "next/router";
import { signOut,signIn, useSession } from "next-auth/react";
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

function Header() {
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
    setOpen(false);
    setFormData({ ...formData, step: 1 });
    router.push(`/create/${doc.id}`);
  };

  return (
    <div className=" border-b border-black w-full flex py-6 px-12 items-center justify-between">
      {/* logo */}
      <div className="flex space-x-1">
        <div className="w-8 h-8 items-center justify-center flex">{logo}</div>
        <h1 className="self-center font-medium text-gray-900 text-xl">
          Bookify
        </h1>
      </div>
      {/* navlinks + btn */}
      <div className="items-center justify-evenly space-x-12 flex">
        <h1> Dashboard </h1>
        <h1> Blog </h1>
        <h1> Pricing </h1>
        {session && <h1 onClick={signOut}>signOut</h1>}
        <div>
          <button
            onClick={() => session ?  setOpen(true) : signIn() }
            className="bg-black py-3 px-4 text-gray-100 hover:bg-white hover:text-gray-900 transition border border-transparent ease-in-out duration-300 hover:border-black"
          >
            {session ? "Create Appointment" : "SignIn"}
          </button>
        </div>
        <Modal
          width="500px"
          css={{ height: "400px" }}
          closeButton
          aria-labelledby="modal-title"
          open={open}
          onClose={() => setOpen(false)}
        >
          <Modal.Header>
            <h1 className="py-5 text-2xl">Create new Appointment</h1>
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
            <div className=" w-full py-3 px-6 border-b border-black/50 items-center justify-center flex">
              <button
                className="px-4 py-1 form-btn lg:w-1/2 w-full "
                onClick={closeHandler}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Header;
