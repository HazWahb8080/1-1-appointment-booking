import Head from "next/head";

import React, { useState } from "react";
import Header from "./../components/Header";

export default function Home() {
 

  return (
    <div className="w-full h-screen items-start justify-start flex">
      <Head>
        <title>1-1 Booking</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
    </div>
  );
}
