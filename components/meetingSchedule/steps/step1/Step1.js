/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { step1MeetingImg } from '../../../../utils/images/imgsDb'

function Step1({data}) {
  return (
    <div className="w-full h-full items-center justify-center flex-col flex">
        <img src={step1MeetingImg} alt="step1image" className="w-[150px] object-cover object-center"  />
        <h1 className="text-5xl text-gray-800"> welcome! </h1>
    </div>
  )
}

export default Step1