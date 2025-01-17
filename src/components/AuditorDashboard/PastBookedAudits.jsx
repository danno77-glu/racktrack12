import React from 'react';
  import { useNavigate } from 'react-router-dom';

  const PastBookedAudits = ({ audits }) => {
    const navigate = useNavigate();

    const handleRebookAudit = (audit) => {
      navigate('/scheduled-audits', { state: { bookingToEdit: audit } });
    };

    return (
      <div className="past-booked-audits">
        <h2>Past Booked Audits</h2>
        {audits && audits.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Company</th>
                <th>Auditor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {audits.map(audit => (
                <tr key={audit.id} className="past-audit-row">
                  <td>{new Date(audit.booking_date).toLocaleDateString()}</td>
                  <td>{audit.customers.name}</td>
                  <td>{audit.customers.company}</td>
                  <td>{audit.auditors.name}</td>
                  <td>
                    <button onClick={() => handleRebookAudit(audit)}>
                      Rebook Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No past booked audits.</p>
        )}
      </div>
    );
  };

  export default PastBookedAudits;
