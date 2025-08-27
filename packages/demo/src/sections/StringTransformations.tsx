import { qs, useQueryState } from '@vinctus/querystate'

export function StringTransformations() {
  const { username, setUsername, displayName, setDisplayName, code, setCode } = useQueryState({
    username: qs.string().min(3).max(20).lowercase().default('user123'),
    displayName: qs.string().min(2).max(30).uppercase(),
    code: qs.string().uppercase(),
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
      <h2>String - Transformations</h2>

      <div style={{ marginBottom: '30px' }}>
        <h3>Lowercase transformation (min: 3, max: 20)</h3>
        <p>Username: {displayValue(username)}</p>
        <button style={buttonStyle} onClick={() => setUsername('JOHN123')}>
          Set 'JOHN123' (should become lowercase)
        </button>
        <button style={buttonStyle} onClick={() => setUsername('MixedCase')}>
          Set 'MixedCase'
        </button>
        <button style={buttonStyle} onClick={() => setUsername(undefined)}>
          Clear
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Uppercase transformation (min: 2, max: 30)</h3>
        <p>Display Name: {displayValue(displayName)}</p>
        <button style={buttonStyle} onClick={() => setDisplayName('john doe')}>
          Set 'john doe' (should become uppercase)
        </button>
        <button style={buttonStyle} onClick={() => setDisplayName('Alice')}>
          Set 'Alice'
        </button>
        <button style={buttonStyle} onClick={() => setDisplayName(undefined)}>
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
          <strong>username:</strong> {typeof username} (should be string, never undefined due to
          default)
        </p>
        <p>
          <strong>displayName:</strong> {typeof displayName} (should be string | undefined)
        </p>
        <p>
          <strong>URL params:</strong> {window.location.search || '(none)'}
        </p>
      </div>
    </div>
  )
}
