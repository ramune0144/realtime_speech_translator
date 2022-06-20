import React, { useState, useEffect } from 'react'
import * as Icon from 'react-bootstrap-icons'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'th-TH'

function App() {
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState('')
  useEffect(() => {
    handleListen()
  }, [isListening])

  const handleListen = () => {
    if (isListening) {
      mic.start()
      mic.onend = () => {
        console.log('continue..')
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }

    mic.onresult = (event) => {
      // const transcript = Array.from(event.results)
      //   .map((result) => result[0])
      //   .map((result) => result.transcript)
      //   .join('')
      let fin_cheak = false
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
        if (event.results[i].isFinal) {
          fin_cheak=true
        } else {
          if (!fin_cheak) {
            setNote(note+event.results[i][0].transcript)
          }
          else{
            setNote('')
            fin_cheak = false
          }
         
        }
      }

      mic.onerror = (event) => {
        console.log(event.error)
      }
    }
  }

  const [TransText, setTransText] = useState('')
  const trans = async (sentences) => {
    try {
      const response = await axios.get(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=th&tl=en&dt=t&ie=UTF-8&oe=UTF-8&q=${sentences}`
      )
      console.log(response.data[0][0][0])
      setTransText(response.data[0][0][0])
      
      
    } catch (error) {
      console.log(error)
    }
  }

  trans(note)
  return (
    <div>
      <h1>{TransText}</h1>
      <button style={{marginTop:"30%"}} onClick={() => setIsListening(!isListening)}>
            Start/Stop
          </button>
      <h5 >{isListening?"Start":"stop"} </h5>
    </div>
  )
}

export default App
