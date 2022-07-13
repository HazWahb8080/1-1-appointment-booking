import React from 'react'

function Progress({step}) {
  return (
      <progress
          className="progress progress-success w-[500px] h-[10px] bg-green-100 "
          value={step === 1 ? "50" : step === 2 ? "100" : "150"}
          max="150"
        ></progress>
  )
}

export default Progress