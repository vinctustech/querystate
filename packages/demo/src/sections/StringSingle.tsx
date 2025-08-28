import { qs, useQueryState } from '@vinctus/querystate'

export function StringSingle() {
  const { category, setCategory, name, setName, granularity, setGranularity, status, setStatus } = useQueryState({
    category: qs.string(),
    name: qs.string().default('John'),
    granularity: qs.string().enum(['day', 'week', 'month'] as const).default('day'),
    status: qs.string().enum(['pending', 'active', 'completed'] as const),
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
    if (typeof value === 'string' && value === '') {
      return <span style={{ color: '#888', fontStyle: 'italic' }}>(empty string)</span>
    }
    return <span style={{ color: '#52c41a' }}>{JSON.stringify(value)}</span>
  }

  return (
    <div style={{ color: 'white', padding: '20px', fontFamily: 'monospace' }}>
      <h2>String - Single Values</h2>

      <div style={{ marginBottom: '30px' }}>
        <h3>String without default</h3>
        <p>Category: {displayValue(category)}</p>
        <p>
          Type: <code>{typeof category}</code>
        </p>
        <button style={buttonStyle} onClick={() => setCategory('tech')}>
          Set 'tech'
        </button>
        <button style={buttonStyle} onClick={() => setCategory('design')}>
          Set 'design'
        </button>
        <button style={buttonStyle} onClick={() => setCategory('')}>
          Set empty string
        </button>
        <button style={buttonStyle} onClick={() => setCategory(undefined)}>
          Clear (undefined)
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>String with default value</h3>
        <p>Name: {displayValue(name)}</p>
        <p>
          Type: <code>{typeof name}</code>
        </p>
        <button style={buttonStyle} onClick={() => setName('Alice')}>
          Set 'Alice'
        </button>
        <button style={buttonStyle} onClick={() => setName('Bob')}>
          Set 'Bob'
        </button>
        <button style={buttonStyle} onClick={() => setName('')}>
          Set empty string
        </button>
        <button style={buttonStyle} onClick={() => setName(undefined)}>
          Clear (should revert to default)
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>String enum with default value</h3>
        <p>Granularity: {displayValue(granularity)}</p>
        <p>
          Type: <code>{typeof granularity}</code>
        </p>
        <button style={buttonStyle} onClick={() => setGranularity('day')}>
          Set 'day'
        </button>
        <button style={buttonStyle} onClick={() => setGranularity('week')}>
          Set 'week'
        </button>
        <button style={buttonStyle} onClick={() => setGranularity('month')}>
          Set 'month'
        </button>
        <button style={buttonStyle} onClick={() => setGranularity('invalid' as any)}>
          Set 'invalid' (should revert to default)
        </button>
        <button style={buttonStyle} onClick={() => setGranularity(undefined)}>
          Clear (should revert to default)
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>String enum without default</h3>
        <p>Status: {displayValue(status)}</p>
        <p>
          Type: <code>{typeof status}</code>
        </p>
        <button style={buttonStyle} onClick={() => setStatus('pending')}>
          Set 'pending'
        </button>
        <button style={buttonStyle} onClick={() => setStatus('active')}>
          Set 'active'
        </button>
        <button style={buttonStyle} onClick={() => setStatus('completed')}>
          Set 'completed'
        </button>
        <button style={buttonStyle} onClick={() => setStatus('invalid' as any)}>
          Set 'invalid' (should become undefined)
        </button>
        <button style={buttonStyle} onClick={() => setStatus(undefined)}>
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
          <strong>category:</strong> {typeof category} (should be string | undefined)
        </p>
        <p>
          <strong>name:</strong> {typeof name} (should be string, never undefined due to default)
        </p>
        <p>
          <strong>granularity:</strong> {typeof granularity} (should be 'day' | 'week' | 'month', never undefined due to default)
        </p>
        <p>
          <strong>status:</strong> {typeof status} (should be 'pending' | 'active' | 'completed' | undefined)
        </p>
        <p>
          <strong>URL params:</strong> {window.location.search || '(none)'}
        </p>
      </div>
    </div>
  )
}
