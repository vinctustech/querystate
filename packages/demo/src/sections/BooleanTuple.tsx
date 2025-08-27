import { qs, useQueryState } from '@vinctus/querystate'

export function BooleanTuple() {
  const { switches, setSwitches } = useQueryState({ switches: qs.boolean().tuple(2) })
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
      <h2>Boolean - Tuples</h2>
      <div style={{ marginBottom: '30px' }}>
        <h3>Boolean tuple (exactly 2 booleans)</h3>
        <p>Switches: {displayValue(switches)}</p>
        <p>
          Type: {typeof switches}, Array: {Array.isArray(switches).toString()}
        </p>
        <button style={buttonStyle} onClick={() => setSwitches([true, false])}>
          Set [true, false]
        </button>
        <button style={buttonStyle} onClick={() => setSwitches([false, true])}>
          Set [false, true]
        </button>
        <button style={buttonStyle} onClick={() => setSwitches([true, true])}>
          Set [true, true]
        </button>
        <button style={buttonStyle} onClick={() => setSwitches(undefined)}>
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
          <strong>switches:</strong> {typeof switches}, isArray:{' '}
          {Array.isArray(switches).toString()}
        </p>
        <p>
          <strong>Expected:</strong> [boolean, boolean] | undefined
        </p>
      </div>
    </div>
  )
}
