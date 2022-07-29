import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { FormState } from "../../atoms/FormAtom";
import { useSession } from "next-auth/react";
import {
  collection,
  doc,
  addDoc,
  serverTimestamp,
  deleteDoc,
  where,
  query,
  limit,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/router";

function Step3() {
  const [formData, setFormData] = useRecoilState(FormState);
  const [Link, setLink] = useState(formData.title);
  const { data: session } = useSession();
  const router = useRouter();
  const { create: queryId } = router.query;
  const [loading, setLoading] = useState(false);
  const [Published, setPublished] = useState(false);

  const publishAppointment = async () => {
    setLoading(true);
    if (loading) return;
    // checking first if there is a doc there or not with the same title and details.
    // remove old versions of this appointment and then create the current version
    const q = query(collection(db, "published"), where("date", "==", queryId));
    const docs = await getDocs(q);
    docs.forEach(async (docdelete) => {
      await deleteDoc(doc(db, "published", docdelete.id));
    });
    await addDoc(collection(db, "published"), {
      title: Link,
      linkTitle: Link.trim().replace(/ /g, "-"),
      timestamp: serverTimestamp(),
      organizer: session?.user?.email,
      date: queryId,
    });
    setLoading(false);
    setPublished(true);
  };

  return (
    <div className="items-center justify-center space-y-12 flex border border-gray-300 w-full flex-col h-full py-3 px-4">
      {!Published ? (
        <div className="w-full items-center justify-center flex flex-col space-y-2 ">
          <div className="lg:w-1/2 w-full">
            <h1 className="text-sm font-medium border-b text-gray-600 ">
              Link
            </h1>
            <input
              type="text"
              className="input w-full"
              value={Link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <div className="lg:w-1/2 w-full items-end justify-end flex">
            <button onClick={publishAppointment} className="w-full form-btn">
              Publish
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full items-center justify-center flex flex-col space-y-2 ">
          <div className="lg:w-1/2 w-full ">
            <h1 className="text-sm font-medium border-b text-gray-600 ">
              Link
            </h1>
            <input
              type="text"
              className="input w-full"
              value={`https://bookify-three.vercel.app/meeting/${Link.trim().replace(
                / /g,
                "-"
              )}`}
            />
          </div>
          <div className="lg:w-1/2 w-full items-end justify-end flex">
            <button
              onClick={() => router.push("/dash")}
              className="w-full form-btn"
            >
              go to dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Step3;
