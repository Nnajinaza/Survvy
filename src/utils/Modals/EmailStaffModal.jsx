import { useState } from "react";
import api from "../../api/api";

const EmailStaffModal = ({ isOpen, onClose, staffEmails }) => {
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
  
    const sendEmails = async () => {
      await api.post("/email/send", {
        to: staffEmails,
        subject,
        body
      });
      onClose();
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="modal">
        <div className="modal-box">
          <h2 className="text-xl font-semibold mb-2">Email Staff</h2>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" />
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Message" />
          <div className="modal-action">
            <button onClick={sendEmails} className="btn-primary">Send</button>
            <button onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default EmailStaffModal;
  