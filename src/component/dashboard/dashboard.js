import { useEffect, useState } from "react";
import { getLeads, updateLead, createLead } from "../apis/leadApi";
import Table from "../utils/table/table";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const handleActionClick = (action, rowData) => {
        if (action === 'Edit' || action === 'View') {
            navigate(`/lead/${rowData.id}`, { state: { mode: action } });
        } else if (action === 'Delete') {
            console.log('Delete triggered on row:', rowData);
            // Handle delete action here
        }
    };

    const handleCreateNew = () => {
        navigate('/lead/new');
    };

    const getLeadsList = async (page = 1) => {
        try {
            setLoading(true);
            const data = await getLeads(page, 10, searchTerm, statusFilter);
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
    }, [currentPage, statusFilter]);

    // Handle search manually or with a debounce if needed, but we'll use a simple button to avoid excessive calls
    const handleSearch = () => {
        setCurrentPage(1);
        getLeadsList(1);
    };

    const handleReset = () => {
        setSearchTerm("");
        setStatusFilter("");
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };


    const columns = ["name", "email", "phone", "source", "status", "created_at"];
    const actions = ["View", "Edit", "Delete"];

    const renderLoader = () => (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div className="spinner"></div>
            <style>{`
                .spinner {
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border-left-color: #3b82f6;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );

    return (
        <div style={{ padding: '20px' }}>
            <h2>Leads Dashboard</h2>
            {error && <p className="error-text">{error}</p>}
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button 
                    onClick={handleCreateNew} 
                    style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    + Create Lead
                </button>
                <div style={{ width: '1px', height: '24px', background: '#cbd5e1', margin: '0 5px' }}></div>
                <input 
                    type="text" 
                    placeholder="Search by name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
                <select 
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                >
                    <option value="">All Statuses</option>
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="WON">WON</option>
                    <option value="LOST">LOST</option>
                </select>
                <button onClick={handleSearch} style={{ padding: '8px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Search</button>
                {(searchTerm || statusFilter) && (
                    <button onClick={handleReset} style={{ padding: '8px 12px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}>Reset</button>
                )}
            </div>

            {loading ? (
                renderLoader()
            ) : !error && leads.length > 0 ? (
                <Table 
                    data={leads} 
                    columns={columns} 
                    actions={actions} 
                    onActionClick={handleActionClick}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            ) : !error && leads.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No leads found matching your criteria.</p>
            ) : null}
        </div>
    )
}