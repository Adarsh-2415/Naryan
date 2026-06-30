import { transporter } from "./transporter";
import { BookingData } from "./types";
import { getPatientConfirmationTemplate } from "./templates/patientConfirmation";

export const sendPatientConfirmation = async (data: BookingData) => {
  const html = getPatientConfirmationTemplate(data);

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Narayan Homoeopathic Chikitsalaya" <homoeopathy4u@gmail.com>',
      to: data.email,
      subject: `Appointment Confirmed - ${data.appointmentId}`,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send patient confirmation:", error);
    return { success: false, error };
  }
};
