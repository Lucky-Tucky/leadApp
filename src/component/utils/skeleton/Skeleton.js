import React from 'react';
import './Skeleton.css';

export const TableSkeleton = () => (
    <div className="skeleton-table-wrapper">
        <div className="skeleton skeleton-table-header" style={{ borderRadius: '0' }}></div>
        {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-table-row">
                <div className="skeleton skeleton-table-cell" style={{ flex: 1.5 }}></div>
                <div className="skeleton skeleton-table-cell" style={{ flex: 2 }}></div>
                <div className="skeleton skeleton-table-cell" style={{ flex: 1 }}></div>
                <div className="skeleton skeleton-table-cell" style={{ flex: 1 }}></div>
                <div className="skeleton skeleton-table-cell" style={{ flex: 1 }}></div>
                <div className="skeleton skeleton-table-cell" style={{ flex: 1 }}></div>
            </div>
        ))}
    </div>
);

export const DashboardSkeleton = () => {
    return (
        <div className="dashboard-container" style={{ pointerEvents: 'none' }}>
            <div className="dashboard-header">
                <div className="skeleton skeleton-text title" style={{ margin: 0, width: '250px' }}></div>
            </div>
            
            {/* Stats Skeleton */}
            <div className="dashboard-skeleton-grid">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="skeleton skeleton-stat-card"></div>
                ))}
            </div>

            {/* Filters Skeleton */}
            <div className="skeleton-filter-bar">
                <div className="skeleton skeleton-button"></div>
                <div className="filter-divider"></div>
                <div className="skeleton skeleton-button" style={{ width: '250px' }}></div>
                <div className="skeleton skeleton-button"></div>
                <div className="skeleton skeleton-button" style={{ width: '80px' }}></div>
            </div>

            {/* Table Skeleton */}
            <TableSkeleton />
        </div>
    );
};

export const LeadInfoSkeleton = () => {
    return (
        <div className="leadinfo-container" style={{ pointerEvents: 'none' }}>
            <div className="skeleton-lead-header">
                <div className="skeleton skeleton-text title" style={{ margin: 0, width: '200px' }}></div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="skeleton skeleton-button" style={{ width: '100px' }}></div>
                    <div className="skeleton skeleton-button" style={{ width: '160px' }}></div>
                </div>
            </div>

            <div className="skeleton-lead-layout">
                {/* Form Skeleton */}
                <div className="skeleton-lead-card">
                    <div className="skeleton skeleton-text" style={{ width: '40%', marginBottom: '30px' }}></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} style={{ marginBottom: '24px' }}>
                            <div className="skeleton skeleton-text" style={{ width: '20%', height: '14px', marginBottom: '8px' }}></div>
                            <div className="skeleton skeleton-input"></div>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                         <div className="skeleton skeleton-button" style={{ width: '140px', height: '44px' }}></div>
                    </div>
                </div>

                {/* Notes Skeleton */}
                <div className="skeleton-lead-card">
                    <div className="skeleton skeleton-text" style={{ width: '20%', marginBottom: '30px' }}></div>
                    
                    <div className="skeleton skeleton-input" style={{ height: '100px', marginBottom: '12px' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
                         <div className="skeleton skeleton-button" style={{ width: '100px' }}></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                                <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
                                <div className="skeleton skeleton-text" style={{ width: '70%', marginBottom: '12px' }}></div>
                                <div className="skeleton skeleton-text" style={{ width: '30%', height: '12px' }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
