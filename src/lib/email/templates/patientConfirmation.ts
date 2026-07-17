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

    <!-- Appointment Guidelines Section -->
    <div class="guidelines-card" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 4px solid #004b87; padding: 24px; margin-bottom: 24px;">
      <div style="font-size: 14px; font-weight: 700; color: #001b4b; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
        📋 Important Appointment Guidelines / महत्वपूर्ण अपॉइंटमेंट दिशा-निर्देश
      </div>
      <div style="font-size: 11px; color: #64748b; font-weight: 600; margin-bottom: 16px; line-height: 1.5;">
        Please read the following instructions carefully before confirming your appointment.<br />
        <span style="color: #475569; font-weight: 500;">कृपया अपने अपॉइंटमेंट की पुष्टि करने से पहले नीचे दिए गए महत्वपूर्ण निर्देशों को ध्यानपूर्वक पढ़ें।</span>
      </div>
      
      <div class="guidelines-list" style="margin: 0; padding: 0; list-style-type: none;">
        <!-- Item 1 -->
        <div style="margin-bottom: 14px; font-size: 12px; line-height: 1.5; color: #0f172a; text-align: left;">
          <span style="font-weight: 700; color: #004b87; margin-right: 4px;">1.</span>
          <strong style="font-weight: 600;">To avoid inconvenience, please register your name over the phone before visiting the clinic.</strong>
          <div style="color: #475569; font-size: 11px; margin-top: 2px;">असुविधा से बचने के लिए कृपया फोन पर अपना नाम पहले से दर्ज करवा लें।</div>
        </div>
        
        <!-- Item 2 -->
        <div style="margin-bottom: 14px; font-size: 12px; line-height: 1.5; color: #0f172a; text-align: left;">
          <span style="font-weight: 700; color: #004b87; margin-right: 4px;">2.</span>
          <strong style="font-weight: 600;">Your phone appointment will be scheduled only after three (3) waiting patients have been attended.</strong>
          <div style="color: #475569; font-size: 11px; margin-top: 2px;">आपका फोन अपॉइंटमेंट तीन (3) प्रतीक्षारत मरीजों के अपॉइंटमेंट के बाद ही होगा।</div>
        </div>
        
        <!-- Item 3 -->
        <div style="margin-bottom: 14px; font-size: 12px; line-height: 1.5; color: #0f172a; text-align: left;">
          <span style="font-weight: 700; color: #004b87; margin-right: 4px;">3.</span>
          <strong style="font-weight: 600;">The appointment time provided is approximate and may change depending on the doctor's consultation schedule.</strong>
          <div style="color: #475569; font-size: 11px; margin-top: 2px;">फोन पर दिया गया समय अनुमानित है तथा आवश्यकता अनुसार इसमें परिवर्तन हो सकता है।</div>
        </div>
        
        <!-- Item 4 -->
        <div style="margin-bottom: 0; font-size: 12px; line-height: 1.5; color: #0f172a; text-align: left;">
          <span style="font-weight: 700; color: #004b87; margin-right: 4px;">4.</span>
          <strong style="font-weight: 600;">If medicines prescribed after consultation are refilled from outside sources, the clinic will not be responsible for their quality, authenticity, or effectiveness.</strong>
          <div style="color: #475569; font-size: 11px; margin-top: 2px;">चिकित्सक के परामर्श के बाद यदि दवाइयाँ बाहर से पुनः बनवाई जाती हैं, तो उनकी गुणवत्ता एवं प्रभावशीलता के लिए हमारी कोई जिम्मेदारी नहीं होगी।</div>
        </div>
      </div>
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
