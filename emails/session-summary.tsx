import {
  Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text, Row, Column,
} from '@react-email/components'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

interface SessionSummaryProps {
  hostName?: string
  guestName?: string
  propertyName?: string
  checkIn?: string
  checkOut?: string
  totalMessages?: number
  rating?: number
  messages?: Message[]
  escalated?: boolean
  topTopics?: string[]
}

export default function SessionSummary({
  hostName = 'Erik',
  guestName = 'Sarah Johnson',
  propertyName = 'Aurora Haven Beach Villa',
  checkIn = 'March 15, 2026',
  checkOut = 'March 20, 2026',
  totalMessages = 12,
  rating = 5,
  messages = [
    { role: 'user', content: 'What\'s the WiFi password?', timestamp: 'Mar 15, 3:22 PM' },
    { role: 'assistant', content: 'The WiFi network is "AuroraHaven" and the password is "sunset2026".', timestamp: 'Mar 15, 3:22 PM' },
    { role: 'user', content: 'Any good restaurants nearby?', timestamp: 'Mar 16, 6:45 PM' },
    { role: 'assistant', content: 'Mario\'s on 5th street has amazing pizza! Also try The Cove for seafood with sunset views.', timestamp: 'Mar 16, 6:45 PM' },
  ],
  escalated = false,
  topTopics = ['WiFi', 'Restaurants', 'Check-out'],
}: SessionSummaryProps) {
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)

  return (
    <Html>
      <Head />
      <Preview>Guest session recap: {guestName} at {propertyName}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>
              <span style={{ color: '#FF6B6B' }}>Hey</span>
              <span style={{ color: '#2D2B55' }}>Concierge</span>
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>Session Summary</Heading>
            <Text style={paragraph}>
              Hi {hostName}, here&apos;s a recap of {guestName}&apos;s stay at {propertyName}.
            </Text>

            {/* Stats */}
            <Section style={statsRow}>
              <Row>
                <Column style={statBox}>
                  <Text style={statNumber}>{totalMessages}</Text>
                  <Text style={statLabel}>Messages</Text>
                </Column>
                <Column style={statBox}>
                  <Text style={{ ...statNumber, color: '#FDCB6E' }}>{stars}</Text>
                  <Text style={statLabel}>Rating</Text>
                </Column>
                <Column style={statBox}>
                  <Text style={{ ...statNumber, color: escalated ? '#FF6B6B' : '#55EFC4' }}>
                    {escalated ? 'Yes' : 'No'}
                  </Text>
                  <Text style={statLabel}>Escalated</Text>
                </Column>
              </Row>
            </Section>

            {/* Stay Dates */}
            <Section style={card}>
              <Row>
                <Column>
                  <Text style={cardLabel}>CHECK-IN</Text>
                  <Text style={cardValue}>{checkIn}</Text>
                </Column>
                <Column>
                  <Text style={cardLabel}>CHECK-OUT</Text>
                  <Text style={cardValue}>{checkOut}</Text>
                </Column>
              </Row>
            </Section>

            {/* Top Topics */}
            {topTopics.length > 0 && (
              <Section style={{ margin: '20px 0' }}>
                <Text style={cardLabel}>TOP TOPICS</Text>
                <Text style={topicTags}>
                  {topTopics.map(t => `  ${t}  `).join('  ·  ')}
                </Text>
              </Section>
            )}

            <Hr style={divider} />

            {/* Conversation Highlights */}
            <Text style={{ ...cardLabel, marginBottom: '12px' }}>CONVERSATION HIGHLIGHTS</Text>
            {messages.map((msg, i) => (
              <Section key={i} style={msg.role === 'user' ? guestBubble : aiBubble}>
                <Text style={bubbleLabel}>
                  {msg.role === 'user' ? guestName : 'AI Concierge'}
                  {msg.timestamp && ` · ${msg.timestamp}`}
                </Text>
                <Text style={bubbleText}>{msg.content}</Text>
              </Section>
            ))}

            {totalMessages > messages.length && (
              <Text style={mutedText}>
                + {totalMessages - messages.length} more messages
              </Text>
            )}

            {/* CTA */}
            <Section style={{ textAlign: 'center' as const, marginTop: '24px' }}>
              <Link href="https://www.heyconcierge.io/dashboard" style={button}>
                View Full Conversation
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

const content = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '32px',
  boxShadow: '0 2px 8px rgba(108, 92, 231, 0.06)',
}

const h1 = {
  color: '#2D2B55',
  fontSize: '24px',
  fontWeight: '900',
  margin: '0 0 12px',
}

const paragraph = {
  color: '#2D2B55',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 20px',
}

const statsRow = {
  margin: '20px 0',
}

const statBox = {
  textAlign: 'center' as const,
  padding: '16px 8px',
  backgroundColor: '#F5F3FF',
  borderRadius: '12px',
}

const statNumber = {
  color: '#6C5CE7',
  fontSize: '22px',
  fontWeight: '900',
  margin: '0 0 4px',
}

const statLabel = {
  color: '#9B93C9',
  fontSize: '11px',
  fontWeight: '700',
  margin: '0',
  textTransform: 'uppercase' as const,
}

const card = {
  backgroundColor: '#F5F3FF',
  borderRadius: '12px',
  padding: '16px 20px',
  margin: '16px 0',
}

const cardLabel = {
  color: '#9B93C9',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.5px',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
}

const cardValue = {
  color: '#2D2B55',
  fontSize: '14px',
  fontWeight: '700',
  margin: '0',
}

const topicTags = {
  color: '#6C5CE7',
  fontSize: '13px',
  fontWeight: '700',
  margin: '4px 0 0',
}

const divider = {
  borderColor: '#E8E4FF',
  margin: '20px 0',
}

const guestBubble = {
  backgroundColor: '#FFF5F5',
  borderRadius: '12px',
  padding: '12px 16px',
  margin: '0 0 8px',
}

const aiBubble = {
  backgroundColor: '#F5F3FF',
  borderRadius: '12px',
  padding: '12px 16px',
  margin: '0 0 8px',
}

const bubbleLabel = {
  color: '#9B93C9',
  fontSize: '10px',
  fontWeight: '700',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
}

const bubbleText = {
  color: '#2D2B55',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
}

const mutedText = {
  color: '#9B93C9',
  fontSize: '13px',
  textAlign: 'center' as const,
  margin: '8px 0 0',
}

const button = {
  backgroundColor: '#6C5CE7',
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
