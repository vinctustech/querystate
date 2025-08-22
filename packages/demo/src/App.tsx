import { qs, useQueryState } from '@vinctus/querystate'

// Helper function to get default value from config
function getDefaultValue(config: any): any {
  if (config && typeof config === 'object') {
    if ('defaultValue' in config) {
      return config.defaultValue
    }
    if ('_config' in config && config._config && 'defaultValue' in config._config) {
      return config._config.defaultValue
    }
  }
  return undefined
}

function App() {
  const schema = {
    // String with constraints
    name: qs.string().min(2).max(10).default('John'),
    
    // String transformations
    username: qs.string().min(3).max(20).lowercase().default('user123'),
    displayName: qs.string().min(2).max(30).uppercase(),
    
    // String validations
    email: qs.string().email().default('user@example.com'),
    website: qs.string().url(),
    userId: qs.string().uuid(),
    
    // Number with constraints  
    age: qs.number().min(0).max(120).default(25),
    
    // Simple string without constraints
    category: qs.string(),
    
    // Number without constraints
    score: qs.number(),
    
    // Boolean with default
    isActive: qs.boolean().default(true),
    
    // Simple boolean without default
    hasDiscount: qs.boolean(),
    
    // String array with constraints (strings 2-10 chars, array 1-3 items)
    tags: qs.string().min(2).max(10).array().min(1).max(3).default(['react', 'typescript']),
    
    // Simple string array without constraints
    categories: qs.string().array(),
    
    // Number array with constraints (values 0-100, array 2-4 items)
    scores: qs.number().min(0).max(100).array().min(2).max(4).default([85, 92]),
    
    // Simple number array without constraints
    ratings: qs.number().array(),
    
    // Boolean array with constraints (array 1-3 items)
    features: qs.boolean().array().min(1).max(3).default([true, false]),
    
    // Simple boolean array without constraints
    flags: qs.boolean().array(),
    
    // String tuple (exactly 2 strings, min 2 chars each) - like first/last name
    fullName: qs.string().min(2).tuple(2),
    
    // String tuple with default (exactly 2 strings, min 2 chars each) - like default name  
    defaultName: { ...qs.string().min(2).tuple(2), defaultValue: ['Default', 'User'] }
  }
  
  const { 
    name, setName,
    username, setUsername,
    displayName, setDisplayName,
    email, setEmail,
    website, setWebsite,
    userId, setUserId,
    age, setAge, 
    category, setCategory, 
    score, setScore,
    isActive, setIsActive,
    hasDiscount, setHasDiscount,
    tags, setTags,
    categories, setCategories,
    scores, setScores,
    ratings, setRatings,
    features, setFeatures,
    flags, setFlags,
    fullName, setFullName,
    defaultName, setDefaultName
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
    `Schema fullName object: ${JSON.stringify(schema.fullName, null, 2)}`,
    `Schema fullName keys: ${Object.keys(schema.fullName).join(', ')}`,
    `Schema fullName defaultValue: ${getDefaultValue(schema.fullName)}`,
    ``,
    `Schema defaultName object: ${JSON.stringify(schema.defaultName, null, 2)}`,
    `Schema defaultName keys: ${Object.keys(schema.defaultName).join(', ')}`,
    `Schema defaultName defaultValue: ${getDefaultValue(schema.defaultName)}`,
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
  
  // Section separator styles
  const majorSeparatorStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#4CAF50',
    borderBottom: '2px solid #4CAF50',
    paddingBottom: '8px',
    marginBottom: '15px',
    marginTop: '30px'
  }
  
  const minorSeparatorStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2196F3',
    borderBottom: '1px solid #2196F3',
    paddingBottom: '4px',
    marginBottom: '10px',
    marginTop: '20px'
  }
  
  return (
    <div style={{ color: 'white', padding: '20px', fontFamily: 'monospace' }}>
      <h1><code>useQueryState</code> Demo App</h1>
      
      <div style={majorSeparatorStyle}>📝 Single Value Types</div>
      
      <div style={minorSeparatorStyle}>String Parameters</div>
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

      <div style={minorSeparatorStyle}>String Transformations</div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Lowercase string (min: 3, max: 20, default: 'user123')</h3>
        <p>Username: {displayValue(username)}</p>
        <button style={buttonStyle} onClick={() => setUsername('HELLO')}>
          Set 'HELLO' (converts to lowercase)
        </button>
        <button style={buttonStyle} onClick={() => setUsername('Alice_2024')}>
          Set 'Alice_2024' (converts to lowercase)
        </button>
        <button style={buttonStyle} onClick={() => setUsername('ab')}>
          Set 'ab' (too short)
        </button>
        <button style={clearButtonStyle} onClick={() => setUsername(undefined)}>
          Clear
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Uppercase string (min: 2, max: 30)</h3>
        <p>Display Name: {displayValue(displayName)}</p>
        <button style={buttonStyle} onClick={() => setDisplayName('hello world')}>
          Set 'hello world' (converts to uppercase)
        </button>
        <button style={buttonStyle} onClick={() => setDisplayName('admin')}>
          Set 'admin' (converts to uppercase)
        </button>
        <button style={buttonStyle} onClick={() => setDisplayName('a')}>
          Set 'a' (too short)
        </button>
        <button style={clearButtonStyle} onClick={() => setDisplayName(undefined)}>
          Clear
        </button>
      </div>

      <div style={minorSeparatorStyle}>String Validations</div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Email validation (default: 'user@example.com')</h3>
        <p>Email: {displayValue(email)}</p>
        <button style={buttonStyle} onClick={() => setEmail('test@domain.com')}>
          Set 'test@domain.com' (valid)
        </button>
        <button style={buttonStyle} onClick={() => setEmail('invalid-email')}>
          Set 'invalid-email' (invalid)
        </button>
        <button style={buttonStyle} onClick={() => setEmail('user@test.org')}>
          Set 'user@test.org' (valid)
        </button>
        <button style={clearButtonStyle} onClick={() => setEmail(undefined)}>
          Clear
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>URL validation</h3>
        <p>Website: {displayValue(website)}</p>
        <button style={buttonStyle} onClick={() => setWebsite('https://example.com')}>
          Set 'https://example.com' (valid)
        </button>
        <button style={buttonStyle} onClick={() => setWebsite('not-a-url')}>
          Set 'not-a-url' (invalid)
        </button>
        <button style={buttonStyle} onClick={() => setWebsite('http://localhost:3000')}>
          Set 'http://localhost:3000' (valid)
        </button>
        <button style={clearButtonStyle} onClick={() => setWebsite(undefined)}>
          Clear
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>UUID validation</h3>
        <p>User ID: {displayValue(userId)}</p>
        <button style={buttonStyle} onClick={() => setUserId('550e8400-e29b-41d4-a716-446655440000')}>
          Set valid UUID
        </button>
        <button style={buttonStyle} onClick={() => setUserId('invalid-uuid')}>
          Set 'invalid-uuid' (invalid)
        </button>
        <button style={buttonStyle} onClick={() => setUserId('123e4567-e89b-12d3-a456-426614174000')}>
          Set another valid UUID
        </button>
        <button style={clearButtonStyle} onClick={() => setUserId(undefined)}>
          Clear
        </button>
      </div>
      
      <div style={minorSeparatorStyle}>Number Parameters</div>
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
      
      <div style={minorSeparatorStyle}>Boolean Parameters</div>
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
      
      <div style={majorSeparatorStyle}>🔢 Array Types</div>
      
      <div style={minorSeparatorStyle}>String Arrays</div>
      <div style={{ marginBottom: '20px' }}>
        <h3>String array with constraints (min: 1, max: 3, default: ['react', 'typescript'])</h3>
        <p>Tags: {displayValue(tags.join(', '))}</p>
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
      
      <div style={minorSeparatorStyle}>Number Arrays</div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Number array with constraints (min: 2, max: 4, values: 0-100, default: [85, 92])</h3>
        <p>Scores: {displayValue(scores.join(', '))}</p>
        <button style={buttonStyle} onClick={() => setScores([75])}>
          Set [75] (too few items)
        </button>
        <button style={buttonStyle} onClick={() => setScores([60, 70, 80, 90, 95])}>
          Set 5 items (will truncate to 4)
        </button>
        <button style={buttonStyle} onClick={() => setScores([-10, 150, 75])}>
          Set [-10, 150, 75] (clamps to [0, 100, 75])
        </button>
        <button style={buttonStyle} onClick={() => setScores([88, 94, 91])}>
          Set [88, 94, 91] (valid)
        </button>
        <button style={clearButtonStyle} onClick={() => setScores(undefined)}>
          Clear
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Simple number array (no constraints)</h3>
        <p>Ratings: {displayValue(Array.isArray(ratings) ? ratings.join(', ') : ratings)}</p>
        <button style={buttonStyle} onClick={() => setRatings([1, 2, 3])}>
          Set [1, 2, 3]
        </button>
        <button style={buttonStyle} onClick={() => setRatings([4.5, 3.8, 2.1])}>
          Set [4.5, 3.8, 2.1]
        </button>
        <button style={clearButtonStyle} onClick={() => setRatings(undefined)}>
          Clear
        </button>
      </div>
      
      <div style={minorSeparatorStyle}>Boolean Arrays</div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Boolean array with constraints (min: 1, max: 3, default: [true, false])</h3>
        <p>Features: {displayValue(features.join(', '))}</p>
        <button style={buttonStyle} onClick={() => setFeatures([])}>
          Set [] (too few)
        </button>
        <button style={buttonStyle} onClick={() => setFeatures([true, false, true, false])}>
          Set 4 items (will truncate to 3)
        </button>
        <button style={buttonStyle} onClick={() => setFeatures([false, true])}>
          Set [false, true] (valid)
        </button>
        <button style={clearButtonStyle} onClick={() => setFeatures(undefined)}>
          Clear
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Simple boolean array (no constraints)</h3>
        <p>Flags: {displayValue(Array.isArray(flags) ? flags.join(', ') : flags)}</p>
        <button style={buttonStyle} onClick={() => setFlags([true, true, false])}>
          Set [true, true, false]
        </button>
        <button style={buttonStyle} onClick={() => setFlags([false])}>
          Set [false]
        </button>
        <button style={clearButtonStyle} onClick={() => setFlags(undefined)}>
          Clear
        </button>
      </div>
      
      <div style={majorSeparatorStyle}>🎯 Tuple Types</div>
      
      <div style={minorSeparatorStyle}>String Tuples</div>
      <div style={{ marginBottom: '20px' }}>
        <h3>String tuple (exactly 2 strings, min 2 chars each) - Full Name</h3>
        <p>Full Name: {displayValue(Array.isArray(fullName) ? fullName.join(', ') : fullName)}</p>
        <button style={buttonStyle} onClick={() => setFullName(['John', 'Doe'])}>
          Set ['John', 'Doe'] (valid)
        </button>
        <button style={buttonStyle} onClick={() => setFullName(['A', 'Smith'])}>
          Set ['A', 'Smith'] (first too short)
        </button>
        {/* TypeScript prevents this: setFullName(['Jane']) - wrong tuple length */}
        <button style={clearButtonStyle} onClick={() => setFullName(undefined)}>
          Clear
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>String tuple with default (exactly 2 strings, min 2 chars each, default: ['Default', 'User'])</h3>
        <p>Default Name: {displayValue(Array.isArray(defaultName) ? defaultName.join(', ') : defaultName)}</p>
        <button style={buttonStyle} onClick={() => setDefaultName(['Admin', 'User'])}>
          Set ['Admin', 'User'] (valid)
        </button>
        <button style={buttonStyle} onClick={() => setDefaultName(['A', 'Test'])}>
          Set ['A', 'Test'] (first too short)
        </button>
        <button style={clearButtonStyle} onClick={() => setDefaultName(undefined)}>
          Clear (revert to default)
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