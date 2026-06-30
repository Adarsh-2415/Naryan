import { transporter } from "./transporter";

export const sendContactNotification = async (data: { name: string; email: string; phone: string; message: string }) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
  <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <div class="header" style="font-size: 22px; font-weight: 700; color: #001b4b; margin-bottom: 4px;">New Contact Query Received</div>
    <div class="subheader" style="font-size: 13px; color: #64748b; margin-bottom: 24px;">Website Inquiry Alert</div>
    <div class="divider" style="height: 1.5px; background-color: #001b4b; margin-bottom: 24px;"></div>
    
    <div class="content-text" style="font-size: 13px; color: #334155; margin-bottom: 24px; line-height: 1.5;">
      A visitor has submitted a new inquiry message through the contact form:
    </div>

    <div class="details-card" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; margin-bottom: 24px;">
      <table class="details-table" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #64748b; font-weight: 600; width: 35%; text-align: left;">Name</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #0f172a; font-weight: 700; text-align: right; text-transform: uppercase;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #64748b; font-weight: 600; width: 35%; text-align: left;">Phone Number</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #0f172a; font-weight: 700; text-align: right;">${data.phone}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; color: #64748b; font-weight: 600; width: 35%; text-align: left;">Email Address</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; text-align: right;"><a href="mailto:${data.email}" style="color: #0284c7 !important; text-decoration: none; font-weight: 700;">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-size: 13px; vertical-align: top; color: #64748b; font-weight: 600; width: 35%; text-align: left;">Message</td>
          <td style="padding: 12px 0; font-size: 13px; vertical-align: top; color: #0f172a; font-weight: 700; text-align: right; line-height: 1.4;">${data.message}</td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Narayan Homoeopathic Chikitsalaya" <homoeopathy4u@gmail.com>',
      to: process.env.CONTACT_ALERT_EMAILS || process.env.EMAIL_USER || 'homoeopathy4u@gmail.com',
      subject: `[ALERT] New Contact Query from ${data.name}`,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send contact query notification:", error);
    return { success: false, error };
  }
};
