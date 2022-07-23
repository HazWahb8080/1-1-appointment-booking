import React from 'react'

function Slots({slots,open}) {
  return (
    <div className="w-full flex items-center justify-center">
     { open && ( slots.length >=1 ? <div className="w-full flex items-center justify-center border border-black ">
            {slots.map((slot) => (
              <div
              key={slot.id}
              className="flex items-center justify-center px-2 py-2"
              >
                <h1 className=""> {slot.data().slot}</h1>
                <h1 className=""> {slot.id.includes("am") ? "am" : "pm"}</h1>
              </div>
            ))}
          </div> : (
            <div>no slots</div>
          ) )}
            </div>
  )
}

export default Slots