import { qs, useQueryState } from '@vinctus/querystate'

export function DateArray() {
  const { events, setEvents } = useQueryState({ events: qs.date().array() })
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
      <h2>Date - Arrays</h2>
      <div style={{ marginBottom: '30px' }}>
        <h3>Date array</h3>
        <p>Events: {displayValue(events)}</p>
        <p>
          Type: {typeof events}, Array: {Array.isArray(events).toString()}
        </p>
        <button
          style={buttonStyle}
          onClick={() => setEvents([new Date('2024-01-01'), new Date('2024-12-31')])}
        >
          Set 2024 range
        </button>
        <button style={buttonStyle} onClick={() => setEvents([new Date()])}>
          Set [Today]
        </button>
        <button style={buttonStyle} onClick={() => setEvents([])}>
          Set []
        </button>
        <button style={buttonStyle} onClick={() => setEvents(undefined)}>
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
          <strong>events:</strong> {typeof events}, isArray: {Array.isArray(events).toString()}
        </p>
        <p>
          <strong>Expected:</strong> Date[] (never undefined)
        </p>
      </div>
    </div>
  )
}
