import {
  Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text, Row, Column,
} from '@react-email/components'

interface BookingConfirmationProps {
  hostName?: string
  guestName?: string
  propertyName?: string
  checkIn?: string
  checkOut?: string
  numGuests?: number
  platform?: string
  propertyAddress?: string
  specialRequests?: string
}

export default function BookingConfirmation({
  hostName = 'Erik',
  guestName = 'Sarah Johnson',
  propertyName = 'Aurora Haven Beach Villa',
  checkIn = 'March 15, 2026',
  checkOut = 'March 20, 2026',
  numGuests = 2,
  platform = 'Airbnb',
  propertyAddress = '123 Sunset Blvd, Malibu',
  specialRequests = 'Late check-in around 10pm',
}: BookingConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>New booking: {guestName} arriving {checkIn}</Preview>
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
            <Heading style={h1}>New Booking Confirmed</Heading>
            <Text style={paragraph}>
              Hi {hostName}, you have a new guest arriving soon!
            </Text>

            {/* Booking Details Card */}
            <Section style={card}>
              <Text style={cardLabel}>GUEST</Text>
              <Text style={cardValue}>{guestName}</Text>

              <Hr style={divider} />

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

              <Hr style={divider} />

              <Row>
                <Column>
                  <Text style={cardLabel}>GUESTS</Text>
                  <Text style={cardValue}>{numGuests}</Text>
                </Column>
                <Column>
                  <Text style={cardLabel}>PLATFORM</Text>
                  <Text style={cardValue}>{platform}</Text>
                </Column>
              </Row>

              {specialRequests && (
                <>
                  <Hr style={divider} />
                  <Text style={cardLabel}>SPECIAL REQUESTS</Text>
                  <Text style={{ ...cardValue, fontStyle: 'italic' }}>{specialRequests}</Text>
                </>
              )}
            </Section>

            {/* Property */}
            <Section style={propertySection}>
              <Text style={cardLabel}>PROPERTY</Text>
              <Text style={{ ...cardValue, fontSize: '16px' }}>{propertyName}</Text>
              <Text style={mutedText}>{propertyAddress}</Text>
            </Section>

            {/* CTA */}
            <Section style={{ textAlign: 'center' as const, marginTop: '24px' }}>
              <Link href="https://www.heyconcierge.io/dashboard" style={button}>
                View in Dashboard
              </Link>
            </Section>

            <Text style={mutedText}>
              Your AI concierge is ready to assist {guestName} when they scan the QR code at the property.
            </Text>
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

// Styles
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

const card = {
  backgroundColor: '#F5F3FF',
  borderRadius: '12px',
  padding: '20px',
  margin: '20px 0',
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
  fontSize: '15px',
  fontWeight: '700',
  margin: '0 0 8px',
}

const divider = {
  borderColor: '#E8E4FF',
  margin: '12px 0',
}

const propertySection = {
  marginTop: '20px',
  padding: '16px 0',
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

const mutedText = {
  color: '#9B93C9',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '12px 0 0',
  textAlign: 'center' as const,
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
