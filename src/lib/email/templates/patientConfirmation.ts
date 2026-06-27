import { BookingData } from "../types";

export const getPatientConfirmationTemplate = (data: BookingData): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { font-size: 22px; font-weight: 700; color: #0369a1; text-align: center; margin-bottom: 4px; }
    .subheader { font-size: 13px; color: #64748b; text-align: center; margin-bottom: 24px; }
    .divider { height: 1px; background-color: #e2e8f0; margin-bottom: 24px; }
    .greeting { font-size: 14px; color: #0f172a; font-weight: 600; margin-bottom: 12px; }
    .content-text { font-size: 13px; color: #334155; margin-bottom: 24px; line-height: 1.5; }
    
    .details-card { background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px; margin-bottom: 24px; }
    .details-table { width: 100%; border-collapse: collapse; }
    .details-table td { padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    .details-table td:first-child { color: #64748b; font-weight: 600; width: 35%; }
    .details-table td:last-child { color: #0f172a; font-weight: 600; text-align: right; }
    .details-table tr:last-child td { border-bottom: none; }
    
    .highlight-blue { color: #0284c7; }
    .highlight-green { color: #16a34a; }
    
    .button-container { text-align: center; margin-bottom: 32px; }
    .button { display: inline-block; background-color: #0369a1; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 13px; padding: 12px 24px; border-radius: 99px; }
    
    .footer { text-align: center; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Narayan Clinic</div>
    <div class="subheader">Appointment Confirmation</div>
    <div class="divider"></div>
    
    <div class="greeting">Dear <span style="text-transform: uppercase;">${data.fullName}</span>,</div>
    
    <div class="content-text">
      Your constitutional homeopathy consultation has been successfully scheduled. Details are outlined below:
    </div>

    <div class="details-card">
      <table class="details-table">
        <tr>
          <td>Booking Reference</td>
          <td class="highlight-blue">${data.appointmentId}</td>
        </tr>
        <tr>
          <td>Date</td>
          <td>${data.date}</td>
        </tr>
        <tr>
          <td>Time Slot</td>
          <td class="highlight-green">${data.timeSlot} (30 mins)</td>
        </tr>
        <tr>
          <td>Center Location</td>
          <td style="font-weight: 500;">First street, Neelam cinema crossing 32, Jamun Road, Civil Lines, Roorkee</td>
        </tr>
      </table>
    </div>

    <div class="button-container">
      <a href="https://maps.google.com/?q=Narayan+Homoeopathic+Chikitsalaya+Roorkee" class="button">View on Google Maps</a>
    </div>

    <div class="footer">
      If you need to change your appointment date/time, please contact us at +91-1332 270021.
    </div>
  </div>
</body>
</html>
  `;
};
