"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { TiTick } from "react-icons/ti";
import axios from 'axios';

export default function Home() {
  const [ticketData, setTicketData] = useState("No Ticket Found!");
  const [qrResult, setQrResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const resetQrCode = () => {
    setTicketData("No Ticket Found!");
    setQrResult(false);
  };

  const acceptAssistance = (assistantId) => {
    const response = axios.patch(`/api/assistants/${assistantId}`, { "assistantAssistance": true });
    response.then((res) => {
      if (res.status === 200) {
        return console.info("Assistance Accepted: ", res.data);
      }
    })
  }

  const doApiRequest = (assistantId) => {
    try {
      console.log(assistantId)
      // Check if the assistantId is valid
      const response = axios.get(`/api/assistants/${assistantId}`);
      response.then((res) => {
        if (res.status === 200) {
          if (res?.data?.assistantAssistance != true && res?.data?.assistantId)
            return acceptAssistance(assistantId);
          else
            setConfirm(false);
            setTicketData("Ticket Already Confirmed!");
            setQrResult(false);
        }
      })
    } catch (error) {
      console.error(error.message);
    }
  }

  const sendAssist = (assistantId) => {
    console.info(assistantId);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConfirm(true);
      doApiRequest(assistantId);
      setTimeout(() => {
        setConfirm(false);
        resetQrCode();
      }, 5000);
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="mb-4 text-2xl font-bold">Scan a Ticket</h1>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setTicketData(`${result?.text}`);
            setQrResult(true);
          }
        }}
        className={`w-[300px] h-[300px] rounded-lg border-4 ${
          qrResult ? "border-green-500" : "border-gray-500"
        } bg-gray-100 mb-8`}
        videoContainerStyle={{ width: "100%", height: "100%" }} // Set the frame size to match the container
        constraints={{ facingMode: "environment" }} // Set the camera facing mode to "environment"
      />
      <p className="text-xl font-bold text-center">{ticketData}</p>
      <div className="flex justify-center pt-5 whitespace-pre confirmation-btns">
        {qrResult && (
          <>
            {loading ? (
              <div className="loading-spinner loading"></div> // Render the spinner when loading is true
            ) : confirm ? (
              <p className="flex items-center text-lg font-bold">Ticket Confirmado <TiTick className="text-green-500 animate-bounce" size={30}/></p>
            ) : (
              <>
                <button
                  className="btn btn-success"
                  onClick={() => sendAssist(ticketData)}
                >
                  Confirm Assistance
                </button>
                <br />
                <button
                  className="w-32 ml-10 btn btn-error"
                  onClick={() => resetQrCode()}
                >
                  Cancel
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
