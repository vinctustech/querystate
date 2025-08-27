import { qs, useQueryState } from '@vinctus/querystate'

export function NumberArray() {
  const { scores, setScores } = useQueryState({ scores: qs.number().array() })
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
      <h2>Number - Arrays</h2>
      <div style={{ marginBottom: '30px' }}>
        <h3>Number array without default</h3>
        <p>Scores: {displayValue(scores)}</p>
        <p>
          Type: {typeof scores}, Array: {Array.isArray(scores).toString()}
        </p>
        <p>Join: "{Array.isArray(scores) ? scores.join(', ') : 'N/A'}"</p>
        <button style={buttonStyle} onClick={() => setScores([85, 92, 78])}>
          Set [85, 92, 78]
        </button>
        <button style={buttonStyle} onClick={() => setScores([100])}>
          Set [100]
        </button>
        <button style={buttonStyle} onClick={() => setScores([])}>
          Set []
        </button>
        <button style={buttonStyle} onClick={() => setScores(undefined)}>
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
          <strong>scores:</strong> {typeof scores}, isArray: {Array.isArray(scores).toString()}
        </p>
        <p>
          <strong>Expected:</strong> number[] (never undefined, empty array when no values)
        </p>
      </div>
    </div>
  )
}
