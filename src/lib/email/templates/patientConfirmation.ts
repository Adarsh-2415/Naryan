import { BookingData } from "../types";

export const getPatientConfirmationTemplate = (data: BookingData): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
  <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <div class="header" style="font-size: 22px; font-weight: 700; color: #001b4b; text-align: center; margin-bottom: 4px;">Narayan Homoeopathic Chikitsalaya</div>
    <div class="subheader" style="font-size: 13px; color: #64748b; text-align: center; margin-bottom: 24px;">Appointment Confirmation</div>
    <div class="divider" style="height: 1.5px; background-color: #001b4b; margin-bottom: 24px;"></div>
    
    <div class="greeting" style="font-size: 14px; color: #0f172a; font-weight: 600; margin-bottom: 12px;">Dear <span style="text-transform: uppercase;">${data.fullName}</span>,</div>
    
    <div class="content-text" style="font-size: 13px; color: #334155; margin-bottom: 24px; line-height: 1.5;">
      Your constitutional homeopathy consultation has been successfully scheduled. Details are outlined below:
    </div>

    <div class="details-card" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; margin-bottom: 24px;">
      <table class="details-table" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #64748b; font-weight: 600; width: 35%; text-align: left;">Booking Reference</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #018abe; font-weight: 700; text-align: right;">${data.appointmentId}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #64748b; font-weight: 600; width: 35%; text-align: left;">Date</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #0f172a; font-weight: 700; text-align: right;">${data.date}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #64748b; font-weight: 600; width: 35%; text-align: left;">Time Slot</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #10b981; font-weight: 700; text-align: right;">${data.timeSlot} (10 mins)</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-size: 13px; vertical-align: top; color: #64748b; font-weight: 600; width: 35%; text-align: left;">Center Location</td>
          <td style="padding: 12px 0; font-size: 13px; vertical-align: top; color: #334155; font-weight: 500; text-align: right; line-height: 1.4;">First street, Neelam cinema crossing 32, Jamun Road, Civil Lines, Roorkee</td>
        </tr>
      </table>
    </div>

    <div class="button-container" style="text-align: center; margin: 32px 0;">
      <a href="https://maps.google.com/?q=Narayan+Homoeopathic+Chikitsalaya+Roorkee" class="button" style="display: inline-block; background-color: #004b87; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 36px; border-radius: 99px;">View on Google Maps</a>
    </div>

    <div class="dashed-divider" style="border-top: 1px dashed #e2e8f0; margin-bottom: 24px;"></div>

    <div class="footer" style="text-align: center; font-size: 11px; color: #94a3b8;">
      If you need to change your appointment date/time, please contact us at +91-1332 270021.
    </div>
  </div>
</body>
</html>
  `;
};
