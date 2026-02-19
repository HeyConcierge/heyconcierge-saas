import {
  Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components'

interface EscalationAlertProps {
  hostName?: string
  guestName?: string
  propertyName?: string
  guestMessage?: string
  aiResponse?: string
  reason?: string
  urgency?: 'high' | 'medium'
  timestamp?: string
}

export default function EscalationAlert({
  hostName = 'Erik',
  guestName = 'Sarah Johnson',
  propertyName = 'Aurora Haven Beach Villa',
  guestMessage = 'The hot water is not working and it\'s freezing! Can someone come fix this ASAP?',
  aiResponse = 'I understand this is urgent. I\'ve notified the host and they will get back to you as soon as possible.',
  reason = 'Maintenance emergency — guest reported issue AI cannot resolve',
  urgency = 'high',
  timestamp = '2:34 PM',
}: EscalationAlertProps) {
  const isHigh = urgency === 'high'

  return (
    <Html>
      <Head />
      <Preview>URGENT: {guestName} at {propertyName} needs help</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>
              <span style={{ color: '#FF6B6B' }}>Hey</span>
              <span style={{ color: '#2D2B55' }}>Concierge</span>
            </Text>
          </Section>

          {/* Alert Banner */}
          <Section style={isHigh ? alertBannerHigh : alertBannerMedium}>
            <Text style={alertEmoji}>{isHigh ? '🚨' : '⚠️'}</Text>
            <Text style={alertTitle}>
              {isHigh ? 'Urgent Guest Issue' : 'Guest Needs Attention'}
            </Text>
            <Text style={alertSubtitle}>{reason}</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={metaText}>
              {propertyName} · {timestamp}
            </Text>

            {/* Guest Message */}
            <Section style={messageBox}>
              <Text style={messageLabel}>GUEST MESSAGE — {guestName}</Text>
              <Text style={messageText}>{guestMessage}</Text>
            </Section>

            {/* AI Response */}
            <Section style={aiBox}>
              <Text style={messageLabel}>AI CONCIERGE RESPONDED</Text>
              <Text style={aiText}>{aiResponse}</Text>
            </Section>

            <Hr style={divider} />

            <Text style={paragraph}>
              The AI concierge has handled the initial response, but this situation needs your personal attention.
            </Text>

            {/* CTAs */}
            <Section style={{ textAlign: 'center' as const, marginTop: '24px' }}>
              <Link href="https://www.heyconcierge.io/dashboard" style={button}>
                View Conversation
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              HeyConcierge AS · Tromso, Norway
            </Text>
            <Text style={footerText}>
              <Link href="https://www.heyconcierge.io" style={footerLink}>heyconcierge.io</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#FFF8F0',
  fontFamily: '"Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '560px',
}

const header = {
  padding: '24px 32px',
  textAlign: 'center' as const,
}

const logoText = {
  fontSize: '24px',
  fontWeight: '900',
  margin: '0',
}

const alertBannerHigh = {
  backgroundColor: '#FF6B6B',
  borderRadius: '16px 16px 0 0',
  padding: '24px 32px',
  textAlign: 'center' as const,
}

const alertBannerMedium = {
  backgroundColor: '#FDCB6E',
  borderRadius: '16px 16px 0 0',
  padding: '24px 32px',
  textAlign: 'center' as const,
}

const alertEmoji = {
  fontSize: '32px',
  margin: '0 0 8px',
}

const alertTitle = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '900',
  margin: '0 0 4px',
}

const alertSubtitle = {
  color: 'rgba(255,255,255,0.85)',
  fontSize: '13px',
  margin: '0',
}

const content = {
  backgroundColor: '#ffffff',
  borderRadius: '0 0 16px 16px',
  padding: '32px',
  boxShadow: '0 2px 8px rgba(108, 92, 231, 0.06)',
}

const metaText = {
  color: '#9B93C9',
  fontSize: '12px',
  fontWeight: '700',
  margin: '0 0 16px',
}

const messageBox = {
  backgroundColor: '#FFF5F5',
  borderLeft: '3px solid #FF6B6B',
  borderRadius: '8px',
  padding: '16px',
  margin: '0 0 12px',
}

const aiBox = {
  backgroundColor: '#F5F3FF',
  borderLeft: '3px solid #6C5CE7',
  borderRadius: '8px',
  padding: '16px',
  margin: '0 0 20px',
}

const messageLabel = {
  color: '#9B93C9',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.5px',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
}

const messageText = {
  color: '#2D2B55',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
}

const aiText = {
  color: '#6C5CE7',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
  fontStyle: 'italic' as const,
}

const divider = {
  borderColor: '#E8E4FF',
  margin: '20px 0',
}

const paragraph = {
  color: '#2D2B55',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
}

const button = {
  backgroundColor: '#FF6B6B',
  borderRadius: '50px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '700',
  padding: '12px 32px',
  textDecoration: 'none',
}

const footer = {
  padding: '24px 32px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#9B93C9',
  fontSize: '12px',
  margin: '4px 0',
}

const footerLink = {
  color: '#6C5CE7',
  textDecoration: 'none',
}
