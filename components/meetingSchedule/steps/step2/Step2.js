import React from 'react'
import Calendar from './../../../calendar/Calendar';

function Step2({meetingData}) {
  const {data,dates,id,email} = meetingData;
  return (
    <div className='w-full'>
      <Calendar meetingPage={true} meetingDates={dates} meetingData={data} meetingEmail={email} meetingId={id}  />
    </div>
  )
}

export default Step2