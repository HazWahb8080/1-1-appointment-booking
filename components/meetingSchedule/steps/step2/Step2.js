import React from 'react'
import Calendar from './../../../calendar/Calendar';

function Step2({meetingData}) {
  const {data,dates} = meetingData;
  return (
    <div className='w-full'>
      <Calendar meetingPage={true} meetingDates={dates}  />
    </div>
  )
}

export default Step2