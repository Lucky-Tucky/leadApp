import { useEffect, useState } from "react";
import { getLeads, updateLead } from "../apis/leadApi";
import Table from "../utils/table/table";
import LeadInfo from "../LeadInfo/leadinfo";

export default function Dashboard() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [isEditing, setIsEditing] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [viewMode, setViewMode] = useState('Edit');

    const handleActionClick = (action, rowData) => {
        if (action === 'Edit' || action === 'View') {
            setSelectedLead(rowData);
            setIsEditing(true);
            setViewMode(action);
        } else if (action === 'Delete') {
            console.log('Delete triggered on row:', rowData);
            // Handle delete action here
        }
    };

    const getLeadsList = async (page = 1) => {
        try {
            setLoading(true);
            const data = await getLeads(page, 10);
            const formattedLeads = (data.data || []).map(lead => {
                const d = new Date(lead.created_at);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                
                return {
                    ...lead,
                    created_at: `${day}/${month}/${year}`
                };
            });
            setLeads(formattedLeads);
            setCurrentPage(data.meta?.page || 1);
            setTotalPages(data.meta?.totalPages || 1);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching leads:", err);
            setError("Failed to fetch leads");
            setLoading(false);
        }
    }

    useEffect(() => {
        getLeadsList(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSaveLead = async (id, formData) => {
        try {
            await updateLead(id, formData);
            setIsEditing(false);
            setSelectedLead(null);
            getLeadsList(currentPage); // Refresh current page
        } catch (err) {
            console.error("Failed to update lead", err);
            alert("Failed to update lead.");
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setSelectedLead(null);
    };

    const columns = ["name", "email", "phone", "source", "status", "created_at"];
    const actions = ["View", "Edit", "Delete"];

    return (
        <div style={{ padding: '20px' }}>
            <h2>Leads Dashboard</h2>
            {loading && <p>Loading leads...</p>}
            {error && <p>{error}</p>}
            
            {!isEditing ? (
                <>
                    {!loading && !error && leads.length > 0 && (
                        <Table 
                            data={leads} 
                            columns={columns} 
                            actions={actions} 
                            onActionClick={handleActionClick}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                    {!loading && !error && leads.length === 0 && (
                        <p>No leads found.</p>
                    )}
                </>
            ) : (
                <LeadInfo 
                    lead={selectedLead}
                    mode={viewMode}
                    onSave={handleSaveLead}
                    onCancel={handleCancelEdit}
                />
            )}
        </div>
    )
}