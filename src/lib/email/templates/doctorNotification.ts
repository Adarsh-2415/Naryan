import { BookingData } from "../types";

export const getDoctorNotificationTemplate = (data: BookingData): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    .subheader { font-size: 13px; color: #64748b; margin-bottom: 24px; }
    .divider { height: 1px; background-color: #e2e8f0; margin-bottom: 24px; }
    .content-text { font-size: 14px; color: #334155; margin-bottom: 24px; }
    .details-table { width: 100%; border-collapse: collapse; }
    .details-table td { padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .details-table td:first-child { color: #64748b; font-weight: 600; width: 40%; }
    .details-table td:last-child { color: #0f172a; font-weight: 600; text-align: right; }
    .details-table tr:last-child td { border-bottom: none; }
    .highlight-blue { color: #0284c7; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header" style="color: #0369a1;">New Consultation Booked</div>
    <div class="subheader">Alert Notification</div>
    <div class="divider"></div>
    
    <div class="content-text">
      A new appointment has been scheduled in the patient registry:
    </div>

    <table class="details-table">
      <tr>
        <td>Patient Name</td>
        <td style="text-transform: uppercase;">${data.fullName}</td>
      </tr>
      <tr>
        <td>Contact Phone</td>
        <td>${data.phone}</td>
      </tr>
      <tr>
        <td>Patient Email</td>
        <td class="highlight-blue">${data.email}</td>
      </tr>
      <tr>
        <td>Date</td>
        <td>${data.date}</td>
      </tr>
      <tr>
        <td>Time Slot</td>
        <td>${data.timeSlot}</td>
      </tr>
      <tr>
        <td>Address</td>
        <td>${data.address}</td>
      </tr>
      <tr>
        <td>Reason/Symptoms</td>
        <td>${data.reason || "N/A"}</td>
      </tr>
    </table>
  </div>
</body>
</html>
  `;
};
