export interface BookingData {
  appointmentId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  age: number;
  gender: string;
  reason: string;
  date: string;
  timeSlot: string;
  isReturningPatient?: boolean;
  previousBookingReference?: string | null;
}

