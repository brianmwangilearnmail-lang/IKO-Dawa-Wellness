import { Order } from '../types';

export interface EmailSettings {
  clientId: string;
  connectedEmail: string;
  accessToken?: string;
}

export const getEmailSettings = (): EmailSettings | null => {
  const saved = localStorage.getItem('gmail_settings');
  return saved ? JSON.parse(saved) : null;
};

export const connectGmail = async (clientId: string): Promise<EmailSettings> => {
  // Mock connection
  const settings = {
    clientId,
    connectedEmail: 'admin@wellness.co.ke'
  };
  localStorage.setItem('gmail_settings', JSON.stringify(settings));
  return settings;
};

export const clearEmailSettings = () => {
  localStorage.removeItem('gmail_settings');
};

export const sendDispatchReceipt = async (settings: EmailSettings, order: Order) => {
  console.log(`Sending dispatch receipt to ${order.customer_email} via Gmail (${settings.connectedEmail})`);
  // Mock sending
  return true;
};
