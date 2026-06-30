import { transporter } from "./transporter";
import { BookingData } from "./types";
import { getDoctorNotificationTemplate } from "./templates/doctorNotification";

export const sendDoctorNotification = async (data: BookingData) => {
  const html = getDoctorNotificationTemplate(data);

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Narayan Homoeopathic Chikitsalaya" <homoeopathy4u@gmail.com>',
      to: process.env.APPOINTMENT_ALERT_EMAILS || process.env.EMAIL_USER || 'homoeopathy4u@gmail.com',
      subject: `[ALERT] New Appointment Booking - ${data.appointmentId}`,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send doctor notification:", error);
    return { success: false, error };
  }
};
