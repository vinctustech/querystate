import { queryState, useQueryState } from '@vinctus/querystate'

function App() {
  const schema = {
    // String with constraints
    name: queryState.string().min(2).max(10).default('John'),
    
    // Number with constraints  
    age: queryState.number().min(0).max(120).default(25),
    
    // Simple string without constraints
    category: queryState.string(),
    
    // Number without constraints
    score: queryState.number(),
    
    // Boolean with default
    isActive: queryState.boolean().default(true),
    
    // Simple boolean without default
    hasDiscount: queryState.boolean(),
    
    // String array with constraints
    tags: queryState.stringArray().min(1).max(3).default(['react', 'typescript']),
    
    // Simple string array without constraints
    categories: queryState.stringArray()
  }
  
  const { 
    name, setName, 
    age, setAge, 
    category, setCategory, 
    score, setScore,
    isActive, setIsActive,
    hasDiscount, setHasDiscount,
    tags, setTags,
    categories, setCategories
  } = useQueryState(schema)
  
  // Debug output
  const hookDebug = (globalThis as any).queryStateDebug || []
  
  const debugInfo = [
    `=== SCHEMA DEBUG ===`,
    `Schema name object: ${JSON.stringify(schema.name, null, 2)}`,
    `Schema name keys: ${Object.keys(schema.name).join(', ')}`,
    `Schema name defaultValue: ${(schema.name as any).defaultValue}`,
    ``,
    `Schema age object: ${JSON.stringify(schema.age, null, 2)}`, 
    `Schema age keys: ${Object.keys(schema.age).join(', ')}`,
    `Schema age defaultValue: ${(schema.age as any).defaultValue}`,
    ``,
    `Schema isActive object: ${JSON.stringify(schema.isActive, null, 2)}`,
    `Schema isActive keys: ${Object.keys(schema.isActive).join(', ')}`,
    `Schema isActive defaultValue: ${(schema.isActive as any).defaultValue}`,
    ``,
    `=== CURRENT VALUES ===`,
    `Current name value: ${name}`,
    `Current age value: ${age}`,
    `Current isActive value: ${isActive}`,
    `Current URL params: ${window.location.search}`,
    ``,
    `=== HOOK DEBUG ===`,
    ...hookDebug
  ].join('\n')
  
  const buttonStyle = {
    background: '#1890ff', 
    color: 'white', 
    border: 'none', 
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '2px'
  }
  
  const clearButtonStyle = {
    ...buttonStyle,
    background: '#ff4d4f'
  }
  
  // Helper to display values clearly
  const displayValue = (value: any) => {
    if (value === undefined) {
      return <span style={{ color: '#888', fontStyle: 'italic' }}>undefined</span>
    }
    if (value === null) {
      return <span style={{ color: '#888', fontStyle: 'italic' }}>null</span>
    }
    return <span style={{ color: '#fff' }}>{String(value)}</span>
  }
  
  return (
    <div style={{ color: 'white', padding: '20px', fontFamily: 'monospace' }}>
      <h1><code>useQueryState</code> Demo App</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>String with constraints (min: 2, max: 10, default: 'John')</h3>
        <p>Name: {displayValue(name)}</p>
        <button style={buttonStyle} onClick={() => setName('A')}>
          Set 'A' (too short)
        </button>
        <button style={buttonStyle} onClick={() => setName('ThisNameIsTooLong')}>
          Set long name (will truncate)
        </button>
        <button style={buttonStyle} onClick={() => setName('Alice')}>
          Set 'Alice' (valid)
        </button>
        <button style={clearButtonStyle} onClick={() => setName(undefined)}>
          Clear
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Number with constraints (min: 0, max: 120, default: 25)</h3>
        <p>Age: {displayValue(age)}</p>
        <button style={buttonStyle} onClick={() => setAge(-5)}>
          Set -5 (clamps to 0)
        </button>
        <button style={buttonStyle} onClick={() => setAge(150)}>
          Set 150 (clamps to 120)
        </button>
        <button style={buttonStyle} onClick={() => setAge(30)}>
          Set 30 (valid)
        </button>
        <button style={clearButtonStyle} onClick={() => setAge(undefined)}>
          Clear
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Simple string (no constraints)</h3>
        <p>Category: {displayValue(category)}</p>
        <button style={buttonStyle} onClick={() => setCategory('electronics')}>
          Set 'electronics'
        </button>
        <button style={buttonStyle} onClick={() => setCategory('books')}>
          Set 'books'
        </button>
        <button style={clearButtonStyle} onClick={() => setCategory(undefined)}>
          Clear
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Simple number (no constraints)</h3>
        <p>Score: {displayValue(score)}</p>
        <button style={buttonStyle} onClick={() => setScore(100)}>
          Set 100
        </button>
        <button style={buttonStyle} onClick={() => setScore(42.5)}>
          Set 42.5
        </button>
        <button style={clearButtonStyle} onClick={() => setScore(undefined)}>
          Clear
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Boolean with default (default: true)</h3>
        <p>Is Active: {displayValue(isActive)}</p>
        <button style={buttonStyle} onClick={() => setIsActive(true)}>
          Set true
        </button>
        <button style={buttonStyle} onClick={() => setIsActive(false)}>
          Set false
        </button>
        <button style={clearButtonStyle} onClick={() => setIsActive(undefined)}>
          Clear (revert to default)
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Simple boolean (no default)</h3>
        <p>Has Discount: {displayValue(hasDiscount)}</p>
        <button style={buttonStyle} onClick={() => setHasDiscount(true)}>
          Set true
        </button>
        <button style={buttonStyle} onClick={() => setHasDiscount(false)}>
          Set false
        </button>
        <button style={clearButtonStyle} onClick={() => setHasDiscount(undefined)}>
          Clear
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>String array with constraints (min: 1, max: 3, default: ['react', 'typescript'])</h3>
        <p>Tags: {displayValue(Array.isArray(tags) ? tags.join(', ') : tags)}</p>
        <button style={buttonStyle} onClick={() => setTags([])}>
          Set [] (too few)
        </button>
        <button style={buttonStyle} onClick={() => setTags(['react', 'typescript', 'javascript', 'node'])}>
          Set 4 items (will truncate to 3)
        </button>
        <button style={buttonStyle} onClick={() => setTags(['vue', 'angular'])}>
          Set ['vue', 'angular'] (valid)
        </button>
        <button style={clearButtonStyle} onClick={() => setTags(undefined)}>
          Clear
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Simple string array (no constraints)</h3>
        <p>Categories: {displayValue(Array.isArray(categories) ? categories.join(', ') : categories)}</p>
        <button style={buttonStyle} onClick={() => setCategories(['tech', 'design'])}>
          Set ['tech', 'design']
        </button>
        <button style={buttonStyle} onClick={() => setCategories(['food', 'travel', 'health'])}>
          Set ['food', 'travel', 'health']
        </button>
        <button style={clearButtonStyle} onClick={() => setCategories(undefined)}>
          Clear
        </button>
      </div>
      
      <div style={{ marginTop: '30px', padding: '10px', background: '#333', borderRadius: '4px' }}>
        <h3>Current URL:</h3>
        <p style={{ wordBreak: 'break-all' }}>
          {window.location.search || '(empty)'}
        </p>
      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', background: '#222', borderRadius: '4px' }}>
        <h3>Debug Output:</h3>
        <textarea
          value={debugInfo}
          readOnly
          style={{
            width: '100%',
            height: '300px',
            fontFamily: 'monospace',
            fontSize: '12px',
            background: '#1a1a1a',
            color: '#ccc',
            border: '1px solid #555',
            padding: '10px',
            resize: 'vertical'
          }}
        />
      </div>
    </div>
  )
}

export default App