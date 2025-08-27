import { qs, useQueryState } from '@vinctus/querystate'

export function StringValidations() {
  const { email, setEmail, website, setWebsite, userId, setUserId } = useQueryState({
    email: qs.string().email().default('user@example.com'),
    website: qs.string().url(),
    userId: qs.string().uuid(),
  })

  const buttonStyle = {
    padding: '8px 16px',
    margin: '4px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#1890ff',
    color: '#fff',
    fontSize: '14px',
  }
  const displayValue = (value: any) =>
    value === undefined ? (
      <span style={{ color: '#888', fontStyle: 'italic' }}>undefined</span>
    ) : (
      <span style={{ color: '#52c41a' }}>{JSON.stringify(value)}</span>
    )

  return (
    <div style={{ color: 'white', padding: '20px', fontFamily: 'monospace' }}>
      <h2>String - Validations</h2>
      <div style={{ marginBottom: '30px' }}>
        <h3>Email validation</h3>
        <p>Email: {displayValue(email)}</p>
        <button style={buttonStyle} onClick={() => setEmail('test@example.com')}>
          Valid Email
        </button>
        <button style={buttonStyle} onClick={() => setEmail('invalid-email')}>
          Invalid Email
        </button>
        <button style={buttonStyle} onClick={() => setEmail(undefined)}>
          Clear
        </button>
      </div>
      <div
        style={{
          marginTop: '30px',
          padding: '16px',
          backgroundColor: '#262626',
          borderRadius: '6px',
        }}
      >
        <h3>Type Information</h3>
        <p>
          <strong>email:</strong> {typeof email} (should be string, never undefined due to default)
        </p>
        <p>
          <strong>URL params:</strong> {window.location.search || '(none)'}
        </p>
      </div>
    </div>
  )
}
