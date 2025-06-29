import React, { useState } from "react";
import { FaEnvelope, FaQrcode, FaArrowLeft, FaCopy, FaWhatsapp, FaSlack } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import api from "../../api/api";

const ShareSurveyModal = ({ isOpen, onClose, survey, staffEmails }) => {
  const [view, setView] = useState("options");

  if (!isOpen || !survey) return null;

  const surveyUrl = `${window.location.origin}/survey/take/${survey.id}`;
  // const surveyUrl = `${window.location.origin}/survey/take/${survey.joinCode}`;

  const handleEmailShare = async () => {
    // const subject = encodeURIComponent(`You're invited to a survey: ${survey.title}`);
    // const body = encodeURIComponent(`Please take this survey using the link below:\n\n${surveyUrl}`);
    // const mailtoLink = `mailto:${staffEmails.join(",")}?subject=${subject}&body=${body}`;
    // window.location.href = mailtoLink;
    try {
      const subject = encodeURIComponent(`You're invited to a survey: ${survey.title}`);
      const body = encodeURIComponent(`Please take this survey using the link below:\n\n${surveyUrl}`);
      const surveyId = survey.id
  
      const response = await api.post(`/survey/sendSurvey/${surveyId}`, { 
        // surveyId: surveyId,
        subject: subject,
        body: body 
      });
  
      if (response.data) {
        alert("Survey invitation sent successfully");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl);
      alert("Survey link copied to clipboard!");
    } catch {
      alert("Failed to copy link.");
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `Please take this survey:\n\n${surveyUrl}`
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSlackShare = () => {
    alert("Copy the link and share it in a Slack message.");
  };

  const handleTeamsShare = () => {
    const mailto = `mailto:?subject=Survey Invitation&body=Please take this survey:\n\n${surveyUrl}`;
    window.location.href = mailto;
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] relative shadow-lg mx-8">
        <button className="absolute top-2 right-3 text-gray-500 hover:text-red-500" onClick={onClose}>
          ✕
        </button>

        {view === "options" && (
          <>
            <h2 className="text-xl font-bold mb-4">Share Survey</h2>

            <button
              onClick={handleEmailShare}
              className="w-full flex items-center gap-2 p-3 mb-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              <FaEnvelope /> Share via Email
            </button>

            <button
              onClick={() => setView("qr")}
              className="w-full flex items-center gap-2 p-3 mb-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              <FaQrcode /> Generate QR Code
            </button>

            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-2 p-3 mb-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
            >
              <FaCopy /> Copy Link
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center gap-2 p-3 mb-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              <FaWhatsapp /> Share on WhatsApp
            </button>

            <button
              onClick={handleSlackShare}
              className="w-full flex items-center gap-2 p-3 mb-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              <FaSlack /> Share on Slack
            </button>

            <button
              onClick={handleTeamsShare}
              className="w-full flex items-center gap-2 p-3 bg-blue-800 text-white rounded hover:bg-blue-900 transition"
            >
              <FaEnvelope /> Share on Teams
            </button>
          </>
        )}

        {view === "qr" && (
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-3">Scan to access the survey</h2>
            <QRCodeSVG value={surveyUrl} size={180} className="mx-auto" />
            <p className="mt-4 text-sm break-words text-gray-600">{surveyUrl}</p>

            <button
              onClick={() => setView("options")}
              className="mt-4 flex items-center text-blue-500 hover:underline"
            >
              <FaArrowLeft className="mr-1" /> Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareSurveyModal;
