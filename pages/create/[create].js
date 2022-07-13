import { Router, useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Header from "../../components/Header";
import CreateAppointment from "../../components/CreateAppointment";
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
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useRecoilState } from "recoil";
import { FormState } from "../../atoms/FormAtom";

function create() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useRecoilState(FormState);
  const usermail = session?.user?.email;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { create: docId } = router.query;

  useEffect(() => {
    async function getData() {
      if (usermail && docId) {
        const docRef = doc(db, "users", usermail, "appointments", docId);
        const docData = await getDoc(docRef);
        console.log(docData.data().title)
        if (docData.exists()) {
          setFormData({ ...formData, title: docData.data().title });
        }
      }
    }
    getData();
  }, [usermail, docId]);

  useEffect(() => {
    if (status === "loading") setLoading(true);
    if (status === "authenticated") {
      setLoading(false);
    }
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [session]);
  return (
    <div className="items-center justify-center flex flex-col w-full" >
      <Header />
      {loading ? (
        <div className="w-full h-screen items-center justify-center flex">
          Loading
        </div>
      ) : (
        <div className=" px-12 w-full ">
          <CreateAppointment />
        </div>
      )}
    </div>
  );
}

export default create;
