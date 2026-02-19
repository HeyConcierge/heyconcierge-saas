import {
  Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text, Row, Column,
} from '@react-email/components'

interface PropertyStats {
  name: string
  messages: number
  guests: number
  escalations: number
  topQuestion?: string
}

interface WeeklyDigestProps {
  hostName?: string
  weekLabel?: string
  totalMessages?: number
  totalGuests?: number
  totalEscalations?: number
  responseRate?: number
  avgResponseTime?: string
  properties?: PropertyStats[]
  topQuestions?: string[]
}

export default function WeeklyDigest({
  hostName = 'Erik',
  weekLabel = 'Feb 10 – Feb 16, 2026',
  totalMessages = 47,
  totalGuests = 8,
  totalEscalations = 1,
  responseRate = 98,
  avgResponseTime = '< 5 sec',
  properties = [
    { name: 'Aurora Haven Beach Villa', messages: 28, guests: 5, escalations: 1, topQuestion: 'WiFi password' },
    { name: 'Mountain Lodge Retreat', messages: 19, guests: 3, escalations: 0, topQuestion: 'Check-out time' },
  ],
  topQuestions = ['WiFi password', 'Check-out time', 'Restaurant recommendations', 'Parking info'],
}: WeeklyDigestProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Your weekly recap: ${totalMessages} messages, ${totalGuests} guests`}</Preview>
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
            <Heading style={h1}>Weekly Digest</Heading>
            <Text style={paragraph}>
              Hi {hostName}, here&apos;s how your AI concierge performed this week.
            </Text>
            <Text style={weekText}>{weekLabel}</Text>

            {/* Top-Level Stats */}
            <Section style={statsGrid}>
              <Row>
                <Column style={statCard}>
                  <Text style={statEmoji}>💬</Text>
                  <Text style={statNumber}>{totalMessages}</Text>
                  <Text style={statLabel}>Messages</Text>
                </Column>
                <Column style={statCard}>
                  <Text style={statEmoji}>👤</Text>
                  <Text style={statNumber}>{totalGuests}</Text>
                  <Text style={statLabel}>Guests</Text>
                </Column>
              </Row>
              <Row style={{ marginTop: '8px' }}>
                <Column style={statCard}>
                  <Text style={statEmoji}>⚡</Text>
                  <Text style={statNumber}>{responseRate}%</Text>
                  <Text style={statLabel}>Auto-resolved</Text>
                </Column>
                <Column style={statCard}>
                  <Text style={statEmoji}>🚨</Text>
                  <Text style={{ ...statNumber, color: totalEscalations > 0 ? '#FF6B6B' : '#55EFC4' }}>
                    {totalEscalations}
                  </Text>
                  <Text style={statLabel}>Escalations</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={divider} />

            {/* Per-Property Breakdown */}
            <Text style={sectionTitle}>BY PROPERTY</Text>
            {properties.map((prop, i) => (
              <Section key={i} style={propertyCard}>
                <Text style={propertyName}>{prop.name}</Text>
                <Row>
                  <Column>
                    <Text style={propStat}>{prop.messages} messages</Text>
                  </Column>
                  <Column>
                    <Text style={propStat}>{prop.guests} guests</Text>
                  </Column>
                  <Column>
                    <Text style={{
                      ...propStat,
                      color: prop.escalations > 0 ? '#FF6B6B' : '#55EFC4',
                    }}>
                      {prop.escalations} escalation{prop.escalations !== 1 ? 's' : ''}
                    </Text>
                  </Column>
                </Row>
                {prop.topQuestion && (
                  <Text style={topQuestionText}>Top question: {prop.topQuestion}</Text>
                )}
              </Section>
            ))}

            <Hr style={divider} />

            {/* Top Questions */}
            <Text style={sectionTitle}>MOST ASKED QUESTIONS</Text>
            {topQuestions.map((q, i) => (
              <Text key={i} style={questionItem}>
                {i + 1}. {q}
              </Text>
            ))}

            <Hr style={divider} />

            {/* Performance Note */}
            <Section style={performanceBox}>
              <Text style={performanceText}>
                Your AI concierge auto-resolved {responseRate}% of guest questions with an average response time of {avgResponseTime}. That&apos;s {totalMessages} messages you didn&apos;t have to answer manually this week.
              </Text>
            </Section>

            {/* CTA */}
            <Section style={{ textAlign: 'center' as const, marginTop: '24px' }}>
              <Link href="https://www.heyconcierge.io/dashboard" style={button}>
                View Dashboard
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
              {' · '}
              <Link href="https://www.heyconcierge.io/dashboard" style={footerLink}>Manage notifications</Link>
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
  margin: '0 0 4px',
}

const weekText = {
  color: '#9B93C9',
  fontSize: '13px',
  fontWeight: '700',
  margin: '0 0 20px',
}

const statsGrid = {
  margin: '0',
}

const statCard = {
  textAlign: 'center' as const,
  backgroundColor: '#F5F3FF',
  borderRadius: '12px',
  padding: '16px 8px',
}

const statEmoji = {
  fontSize: '20px',
  margin: '0 0 4px',
}

const statNumber = {
  color: '#6C5CE7',
  fontSize: '24px',
  fontWeight: '900',
  margin: '0 0 2px',
}

const statLabel = {
  color: '#9B93C9',
  fontSize: '10px',
  fontWeight: '700',
  margin: '0',
  textTransform: 'uppercase' as const,
}

const divider = {
  borderColor: '#E8E4FF',
  margin: '24px 0',
}

const sectionTitle = {
  color: '#9B93C9',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.5px',
  margin: '0 0 12px',
  textTransform: 'uppercase' as const,
}

const propertyCard = {
  backgroundColor: '#FAFAFE',
  borderRadius: '12px',
  padding: '16px',
  margin: '0 0 8px',
  border: '1px solid #E8E4FF',
}

const propertyName = {
  color: '#2D2B55',
  fontSize: '15px',
  fontWeight: '800',
  margin: '0 0 8px',
}

const propStat = {
  color: '#6C5CE7',
  fontSize: '12px',
  fontWeight: '700',
  margin: '0',
}

const topQuestionText = {
  color: '#9B93C9',
  fontSize: '11px',
  fontStyle: 'italic' as const,
  margin: '8px 0 0',
}

const questionItem = {
  color: '#2D2B55',
  fontSize: '14px',
  margin: '0 0 6px',
  paddingLeft: '4px',
}

const performanceBox = {
  backgroundColor: '#F0FFF4',
  borderRadius: '12px',
  padding: '16px',
  borderLeft: '3px solid #55EFC4',
}

const performanceText = {
  color: '#2D2B55',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0',
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
