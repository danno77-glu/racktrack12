import React, { useState, useEffect, useCallback } from 'react';
    import { supabase } from '../../supabase';
    import './styles.css';
    import Next7DaysAudits from './Next7DaysAudits';
    import PastBookedAudits from './PastBookedAudits';

    const AuditorDashboard = () => {
      const [auditors, setAuditors] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [pastBookedAudits, setPastBookedAudits] = useState([]);
      const [next7DaysAudits, setNext7DaysAudits] = useState([]);

      const fetchAuditorStats = useCallback(async () => {
        try {
          setLoading(true);

          const { data, error } = await supabase.rpc('get_auditor_stats').select('*');

          if (error) throw error;

          const sortedData = data.sort((a, b) => b.completed_audits - a.completed_audits);
          setAuditors(sortedData);
        } catch (error) {
          console.error('Error fetching auditor stats:', error);
          setError('Failed to fetch auditor stats.');
        } finally {
          setLoading(false);
        }
      }, []);

      const fetchPastBookedAudits = useCallback(async () => {
        try {
          const today = new Date();

          const { data, error } = await supabase
            .from('scheduled_audits')
            .select(`
              id,
              booking_date,
              completed,
              customers!customer_id (id, name, company, email, address, phone, next_audit_due, default_auditor, is_active, auto_marketing),
              auditors!auditor_id (name)
            `)
            .lt('booking_date', today.toISOString().split('T')[0])
            .eq('completed', false)
            .order('booking_date', { ascending: true });

          if (error) throw error;

          setPastBookedAudits(data);
        } catch (error) {
          console.error('Error fetching past booked audits:', error);
          setError('Failed to fetch past booked audits.');
        }
      }, []);

      const fetchNext7DaysAudits = useCallback(async () => {
        try {
          const today = new Date();
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);

          const { data, error } = await supabase
            .from('scheduled_audits')
            .select(`
              id,
              booking_date,
              completed,
              customers!customer_id (id, name, company, email, address, phone, next_audit_due, default_auditor, is_active, auto_marketing),
              auditors!auditor_id (name, color)
            `)
            .gte('booking_date', today.toISOString().split('T')[0])
            .lte('booking_date', nextWeek.toISOString().split('T')[0])
            .eq('completed', false)
            .order('booking_date', { ascending: true });

          if (error) throw error;

          setNext7DaysAudits(data || []);
        } catch (error) {
          console.error('Error fetching next 7 days audits:', error);
          setError('Failed to fetch upcoming audits.');
        }
      }, []);

      const refetchData = useCallback(async () => {
        await Promise.all([
          fetchAuditorStats(),
          fetchPastBookedAudits(),
          fetchNext7DaysAudits(),
        ]);
      }, [fetchAuditorStats, fetchPastBookedAudits, fetchNext7DaysAudits]);

      useEffect(() => {
        refetchData();
      }, [refetchData]);

      if (loading) {
        return <div className="loading">Loading dashboard...</div>;
      }

      if (error) {
        return <div className="error">{error}</div>;
      }

      return (
        <div className="auditor-dashboard">
          <h1>Auditor Dashboard</h1>

          <div className="scoreboard">
            <h2>Scoreboard</h2>
            <table>
              <thead>
                <tr>
                  <th>Auditor</th>
                  <th>Completed</th>
                  <th>Booked</th>
                  <th>Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {auditors.map(auditor => (
                  <tr key={auditor.auditor_id}>
                    <td>{auditor.auditor_name}</td>
                    <td>{auditor.completed_audits}</td>
                    <td>{auditor.booked_audits}</td>
                    <td>{auditor.outstanding_audits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Next7DaysAudits audits={next7DaysAudits} refetchData={refetchData} />
          <PastBookedAudits audits={pastBookedAudits} />
        </div>
      );
    };

    export default AuditorDashboard;
