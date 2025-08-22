import React from 'react'
import { simpleQueryState, useSimpleQueryState } from 'querystate/src/simple'

function ComprehensiveTest() {
  const schema = {
    // String with constraints
    name: simpleQueryState.string().min(2).max(10).default('John'),
    
    // Number with constraints  
    age: simpleQueryState.number().min(0).max(120).default(25),
    
    // Simple string without constraints
    category: simpleQueryState.string(),
    
    // Number without constraints
    score: simpleQueryState.number()
  }
  
  const { 
    name, setName, 
    age, setAge, 
    category, setCategory, 
    score, setScore 
  } = useSimpleQueryState(schema)
  
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
  
  return (
    <div style={{ color: 'white', padding: '20px', fontFamily: 'monospace' }}>
      <h1>Comprehensive Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>String with constraints (min: 2, max: 10, default: 'John')</h3>
        <p>Name: {name ?? 'undefined'}</p>
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
        <p>Age: {age ?? 'undefined'}</p>
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
        <p>Category: {category ?? 'undefined'}</p>
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
        <p>Score: {score ?? 'undefined'}</p>
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
      
      <div style={{ marginTop: '30px', padding: '10px', background: '#333', borderRadius: '4px' }}>
        <h3>Current URL:</h3>
        <p style={{ wordBreak: 'break-all' }}>
          {window.location.search || '(empty)'}
        </p>
      </div>
    </div>
  )
}

export default ComprehensiveTest