import React, { useState, useEffect } from 'react';
import { getNotes, createNote } from '../apis/notesApi';
import './leadinfo.css';

const LeadInfo = ({ lead, mode = 'Edit', onSave, onCancel }) => {
  const isReadOnly = mode === 'View';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    status: ''
  });

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loadingNotes, setLoadingNotes] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        source: lead.source || '',
        status: lead.status || ''
      });
      fetchNotes(lead.id);
    }
  }, [lead]);

  const fetchNotes = async (id) => {
    setLoadingNotes(true);
    try {
      const data = await getNotes(id);
      setNotes(data.data || []);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (lead.status !== formData.status) {
      try {
        const autoNote = `Status changed from ${lead.status || 'None'} to ${formData.status}`;
        await createNote(lead.id, autoNote);
      } catch (err) {
        console.error("Failed to auto-save status note:", err);
      }
    }

    onSave(lead.id, formData);
  };

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await createNote(lead.id, newNote);
      if (res.data) {
        setNotes([res.data, ...notes]);
        setNewNote('');
      }
    } catch (err) {
      console.error("Failed to save note:", err);
      alert("Failed to save note.");
    }
  };

  if (!lead) return null;

  return (
    <div className="leadinfo-container">
      <div className="leadinfo-header">
        <h3>Lead Details</h3>
        <button className="btn-back" onClick={onCancel}>&larr; Back to Dashboard</button>
      </div>

      <div className="leadinfo-layout">
        {/* Left Column: Form */}
        <div className="leadinfo-card form-section">
          <h4>Contact Information</h4>
          <form onSubmit={handleSubmit} className="lead-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group">
              <label htmlFor="source">Source</label>
              <input 
                type="text" 
                id="source" 
                name="source" 
                value={formData.source} 
                onChange={handleChange} 
                disabled={isReadOnly}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select 
                id="status" 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                disabled={isReadOnly}
              >
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="QUALIFIED">QUALIFIED</option>
                <option value="WON">WON</option>
                <option value="LOST">LOST</option>
              </select>
            </div>

            {!isReadOnly && (
              <div className="form-actions">
                <button type="submit" className="btn-save">Save Changes</button>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Notes */}
        <div className="leadinfo-card notes-section">
          <h4>Notes</h4>
          
          <div className="add-note-container">
            <textarea
              className="note-input"
              placeholder="Add a new note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows="3"
            />
            <button className="btn-save-note" onClick={handleSaveNote} disabled={!newNote.trim()}>
              Save Note
            </button>
          </div>

          <div className="notes-list">
            {loadingNotes ? (
              <p>Loading notes...</p>
            ) : notes.length === 0 ? (
              <p className="no-notes">No previous notes.</p>
            ) : (
              notes.map(note => (
                <div key={note.id} className="note-item">
                  <div className="note-text">{note.note}</div>
                  <div className="note-date">
                    {new Date(note.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadInfo;
