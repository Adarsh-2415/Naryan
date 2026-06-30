import { BookingData } from "../types";

export const getDoctorNotificationTemplate = (data: BookingData): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
  <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <div class="header" style="font-size: 22px; font-weight: 700; color: #001b4b; margin-bottom: 4px;">New Consultation Booked</div>
    <div class="subheader" style="font-size: 13px; color: #64748b; margin-bottom: 24px;">Alert Notification</div>
    <div class="divider" style="height: 1.5px; background-color: #001b4b; margin-bottom: 24px;"></div>
    
    <div class="content-text" style="font-size: 13px; color: #334155; margin-bottom: 24px; line-height: 1.5;">
      A new appointment has been scheduled in the patient registry:
    </div>

    <div class="details-card" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; margin-bottom: 24px;">
      <table class="details-table" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #64748b; font-weight: 600; width: 35%; text-align: left;">Booking Reference</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #0f172a; font-weight: 700; text-align: right; text-transform: uppercase;">${data.appointmentId}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #64748b; font-weight: 600; width: 35%; text-align: left;">Patient Name</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #0f172a; font-weight: 700; text-align: right; text-transform: uppercase;">${data.fullName}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #64748b; font-weight: 600; width: 35%; text-align: left;">Contact Phone</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #0f172a; font-weight: 700; text-align: right;">${data.phone}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #64748b; font-weight: 600; width: 35%; text-align: left;">Patient Email</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; text-align: right;"><a href="mailto:${data.email}" class="highlight-blue" style="color: #0284c7 !important; text-decoration: none; font-weight: 700;">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #64748b; font-weight: 600; width: 35%; text-align: left;">Date</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #0f172a; font-weight: 700; text-align: right;">${data.date}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #64748b; font-weight: 600; width: 35%; text-align: left;">Time Slot</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #0284c7; font-weight: 700; text-align: right;">${data.timeSlot}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #64748b; font-weight: 600; width: 35%; text-align: left;">Address</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #0f172a; font-weight: 700; text-align: right;">${data.address}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-size: 13px; vertical-align: top; color: #64748b; font-weight: 600; width: 35%; text-align: left;">Reason/Symptoms</td>
          <td style="padding: 12px 0; font-size: 13px; vertical-align: top; color: #0f172a; font-weight: 700; text-align: right;">${data.reason || "N/A"}</td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>
  `;
};
