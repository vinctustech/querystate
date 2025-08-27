import { qs, useQueryState } from '@vinctus/querystate'

export function StringConstraints() {
  const { name, setName, title, setTitle } = useQueryState({
    name: qs.string().min(2).max(10).default('John'),
    title: qs.string().min(5).max(50),
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
      <h2>String - Constraints</h2>

      <div style={{ marginBottom: '30px' }}>
        <h3>String with length constraints (min: 2, max: 10, default: 'John')</h3>
        <p>Name: {displayValue(name)}</p>
        <p>Length: {typeof name === 'string' ? name.length : 'N/A'}</p>

        <button style={buttonStyle} onClick={() => setName('Al')}>
          Set 'Al' (2 chars - min boundary)
        </button>
        <button style={buttonStyle} onClick={() => setName('Alexander')}>
          Set 'Alexander' (9 chars)
        </button>
        <button style={buttonStyle} onClick={() => setName('Maximiliano')}>
          Set 'Maximiliano' (should truncate to 10 chars)
        </button>
        <button style={buttonStyle} onClick={() => setName('A')}>
          Set 'A' (too short, should revert to default)
        </button>
        <button style={buttonStyle} onClick={() => setName(undefined)}>
          Clear (should revert to default)
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>String with length constraints (min: 5, max: 50, no default)</h3>
        <p>Title: {displayValue(title)}</p>
        <p>Length: {typeof title === 'string' ? title.length : 'N/A'}</p>

        <button style={buttonStyle} onClick={() => setTitle('Hello')}>
          Set 'Hello' (5 chars - min boundary)
        </button>
        <button style={buttonStyle} onClick={() => setTitle('Senior Software Engineer')}>
          Set 'Senior Software Engineer' (24 chars)
        </button>
        <button style={buttonStyle} onClick={() => setTitle('Hi')}>
          Set 'Hi' (too short, should be rejected)
        </button>
        <button style={buttonStyle} onClick={() => setTitle('A'.repeat(60))}>
          Set 60 A's (should truncate to 50)
        </button>
        <button style={buttonStyle} onClick={() => setTitle(undefined)}>
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
          <strong>name:</strong> {typeof name} (should be string, never undefined due to default)
        </p>
        <p>
          <strong>title:</strong> {typeof title} (should be string | undefined)
        </p>
        <p>
          <strong>URL params:</strong> {window.location.search || '(none)'}
        </p>
      </div>
    </div>
  )
}
