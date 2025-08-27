import { qs, useQueryState } from '@vinctus/querystate'

export function BooleanSingle() {
  const { isVisible, setIsVisible, hasAccess, setHasAccess } = useQueryState({
    isVisible: qs.boolean(),
    hasAccess: qs.boolean().default(true),
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

  const displayValue = (value: any) => {
    if (value === undefined) {
      return <span style={{ color: '#888', fontStyle: 'italic' }}>undefined</span>
    }
    return <span style={{ color: '#52c41a' }}>{JSON.stringify(value)}</span>
  }

  return (
    <div style={{ color: 'white', padding: '20px', fontFamily: 'monospace' }}>
      <h2>Boolean - Single Values</h2>

      <div style={{ marginBottom: '30px' }}>
        <h3>Boolean without default</h3>
        <p>Is Visible: {displayValue(isVisible)}</p>
        <p>
          Type: <code>{typeof isVisible}</code>
        </p>

        <button style={buttonStyle} onClick={() => setIsVisible(true)}>
          Set true
        </button>
        <button style={buttonStyle} onClick={() => setIsVisible(false)}>
          Set false
        </button>
        <button style={buttonStyle} onClick={() => setIsVisible(undefined)}>
          Clear (undefined)
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Boolean with default (true)</h3>
        <p>Has Access: {displayValue(hasAccess)}</p>
        <p>
          Type: <code>{typeof hasAccess}</code>
        </p>

        <button style={buttonStyle} onClick={() => setHasAccess(true)}>
          Set true
        </button>
        <button style={buttonStyle} onClick={() => setHasAccess(false)}>
          Set false
        </button>
        <button style={buttonStyle} onClick={() => setHasAccess(undefined)}>
          Clear (should revert to default)
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
          <strong>isVisible:</strong> {typeof isVisible} (should be boolean | undefined)
        </p>
        <p>
          <strong>hasAccess:</strong> {typeof hasAccess} (should be boolean, never undefined due to
          default)
        </p>
        <p>
          <strong>URL params:</strong> {window.location.search || '(none)'}
        </p>
      </div>
    </div>
  )
}
