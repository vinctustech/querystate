import { qs, useQueryState } from '@vinctus/querystate'

export function StringTuple() {
  const { coords, setCoords } = useQueryState({
    coords: qs.string().tuple(2),
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
      <h2>String - Tuples</h2>
      <div style={{ marginBottom: '30px' }}>
        <h3>String tuple (exactly 2 strings)</h3>
        <p>Coords: {displayValue(coords)}</p>
        <p>
          Type: {typeof coords}, Array: {Array.isArray(coords).toString()}
        </p>
        <button style={buttonStyle} onClick={() => setCoords(['x', 'y'])}>
          Set ['x', 'y']
        </button>
        <button style={buttonStyle} onClick={() => setCoords(['left', 'top'])}>
          Set ['left', 'top']
        </button>
        <button style={buttonStyle} onClick={() => setCoords(undefined)}>
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
          <strong>coords:</strong> {typeof coords}, isArray: {Array.isArray(coords).toString()}
        </p>
        <p>
          <strong>Expected:</strong> [string, string] | undefined
        </p>
      </div>
    </div>
  )
}
