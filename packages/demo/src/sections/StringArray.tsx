import { qs, useQueryState } from '@vinctus/querystate'

export function StringArray() {
  const { categories, setCategories, tags, setTags, priority, setPriority, sizes, setSizes } = useQueryState({
    categories: qs.string().array(),
    tags: qs.string().array().default(['react', 'typescript']),
    priority: qs.string().enum(['low', 'medium', 'high'] as const).default('medium'),
    sizes: qs.string().array().default(['small', 'medium']),
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
    if (Array.isArray(value) && value.length === 0) {
      return <span style={{ color: '#888', fontStyle: 'italic' }}>(empty array)</span>
    }
    return <span style={{ color: '#52c41a' }}>{JSON.stringify(value)}</span>
  }

  return (
    <div style={{ color: 'white', padding: '20px', fontFamily: 'monospace' }}>
      <h2>String - Arrays</h2>

      <div style={{ marginBottom: '30px' }}>
        <h3>String array without default</h3>
        <p>Categories: {displayValue(categories)}</p>
        <p>
          Type: <code>{typeof categories}</code>, Array:{' '}
          <code>{Array.isArray(categories).toString()}</code>
        </p>
        <p>
          Length: <code>{Array.isArray(categories) ? categories.length : 'N/A'}</code>
        </p>
        <p>
          Join: <code>"{categories.join(', ')}"</code>
        </p>

        <button style={buttonStyle} onClick={() => setCategories(['tech', 'design'])}>
          Set ['tech', 'design']
        </button>
        <button style={buttonStyle} onClick={() => setCategories(['frontend'])}>
          Set ['frontend']
        </button>
        <button style={buttonStyle} onClick={() => setCategories([])}>
          Set empty array []
        </button>
        <button style={buttonStyle} onClick={() => setCategories(['a', 'b', 'c', 'd'])}>
          Set ['a', 'b', 'c', 'd']
        </button>
        <button style={buttonStyle} onClick={() => setCategories(undefined)}>
          Clear (undefined)
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>String array with default</h3>
        <p>Tags: {displayValue(tags)}</p>
        <p>
          Type: <code>{typeof tags}</code>, Array: <code>{Array.isArray(tags).toString()}</code>
        </p>
        <p>
          Length: <code>{Array.isArray(tags) ? tags.length : 'N/A'}</code>
        </p>
        <p>
          Join: <code>"{tags.join(', ')}"</code>
        </p>

        <button style={buttonStyle} onClick={() => setTags(['javascript', 'node'])}>
          Set ['javascript', 'node']
        </button>
        <button style={buttonStyle} onClick={() => setTags(['vue'])}>
          Set ['vue']
        </button>
        <button style={buttonStyle} onClick={() => setTags([])}>
          Set empty array []
        </button>
        <button style={buttonStyle} onClick={() => setTags(undefined)}>
          Clear (should revert to default)
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>String enum (demonstrates enum validation in array context)</h3>
        <p>Priority: {displayValue(priority)}</p>
        <p>
          Type: <code>{typeof priority}</code>
        </p>

        <button style={buttonStyle} onClick={() => setPriority('low')}>
          Set 'low'
        </button>
        <button style={buttonStyle} onClick={() => setPriority('medium')}>
          Set 'medium'
        </button>
        <button style={buttonStyle} onClick={() => setPriority('high')}>
          Set 'high'
        </button>
        <button style={buttonStyle} onClick={() => setPriority('invalid' as any)}>
          Set 'invalid' (should revert to default)
        </button>
        <button style={buttonStyle} onClick={() => setPriority(undefined)}>
          Clear (should revert to default)
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>String array with possible enum values (manual validation)</h3>
        <p>Sizes: {displayValue(sizes)}</p>
        <p>
          Type: <code>{typeof sizes}</code>, Array: <code>{Array.isArray(sizes).toString()}</code>
        </p>
        <p>
          Length: <code>{Array.isArray(sizes) ? sizes.length : 'N/A'}</code>
        </p>
        <p>
          Join: <code>"{sizes.join(', ')}"</code>
        </p>

        <button style={buttonStyle} onClick={() => setSizes(['small', 'large'])}>
          Set ['small', 'large']
        </button>
        <button style={buttonStyle} onClick={() => setSizes(['medium'])}>
          Set ['medium']
        </button>
        <button style={buttonStyle} onClick={() => setSizes(['small', 'medium', 'large'])}>
          Set ['small', 'medium', 'large']
        </button>
        <button style={buttonStyle} onClick={() => setSizes(['invalid', 'small'])}>
          Set ['invalid', 'small'] (no validation on arrays)
        </button>
        <button style={buttonStyle} onClick={() => setSizes([])}>
          Set empty array []
        </button>
        <button style={buttonStyle} onClick={() => setSizes(undefined)}>
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
          <strong>categories:</strong> {typeof categories}, isArray:{' '}
          {Array.isArray(categories).toString()}
        </p>
        <p>
          <strong>Expected:</strong> string[] (never undefined, empty array when no values)
        </p>
        <p>
          <strong>tags:</strong> {typeof tags}, isArray: {Array.isArray(tags).toString()}
        </p>
        <p>
          <strong>Expected:</strong> string[] (never undefined due to default)
        </p>
        <p>
          <strong>priority:</strong> {typeof priority} (should be 'low' | 'medium' | 'high', never undefined due to default)
        </p>
        <p>
          <strong>sizes:</strong> {typeof sizes}, isArray: {Array.isArray(sizes).toString()}
        </p>
        <p>
          <strong>Expected:</strong> string[] (never undefined due to default)
        </p>
        <p>
          <strong>URL params:</strong> {window.location.search || '(none)'}
        </p>
      </div>
    </div>
  )
}
