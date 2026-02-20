import { Resend } from 'resend'
import BookingConfirmation from '@/emails/booking-confirmation'
import EscalationAlert from '@/emails/escalation-alert'
import SessionSummary from '@/emails/session-summary'
import WeeklyDigest from '@/emails/weekly-digest'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL || 'HeyConcierge <notifications@heyconcierge.io>'

export async function sendBookingConfirmation(to: string, props: Parameters<typeof BookingConfirmation>[0]) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `New booking: ${props.guestName} arriving ${props.checkIn}`,
    react: BookingConfirmation(props),
  })
}

export async function sendEscalationAlert(to: string, props: Parameters<typeof EscalationAlert>[0]) {
  const prefix = props.urgency === 'high' ? 'URGENT' : 'Attention needed'
  return resend.emails.send({
    from: FROM,
    to,
    subject: `${prefix}: ${props.guestName} at ${props.propertyName}`,
    react: EscalationAlert(props),
  })
}

export async function sendSessionSummary(to: string, props: Parameters<typeof SessionSummary>[0]) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Session recap: ${props.guestName} at ${props.propertyName}`,
    react: SessionSummary(props),
  })
}

export async function sendWeeklyDigest(to: string, props: Parameters<typeof WeeklyDigest>[0]) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Weekly digest: ${props.totalMessages} messages, ${props.totalGuests} guests`,
    react: WeeklyDigest(props),
  })
}
