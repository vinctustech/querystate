import { qs, useQueryState } from '@vinctus/querystate'

export function NumberTuple() {
  const { point, setPoint, dimensions, setDimensions, range, setRange } = useQueryState({
    point: qs.number().tuple(2),
    dimensions: qs.number().min(0).tuple(2).default([100, 200]),
    range: qs.number().tuple(2),
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
      <h2>Number - Tuples</h2>

      <div style={{ marginBottom: '30px' }}>
        <h3>Number tuple without default (exactly 2 numbers)</h3>
        <p>Point: {displayValue(point)}</p>
        <p>
          Type: <code>{typeof point}</code>, Array: <code>{Array.isArray(point).toString()}</code>
        </p>
        <p>
          Length: <code>{Array.isArray(point) ? point.length : 'N/A'}</code>
        </p>

        <button style={buttonStyle} onClick={() => setPoint([10, 20])}>
          Set [10, 20]
        </button>
        <button style={buttonStyle} onClick={() => setPoint([0, 0])}>
          Set [0, 0]
        </button>
        <button style={buttonStyle} onClick={() => setPoint([-5, 15.5])}>
          Set [-5, 15.5]
        </button>
        <button style={buttonStyle} onClick={() => setPoint([100, -50])}>
          Set [100, -50]
        </button>
        <button style={buttonStyle} onClick={() => setPoint(undefined)}>
          Clear (undefined)
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Number tuple with constraints and default (min: 0, default: [100, 200])</h3>
        <p>Dimensions: {displayValue(dimensions)}</p>
        <p>
          Type: <code>{typeof dimensions}</code>, Array:{' '}
          <code>{Array.isArray(dimensions).toString()}</code>
        </p>
        <p>
          Length: <code>{Array.isArray(dimensions) ? dimensions.length : 'N/A'}</code>
        </p>

        <button style={buttonStyle} onClick={() => setDimensions([300, 400])}>
          Set [300, 400]
        </button>
        <button style={buttonStyle} onClick={() => setDimensions([0, 0])}>
          Set [0, 0] (min boundary)
        </button>
        <button style={buttonStyle} onClick={() => setDimensions([-10, 50])}>
          Set [-10, 50] (should clamp -10 to 0)
        </button>
        <button style={buttonStyle} onClick={() => setDimensions([150, -20])}>
          Set [150, -20] (should clamp -20 to 0)
        </button>
        <button style={buttonStyle} onClick={() => setDimensions(undefined)}>
          Clear (should revert to default)
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Number tuple for range</h3>
        <p>Range: {displayValue(range)}</p>
        <p>
          Type: <code>{typeof range}</code>, Array: <code>{Array.isArray(range).toString()}</code>
        </p>

        <button style={buttonStyle} onClick={() => setRange([1, 10])}>
          Set [1, 10]
        </button>
        <button style={buttonStyle} onClick={() => setRange([25, 75])}>
          Set [25, 75]
        </button>
        <button style={buttonStyle} onClick={() => setRange([0, 100])}>
          Set [0, 100]
        </button>
        <button style={buttonStyle} onClick={() => setRange(undefined)}>
          Clear (undefined)
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
          <strong>point:</strong> {typeof point}, Array: {Array.isArray(point).toString()}
        </p>
        <p>
          <strong>Expected:</strong> [number, number] | undefined
        </p>
        <p>
          <strong>dimensions:</strong> {typeof dimensions}, Array:{' '}
          {Array.isArray(dimensions).toString()}
        </p>
        <p>
          <strong>Expected:</strong> [number, number] (never undefined due to default)
        </p>
        <p>
          <strong>range:</strong> {typeof range}, Array: {Array.isArray(range).toString()}
        </p>
        <p>
          <strong>Expected:</strong> [number, number] | undefined
        </p>
        <p>
          <strong>URL params:</strong> {window.location.search || '(none)'}
        </p>
      </div>
    </div>
  )
}
