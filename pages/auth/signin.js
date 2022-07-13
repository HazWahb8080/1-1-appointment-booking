import React from "react";
import { getProviders, signIn } from "next-auth/react";

export default function Signin({ providers }) {
  return (
    <div className="bg-black h-screen items-center justify-center flex overflow-hidden text-gray-500">
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="px-3 bg-white py-3 text-gray-900 font-bold rounded-lg"
            onClick={() => signIn(provider.id, { callbackUrl: "/dash" })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
