import { useEffect, useState } from "react";
import { getLeads, getLeadStats } from "../apis/leadApi";
import Table from "../utils/table/table";
import { useNavigate } from "react-router-dom";
import './dashboard.css';

export default function Dashboard() {
    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        NEW: 0,
        CONTACTED: 0,
        QUALIFIED: 0,
        WON: 0,
        LOST: 0
    });
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

    const fetchDashboardData = async (page = 1, search = searchTerm, status = statusFilter) => {
        try {
            setLoading(true);
            
            // Fetch stats in parallel with leads, but catch errors on stats so it doesn't break the table
            const [leadsData, statsData] = await Promise.all([
                getLeads(page, 10, search, status),
                getLeadStats().catch(err => {
                    console.error("Failed to fetch stats:", err);
                    return null;
                })
            ]);

            const formattedLeads = (leadsData.data || []).map(lead => {
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
            setCurrentPage(leadsData.meta?.page || 1);
            setTotalPages(leadsData.meta?.totalPages || 1);
            
            if (statsData && statsData.stats) {
                setStats(statsData.stats);
            }
            
            setLoading(false);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Failed to fetch dashboard data");
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardData(1, "", "");
    }, []);

    const handleSearch = () => {
        setCurrentPage(1);
        fetchDashboardData(1, searchTerm, statusFilter);
    };

    const handleReset = () => {
        setSearchTerm("");
        setStatusFilter("");
        setCurrentPage(1);
        fetchDashboardData(1, "", "");
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchDashboardData(newPage, searchTerm, statusFilter);
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
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2 className="dashboard-title">Leads Dashboard</h2>
            </div>
            
            {error && <p className="error-text" style={{ color: '#ef4444', marginBottom: '20px' }}>{error}</p>}
            
            {/* Stats Section */}
            <div className="stats-grid">
                    <div className="stat-card total">
                        <span className="stat-title">Total Leads</span>
                        <span className="stat-value">{stats.total}</span>
                    </div>
                    <div className="stat-card new">
                        <span className="stat-title">New</span>
                        <span className="stat-value">{stats.NEW || 0}</span>
                    </div>
                    <div className="stat-card contacted">
                        <span className="stat-title">Contacted</span>
                        <span className="stat-value">{stats.CONTACTED || 0}</span>
                    </div>
                    <div className="stat-card qualified">
                        <span className="stat-title">Qualified</span>
                        <span className="stat-value">{stats.QUALIFIED || 0}</span>
                    </div>
                    <div className="stat-card won">
                        <span className="stat-title">Won</span>
                        <span className="stat-value">{stats.WON || 0}</span>
                    </div>
                    <div className="stat-card lost">
                        <span className="stat-title">Lost</span>
                        <span className="stat-value">{stats.LOST || 0}</span>
                    </div>
                </div>

            {/* Filters Section */}
            <div className="filters-section">
                <button className="btn-create" onClick={handleCreateNew}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Create Lead
                </button>
                
                <div className="filter-divider"></div>
                
                <input 
                    type="text" 
                    className="search-input"
                    placeholder="Search by name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                
                <select 
                    className="status-select"
                    value={statusFilter}
                    onChange={(e) => {
                        const val = e.target.value;
                        setStatusFilter(val);
                        setCurrentPage(1);
                        fetchDashboardData(1, searchTerm, val);
                    }}
                >
                    <option value="">All Statuses</option>
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="WON">WON</option>
                    <option value="LOST">LOST</option>
                </select>
                
                <button className="btn-primary" onClick={handleSearch}>Search</button>
                
                {(searchTerm || statusFilter) && (
                    <button className="btn-secondary" onClick={handleReset}>Reset Filters</button>
                )}
            </div>

            {/* Table Section */}
            <div className="table-wrapper">
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
                    <div className="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <p>No leads found matching your criteria.</p>
                        {(searchTerm || statusFilter) && (
                            <button className="btn-secondary" onClick={handleReset}>Clear Filters</button>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    )
}