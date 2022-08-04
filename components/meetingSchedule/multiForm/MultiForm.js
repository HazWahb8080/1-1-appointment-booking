import React from "react";
import Step1 from "../steps/step1/Step1";
import Step2 from "../steps/step2/Step2";
import Step3 from "../steps/step3/Step3";
import { useRecoilState } from "recoil";
import { MeetingFormState } from "../../../atoms/FormAtom";
function MultiForm({ meetingData }) {
  // data has the title
  // dates has the docs of the dates avaialable to this appointment with slots within
  const { data, dates} = meetingData;
  const [meetingFormState, setMeetingFormState] =
    useRecoilState(MeetingFormState);
  const { step, email, name, selectedDates } = meetingFormState;
  const handleStep = (toDo) => {
    setMeetingFormState(
      toDo === "+"
        ? { ...meetingFormState, step: step + 1 }
        : { ...meetingFormState, step: step - 1 }
    );
  };
  var CLIENT_ID = process.env.REACT_APP_CLIENT_SECRET
  var API_KEY = process.env.REACT_APP_API_KEY
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
  var SCOPES = "https://www.googleapis.com/auth/calendar.events"
  const booknow = () => {
      gapi.load('client:auth2', () => {
      console.log('loaded client')

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })

      gapi.client.load('calendar', 'v3', () => console.log('bam!'))

      gapi.auth2.getAuthInstance().signIn()
      .then(() => {
        var event = {
          'summary': 'Awesome Event!',
          'location': '800 Howard St., San Francisco, CA 94103',
          'description': 'Really great refreshments',
          'start': {
            'dateTime': '2020-06-28T09:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
          },
          'end': {
            'dateTime': '2020-06-28T17:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
          },
          'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=2'
          ],
          'attendees': [
            {'email': 'lpage@example.com'},
            {'email': 'sbrin@example.com'}
          ],
          'reminders': {
            'useDefault': false,
            'overrides': [
              {'method': 'email', 'minutes': 24 * 60},
              {'method': 'popup', 'minutes': 10}
            ]
          }
        }

        var request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event,
        })

        request.execute(event => {
          console.log(event)
          window.open(event.htmlLink)
        })
        

        /*
            Uncomment the following block to get events
        */
        /*
        // get events
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(response => {
          const events = response.result.items
          console.log('EVENTS: ', events)
        })
        */
      })
    })
  }

  return (
    <div className="w-full my-6 xl:w-1/2 space-y-6 lg:h-[700px]  items-center justify-center flex flex-col">
      {step === 1 ? (
        <Step1 data={data} />
      ) : step === 2 ? (
        <Step2 meetingData={meetingData} />
      ) : (
        <Step3 meetingData={meetingData} />
      )}
      <div className="w-full flex px-2 space-x-4 items-center justify-center">
        {step > 1 && (
          <button onClick={() => handleStep("-")} className="form-btn">
            Back
          </button>
        )}
        {step === 3 && (
          <button 
          disabled = {!name.trim() || !email.trim()}
          onClick={booknow} className="form-btn bg-blue-100 border-blue-800 ">
            book now 
          </button>
        )}
        {step < 3 && (
          <button onClick={() => handleStep("+")} className="form-btn">
            { step === 1 ? "Let's get started" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}

export default MultiForm;
