/**
 * Fast2SMS REST API Helper
 * Sends SMS notifications for appointment confirmations
 */

const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;
const FAST2SMS_URL = 'https://www.fast2sms.com/dev/bulkV2';

/**
 * Send an SMS message via Fast2SMS
 * @param {string} phone - Phone number (10 digits, Indian number)
 * @param {string} message - Message text
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendSMS(phone, message) {
  if (!FAST2SMS_API_KEY) {
    console.warn('Fast2SMS API key not configured — SMS not sent');
    return { success: false, message: 'SMS API key not configured' };
  }

  // Clean phone number (remove +91, spaces, dashes)
  const cleanPhone = phone.replace(/[\s\-\+]/g, '').replace(/^91/, '');

  if (cleanPhone.length !== 10) {
    return { success: false, message: 'Invalid phone number' };
  }

  try {
    const response = await fetch(FAST2SMS_URL, {
      method: 'POST',
      headers: {
        'Authorization': FAST2SMS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'q',
        message: message,
        language: 'english',
        flash: 0,
        numbers: cleanPhone,
      }),
    });

    const data = await response.json();

    if (data.return === true) {
      return { success: true, message: 'SMS sent successfully' };
    } else {
      console.error('Fast2SMS Error:', data);
      return { success: false, message: data.message || 'SMS sending failed' };
    }
  } catch (error) {
    console.error('SMS Error:', error);
    return { success: false, message: 'Failed to send SMS' };
  }
}

/**
 * Send appointment confirmation SMS
 * @param {string} phone - Patient phone number
 * @param {string} patientName - Patient name
 * @param {string} doctorName - Doctor name
 * @param {string} date - Appointment date
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendAppointmentSMS(phone, patientName, doctorName, date) {
  const message = `Dear ${patientName}, your appointment with Dr. ${doctorName} on ${date} has been booked successfully at Om Chaudhary Hospital & Trauma Centre. For emergencies, call 108.`;
  return sendSMS(phone, message);
}

/**
 * Send appointment status update SMS
 * @param {string} phone - Patient phone number
 * @param {string} patientName - Patient name
 * @param {string} status - New status
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendStatusUpdateSMS(phone, patientName, status) {
  const message = `Dear ${patientName}, your appointment at Om Chaudhary Hospital has been ${status}. For queries, contact us at the hospital reception.`;
  return sendSMS(phone, message);
}
