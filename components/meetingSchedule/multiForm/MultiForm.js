import React from 'react'
import Step1 from '../steps/step1/Step1';

function MultiForm({meetingData}) {
    // data has the title
    // dates has the docs of the dates avaialable to this appointment with slots within
    const {data,dates} = meetingData;

  return (
    <div className="w-full h-3/4 items-center justify-center flex flex-col">
        <Step1 data={data} />
    </div>
  )
}

export default MultiForm