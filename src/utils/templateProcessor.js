// ... other imports ...
import { formatDate } from './dateFormatting';
import { formatCurrency } from './formatters';

export const processTemplate = async (template, audit, damageRecords, damagePrices) => {
  if (!template?.content || !audit) return '';

  // Fetch customer data
  let customerData = {};
  if (audit.customer_id) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', audit.customer_id)
        .single();

      if (error) throw error;
      customerData = data || {};
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  }

  // Process all fields with their formatted values
  const processedFields = {
    // ... other fields ...
    customerAddress: {
      label: 'Address',
      value: customerData.address || 'n/a'
    },
    // ... other fields ...
  };

  // ... rest of your processTemplate function ...
};
