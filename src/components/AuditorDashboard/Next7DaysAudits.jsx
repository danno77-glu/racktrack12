import React from 'react';
    import { useNavigate } from 'react-router-dom';

    const Next7DaysAudits = ({ audits, refetchData }) => {
      const navigate = useNavigate();

      const handleStartAudit = (audit) => {
        const auditDataToPass = {
          scheduled_audit_id: audit.id,
          auditor_name: audit.auditors?.name || '',
          site_name: audit.customers?.name || '',
          company_name: audit.customers?.company || '',
          audit_date: audit.booking_date ? String(audit.booking_date) : new Date().toISOString().split('T')[0],
          customer_id: audit.customers?.id ? String(audit.customers.id) : null
        };

        navigate('/form', {
          state: { auditData: auditDataToPass }
        });
      };

      if (!audits) {
        return <div className="error">Error: Audits data is not available.</div>;
      }

      return (
        <div className="next-7-days-audits">
          <h2>Upcoming Audits (Next 7 Days)</h2>
          {audits.length > 0 ? (
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
                  <tr key={audit.id}>
                    <td>{new Date(audit.booking_date).toLocaleDateString()}</td>
                    <td>{audit.customers.name}</td>
                    <td>{audit.customers.company}</td>
                    <td>{audit.auditors.name}</td>
                    <td>
                      <button onClick={() => handleStartAudit(audit)}>
                        Start Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No upcoming audits in the next 7 days.</p>
          )}
        </div>
      );
    };

    export default Next7DaysAudits;
