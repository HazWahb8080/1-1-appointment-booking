import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { FormState } from "../../atoms/FormAtom";
import {
  collection,
  deleteDoc,
  setDoc,
  doc,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/router";

function Step1() {
  const router = useRouter();
  const {create:query} = router.query;
  const { data: session } = useSession();
  const [formData, setFormData] = useRecoilState(FormState);
  const usermail = session?.user?.email
  // useEffect(() => {
  //   onSnapshot(
  //     query(collection(db, "users", session?.user?.email, "appointments")),
  //     (snapshot) => {
  //         }
  //       });
  //     }
  //   );
  // }, [session]);
  return (
    <div className="h-full w-full flex space-y-12 border  flex-col items-center justify-start py-12 px-12">
      <div className="w-full space-y-3 py-4">
        <h1 className="text-xl font-medium w-full text-gray-900">Title: *</h1>
        <input
          value={formData.title}
          onChange={async (e) => {
            setFormData({ ...formData, title: e.target.value });
            setTimeout(async () => {
              await updateDoc(
                doc(db, "users", usermail, "appointments", query),
                {
                  title: e.target.value,
                }
              );
            }, 1500);
          }}
          className="input text-lg "
          type="text"
          placeholder={`meeting with ${session?.user?.name} `}
        />
      </div>
      <div className="w-full space-y-3 py-4">
        <h1 className="text-xl font-medium w-full text-gray-900">
          Description:
        </h1>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="input text-lg h-[200px] py-2 "
          type="text"
        />
      </div>
    </div>
  );
}

export default Step1;
