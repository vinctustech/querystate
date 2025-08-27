import { qs, useQueryState } from '@vinctus/querystate'

export function BooleanArray() {
  const { flags, setFlags } = useQueryState({ flags: qs.boolean().array() })
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
      <h2>Boolean - Arrays</h2>
      <div style={{ marginBottom: '30px' }}>
        <h3>Boolean array</h3>
        <p>Flags: {displayValue(flags)}</p>
        <p>
          Type: {typeof flags}, Array: {Array.isArray(flags).toString()}
        </p>
        <button style={buttonStyle} onClick={() => setFlags([true, false, true])}>
          Set [true, false, true]
        </button>
        <button style={buttonStyle} onClick={() => setFlags([false])}>
          Set [false]
        </button>
        <button style={buttonStyle} onClick={() => setFlags([])}>
          Set []
        </button>
        <button style={buttonStyle} onClick={() => setFlags(undefined)}>
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
          <strong>flags:</strong> {typeof flags}, isArray: {Array.isArray(flags).toString()}
        </p>
        <p>
          <strong>Expected:</strong> boolean[] (never undefined)
        </p>
      </div>
    </div>
  )
}
