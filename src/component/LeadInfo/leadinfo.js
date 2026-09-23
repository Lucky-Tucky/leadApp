import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getNotes, createNote } from '../apis/notesApi';
import { getLeadById, createLead, updateLead } from '../apis/leadApi';
import './leadinfo.css';

const LeadInfo = ({ mode: defaultMode = 'Edit' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState(location.state?.mode || defaultMode);
  
  const isReadOnly = mode === 'View';
  const isCreate = mode === 'Create';
  
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(!isCreate);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    status: 'NEW'
  });
  const [errors, setErrors] = useState({});

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loadingNotes, setLoadingNotes] = useState(false);

  useEffect(() => {
    if (isCreate) {
      setFormData({ name: '', email: '', phone: '', source: '', status: 'NEW' });
      setNotes([]);
      setErrors({});
      setLoading(false);
      return;
    }

    const fetchLeadData = async () => {
      try {
        setLoading(true);
        const data = await getLeadById(id);
        const leadData = Array.isArray(data.data) ? data.data[0] : data.data;
        if (!leadData) throw new Error("Lead not found");
        
        setLead(leadData);
        setFormData({
          name: leadData.name || '',
          email: leadData.email || '',
          phone: leadData.phone || '',
          source: leadData.source || '',
          status: leadData.status || 'NEW'
        });
        fetchNotes(id);
      } catch (err) {
        console.error("Failed to fetch lead data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadData();
  }, [id, isCreate]);

  const fetchNotes = async (leadId) => {
    setLoadingNotes(true);
    try {
      const data = await getNotes(leadId);
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
    // Clear error on type
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    
    if (formData.phone && !/^\+?[0-9\s\-()]{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Auto-create note on status change (only if editing an existing lead)
    if (!isCreate && lead && lead.status !== formData.status) {
      try {
        const dateStr = new Date().toLocaleString();
        const autoNote = `[System Update] Status changed from ${lead.status || 'None'} to ${formData.status} on ${dateStr}`;
        await createNote(id, autoNote);
      } catch (err) {
        console.error("Failed to auto-save status note:", err);
      }
    }

    try {
      if (isCreate) {
        await createLead(formData);
      } else {
        await updateLead(id, formData);
      }
      navigate('/');
    } catch (err) {
      console.error("Failed to save lead:", err);
      alert("Failed to save lead.");
    }
  };

  const handleSaveNote = async () => {
    if (!newNote.trim()) {
      alert("Note cannot be empty.");
      return;
    }
    try {
      const res = await createNote(id, newNote);
      if (res.data) {
        setNotes([res.data, ...notes]);
        setNewNote('');
      }
    } catch (err) {
      console.error("Failed to save note:", err);
      alert("Failed to save note.");
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="leadinfo-container">
      <div className="leadinfo-header">
        <h3>{isCreate ? 'Create New Lead' : isReadOnly ? 'Lead Details' : 'Edit Lead'}</h3>
        <button className="btn-back" type="button" onClick={() => navigate('/')}>&larr; Back to Dashboard</button>
      </div>

      <div className="leadinfo-layout">
        {/* Left Column: Form */}
        <div className="leadinfo-card form-section">
          <h4>Contact Information</h4>
          <form onSubmit={handleSubmit} className="lead-form">
            <div className="form-group">
              <label htmlFor="name">Name <span style={{color:'red'}}>*</span></label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                disabled={isReadOnly}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email <span style={{color:'red'}}>*</span></label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                disabled={isReadOnly}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
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
              {errors.phone && <span className="error-text">{errors.phone}</span>}
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
                <button type="submit" className="btn-save">{isCreate ? 'Create Lead' : 'Save Changes'}</button>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Notes */}
        {isCreate ? (
          <div className="leadinfo-card notes-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p className="no-notes">Save the lead first to add notes.</p>
          </div>
        ) : (
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
              <button className="btn-save-note" type="button" onClick={handleSaveNote}>
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
        )}
      </div>
    </div>
  );
};

export default LeadInfo;
