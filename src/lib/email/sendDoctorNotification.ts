import { transporter } from "./transporter";
import { BookingData } from "./types";
import { getDoctorNotificationTemplate } from "./templates/doctorNotification";

export const sendDoctorNotification = async (data: BookingData) => {
  const html = getDoctorNotificationTemplate(data);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Narayan Clinic" <homoeopathy4u@gmail.com>',
      to: process.env.EMAIL_USER || 'homoeopathy4u@gmail.com', // Sending alert to the admin's inbox
      subject: `[ALERT] New Appointment Booking - ${data.appointmentId}`,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send doctor notification:", error);
    return { success: false, error };
  }
};
