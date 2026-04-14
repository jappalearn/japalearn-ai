import React from 'react';
interface RoadmapPaymentPageProps {
  onBack: () => void;
}
function IconChevronLeftPay({
  size = 16,
  color = 'currentColor'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>;
}
function IconCheckPay({
  size = 12,
  color = '#FFFFFF'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>;
}
function IconLockPay({
  size = 15,
  color = '#FFFFFF'
}: {
  size?: number;
  color?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>;
}
const PAYMENT_INCLUDES: {
  id: string;
  text: string;
}[] = [{
  id: 'pi1',
  text: 'Personalised step-by-step relocation plan'
}, {
  id: 'pi2',
  text: 'Tailored to your UK Skilled Worker pathway'
}, {
  id: 'pi3',
  text: 'Actionable milestones & timelines'
}, {
  id: 'pi4',
  text: 'Downloadable PDF roadmap'
}];
export function RoadmapPaymentPage({
  onBack
}: RoadmapPaymentPageProps) {
  const [cardNumber, setCardNumber] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    border: '1.5px solid #E4E8FF',
    borderRadius: '12px',
    fontSize: '15px',
    color: '#18181B',
    background: '#FAFBFF',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: '"Inter", sans-serif'
  };
  return <div style={{
    minHeight: '100vh',
    width: '100%',
    background: '#F7F9FF',
    fontFamily: '"Inter", sans-serif',
    overflowY: 'auto'
  }}>
    {/* Header */}
    <header style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #ECEEFF',
      padding: isMobile ? '0 16px' : '0 28px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      <button onClick={onBack} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#6B7280',
        fontSize: '14px',
        fontWeight: 500,
        padding: '8px 12px',
        borderRadius: '10px',
        fontFamily: '"Inter", sans-serif'
      }} onMouseEnter={e => {
        e.currentTarget.style.background = '#F4F6FF';
        e.currentTarget.style.color = '#1E4DD7';
      }} onMouseLeave={e => {
        e.currentTarget.style.background = 'none';
        e.currentTarget.style.color = '#6B7280';
      }}>
        <IconChevronLeftPay size={16} color="currentColor" />
        <span>Back to Roadmap</span>
      </button>
      <div style={{
        width: '1px',
        height: '20px',
        background: '#E4E8FF'
      }} />
      <p style={{
        margin: 0,
        fontSize: '15px',
        fontWeight: 600,
        color: '#18181B',
        fontFamily: '"DM Sans", sans-serif'
      }}>Get Your Personalised Roadmap</p>
    </header>

    <main style={{
      maxWidth: '560px',
      margin: '0 auto',
      padding: isMobile ? '20px 16px 60px' : '36px 24px 60px',
      boxSizing: 'border-box'
    }}>
      {/* Hero price card */}
      <div style={{
        background: 'linear-gradient(135deg, #0F2E99 0%, #1E4DD7 50%, #3B75FF 100%)',
        borderRadius: '22px',
        padding: '28px 28px 24px',
        marginBottom: '20px',
        boxShadow: '0px 16px 48px rgba(30,77,215,0.32)'
      }}>
        <p style={{
          margin: '0 0 4px',
          fontSize: '11px',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}>One-time payment</p>
        <p style={{
          margin: '0 0 2px',
          fontSize: '48px',
          fontWeight: 900,
          color: '#FFFFFF',
          fontFamily: '"DM Sans", sans-serif',
          letterSpacing: '-3px',
          lineHeight: 1
        }}>₦5,000</p>
        <p style={{
          margin: '0 0 20px',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.6)'
        }}>Personalised Detailed Roadmap · Instant PDF delivery</p>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '9px'
        }}>
          {PAYMENT_INCLUDES.map(item => <div key={item.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <IconCheckPay size={10} color="#FFFFFF" />
            </div>
            <span style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.88)',
              fontWeight: 500
            }}>{item.text}</span>
          </div>)}
        </div>
      </div>

      {/* Payment form card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '22px',
        padding: '28px',
        border: '1px solid #F0F2FF',
        boxShadow: '0px 4px 24px rgba(30,77,215,0.07)'
      }}>
        <h2 style={{
          margin: '0 0 20px',
          fontSize: '16px',
          fontWeight: 700,
          color: '#18181B',
          fontFamily: '"DM Sans", sans-serif'
        }}>Payment Details</h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: '#4D4D56',
              marginBottom: '6px'
            }}>Card Number</label>
            <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="0000  0000  0000  0000" style={{
              ...inputStyle,
              letterSpacing: '0.08em'
            }} onFocus={e => e.currentTarget.style.borderColor = '#3B75FF'} onBlur={e => e.currentTarget.style.borderColor = '#E4E8FF'} />
          </div>
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <div style={{
              flex: 1
            }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#4D4D56',
                marginBottom: '6px'
              }}>Expiry Date</label>
              <input type="text" value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM / YY" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#3B75FF'} onBlur={e => e.currentTarget.style.borderColor = '#E4E8FF'} />
            </div>
            <div style={{
              flex: 1
            }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#4D4D56',
                marginBottom: '6px'
              }}>CVV</label>
              <input type="text" value={cvv} onChange={e => setCvv(e.target.value)} placeholder="•••" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#3B75FF'} onBlur={e => e.currentTarget.style.borderColor = '#E4E8FF'} />
            </div>
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: '#4D4D56',
              marginBottom: '6px'
            }}>Name on Card</label>
            <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Adaeze Okafor" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#3B75FF'} onBlur={e => e.currentTarget.style.borderColor = '#E4E8FF'} />
          </div>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '14px 16px',
          background: '#F4F7FF',
          borderRadius: '12px',
          border: '1px solid #E0E8FF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '13px',
            color: '#4D4D56',
            fontWeight: 500
          }}>Total due today</span>
          <span style={{
            fontSize: '18px',
            fontWeight: 800,
            color: '#18181B',
            fontFamily: '"DM Sans", sans-serif'
          }}>₦5,000</span>
        </div>

        <button style={{
          width: '100%',
          marginTop: '16px',
          padding: '16px',
          background: 'linear-gradient(135deg, #1E4DD7 0%, #3B75FF 100%)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '14px',
          fontSize: '16px',
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: '"DM Sans", sans-serif',
          boxShadow: '0px 8px 28px rgba(30,77,215,0.38)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          letterSpacing: '-0.2px'
        }}>
          <IconLockPay size={16} color="#FFFFFF" />
          <span>Pay ₦5,000 Securely</span>
        </button>
        <p style={{
          margin: '12px 0 0',
          fontSize: '12px',
          color: '#A0A3AB',
          textAlign: 'center',
          lineHeight: '1.5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px'
        }}>
          <IconLockPay size={11} color="#A0A3AB" />
          <span>256-bit SSL encryption · Your data is safe</span>
        </p>
      </div>
    </main>
  </div>;
}