import React from 'react'
import { simpleQueryState, useSimpleQueryState } from 'querystate/src/simple'

function SimpleLibraryTest() {
  const schema = {
    test: simpleQueryState.string()
  }
  
  const { test, setTest } = useSimpleQueryState(schema)
  
  const handleClick = () => {
    setTest('hello')
  }
  
  const handleClear = () => {
    setTest(undefined)
  }
  
  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>Simple Library Test</h1>
      <p>Value: {test ?? 'undefined'}</p>
      <button 
        onClick={handleClick}
        style={{ 
          background: '#1890ff', 
          color: 'white', 
          border: 'none', 
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Set to 'hello'
      </button>
      <button 
        onClick={handleClear}
        style={{ 
          background: '#ff4d4f', 
          color: 'white', 
          border: 'none', 
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px',
          marginLeft: '10px'
        }}
      >
        Clear URL
      </button>
      <p>URL: {window.location.search || '(empty)'}</p>
    </div>
  )
}

export default SimpleLibraryTest