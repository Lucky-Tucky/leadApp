import React from 'react';
import './table.css';

/**
 * Dynamic Table Component
 * 
 * @param {Array} data - Array of objects to be displayed in the table
 * @param {Array} columns - Optional: Array of column keys/headers. If not provided, it extracts keys from the first data object.
 * @param {Array} actions - Array of strings (e.g., ['Update', 'Delete']) or objects for the actions column.
 * @param {Function} onActionClick - Callback function triggered when an action button is clicked: (action, rowData) => void
 */
const Table = ({ data, columns, actions, onActionClick, currentPage, totalPages, onPageChange }) => {
  if (!data || data.length === 0) {
    return <div className="table-empty">No data available to display.</div>;
  }

  // Derive column headers from the first data object if columns are not explicitly passed
  const tableColumns = columns || Object.keys(data[0]);

  return (
    <div className="table-container">
      <table className="dynamic-table">
        <thead>
          <tr>
            {tableColumns.map((col, index) => (
              <th key={index}>{col.charAt(0).toUpperCase() + col.slice(1)}</th>
            ))}
            {actions && actions.length > 0 && <th>Options</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {tableColumns.map((col, colIndex) => {
                if (col === 'status') {
                  const statusVal = row[col] ? row[col].toUpperCase() : '';
                  return (
                    <td key={colIndex}>
                      <span className={`status-badge status-${statusVal.toLowerCase()}`}>
                        {row[col]}
                      </span>
                    </td>
                  );
                }
                return <td key={colIndex}>{row[col]}</td>;
              })}
              {actions && actions.length > 0 && (
                <td className="table-actions">
                  {actions.map((action, actionIndex) => {
                    const actionName = typeof action === 'string' ? action : action.label || action.name;
                    
                    let content = actionName;
                    let tooltip = undefined;
                    let customClass = '';

                    if (actionName === 'View') {
                      content = (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      );
                      tooltip = "View Lead Details";
                      customClass = "action-icon-only";
                    }

                    return (
                      <button
                        key={actionIndex}
                        className={`action-btn action-${actionName.toLowerCase()} ${customClass}`}
                        onClick={() => onActionClick && onActionClick(action, row)}
                        data-tooltip={tooltip}
                      >
                        {content}
                      </button>
                    );
                  })}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-pagination">
        <button 
          className="pagination-btn" 
          disabled={currentPage <= 1} 
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span className="pagination-info">Page {currentPage} of {totalPages}</span>
        <button 
          className="pagination-btn" 
          disabled={currentPage >= totalPages} 
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
