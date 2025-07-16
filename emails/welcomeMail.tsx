import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
  } from '@react-email/components';
  
  interface TarsWelcomeEmailProps {
    userFirstname: string;
  }
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';
  
  export const TarsWelcomeEmail = ({
    userFirstname,
  }: TarsWelcomeEmailProps) => (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>
          Transforming archives into accessible, actionable knowledge—welcome to TARS AI Document Intelligence.
        </Preview>
        <Container style={container}>
          <Img
            src={`${baseUrl}/static/tars-logo.png`}
            width="170"
            height="50"
            alt="TARS AI"
            style={logo}
          />
          <Text style={paragraph}>Hi {userFirstname},</Text>
          <Text style={paragraph}>
            Welcome to <b>TARS AI</b>, the document intelligence platform that transforms complex archives into accessible, actionable knowledge—empowering you to search, discover, and gain insights effortlessly.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href="https://tarsai.live">
              Get Started with TARS AI
            </Button>
          </Section>
          <Text style={paragraph}>
            We&apos;re excited to have you on board!
            <br />
            The TARS AI Team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            TARS AI, Udaipur, Rajasthan, India<br />
            You&apos;re receiving this email because you joined the TARS AI waitlist.
          </Text>
        </Container>
      </Body>
    </Html>
  );
  
  TarsWelcomeEmail.PreviewProps = {
    userFirstname: 'Alan',
  } as TarsWelcomeEmailProps;
  
  export default TarsWelcomeEmail;
  
  const main = {
    backgroundColor: '#ffffff',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
  };
  
  const logo = {
    margin: '0 auto',
  };
  
  const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
  };
  
  const btnContainer = {
    textAlign: 'center' as const,
  };
  
  const button = {
    backgroundColor: '#393BB2',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px',
  };
  
  const hr = {
    borderColor: '#cccccc',
    margin: '20px 0',
  };
  
  const footer = {
    color: '#8898aa',
    fontSize: '12px',
  };
  