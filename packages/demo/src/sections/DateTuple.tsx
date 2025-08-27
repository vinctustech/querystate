import { qs, useQueryState } from '@vinctus/querystate'

export function DateTuple() {
  const { dateRange, setDateRange } = useQueryState({ dateRange: qs.date().tuple(2) })
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
      <h2>Date - Tuples</h2>
      <div style={{ marginBottom: '30px' }}>
        <h3>Date tuple (exactly 2 dates)</h3>
        <p>Date Range: {displayValue(dateRange)}</p>
        <p>
          Type: {typeof dateRange}, Array: {Array.isArray(dateRange).toString()}
        </p>
        <button
          style={buttonStyle}
          onClick={() => setDateRange([new Date('2024-01-01'), new Date('2024-12-31')])}
        >
          Set 2024 range
        </button>
        <button
          style={buttonStyle}
          onClick={() => setDateRange([new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)])}
        >
          Set Today + 7 days
        </button>
        <button style={buttonStyle} onClick={() => setDateRange(undefined)}>
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
          <strong>dateRange:</strong> {typeof dateRange}, isArray:{' '}
          {Array.isArray(dateRange).toString()}
        </p>
        <p>
          <strong>Expected:</strong> [Date, Date] | undefined
        </p>
      </div>
    </div>
  )
}
