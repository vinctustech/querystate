import { qs, useQueryState } from '@vinctus/querystate'

export function NumberSingle() {
  const { score, setScore, age, setAge } = useQueryState({
    score: qs.number(),
    age: qs.number().min(0).max(120).default(25),
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
    if (value === null) {
      return <span style={{ color: '#888', fontStyle: 'italic' }}>null</span>
    }
    return <span style={{ color: '#52c41a' }}>{JSON.stringify(value)}</span>
  }

  return (
    <div style={{ color: 'white', padding: '20px', fontFamily: 'monospace' }}>
      <h2>Number - Single Values</h2>

      <div style={{ marginBottom: '30px' }}>
        <h3>Number without default</h3>
        <p>Score: {displayValue(score)}</p>
        <p>
          Type: <code>{typeof score}</code>
        </p>
        <button style={buttonStyle} onClick={() => setScore(100)}>
          Set 100
        </button>
        <button style={buttonStyle} onClick={() => setScore(0)}>
          Set 0
        </button>
        <button style={buttonStyle} onClick={() => setScore(-50)}>
          Set -50
        </button>
        <button style={buttonStyle} onClick={() => setScore(3.14)}>
          Set 3.14
        </button>
        <button style={buttonStyle} onClick={() => setScore(undefined)}>
          Clear (undefined)
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Number with constraints and default (min: 0, max: 120, default: 25)</h3>
        <p>Age: {displayValue(age)}</p>
        <p>
          Type: <code>{typeof age}</code>
        </p>
        <button style={buttonStyle} onClick={() => setAge(30)}>
          Set 30
        </button>
        <button style={buttonStyle} onClick={() => setAge(0)}>
          Set 0 (min boundary)
        </button>
        <button style={buttonStyle} onClick={() => setAge(120)}>
          Set 120 (max boundary)
        </button>
        <button style={buttonStyle} onClick={() => setAge(-10)}>
          Set -10 (should clamp to 0)
        </button>
        <button style={buttonStyle} onClick={() => setAge(150)}>
          Set 150 (should clamp to 120)
        </button>
        <button style={buttonStyle} onClick={() => setAge(undefined)}>
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
          <strong>score:</strong> {typeof score} (should be number | undefined)
        </p>
        <p>
          <strong>age:</strong> {typeof age} (should be number, never undefined due to default)
        </p>
        <p>
          <strong>URL params:</strong> {window.location.search || '(none)'}
        </p>
      </div>
    </div>
  )
}
