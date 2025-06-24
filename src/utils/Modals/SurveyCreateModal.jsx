import { useState } from "react";
import api from "../../api/api";

const SurveyCreateModal = ({ isOpen, onClose, organizationId, onCreated }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true)
  
    const handleSubmit = async () => {
      await api.post("/surveys", {
        title,
        description,
        organizationId,
        isActive
      });
      onCreated();
      onClose();
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="modal">
        <div className="modal-box">
          <h2 className="text-xl font-semibold mb-2">Create Survey</h2>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={isActive}
              onChange={e => setIsActive(e.target.value)}
              className="mr-2"
            />
            <label>Is Active</label>
          </div>

          <div className="modal-action">
            <button onClick={handleSubmit} className="btn-primary">Create</button>
            <button onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default SurveyCreateModal;
  