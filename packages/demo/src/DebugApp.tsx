import React from 'react'
import { useQueryState, queryState } from 'querystate/src'

function DebugApp() {
  console.log('queryState object:', queryState)
  
  const stringBuilder = queryState.string()
  console.log('string builder:', stringBuilder)
  
  const schema = {
    category: queryState.string(),
  }
  console.log('schema:', schema)
  
  const result = useQueryState(schema)
  console.log('useQueryState result:', result)
  console.log('setCategory type:', typeof result.setCategory)
  console.log('setCategory function:', result.setCategory)
  
  const handleClick = () => {
    console.log('Button clicked!')
    console.log('About to call setCategory with "test"')
    try {
      result.setCategory('test')
      console.log('setCategory called successfully')
    } catch (error) {
      console.error('Error calling setCategory:', error)
    }
  }
  
  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>Debug QueryState</h1>
      <p>Category: {result.category ?? 'undefined'}</p>
      <button 
        onClick={handleClick}
        style={{ 
          background: '#1890ff', 
          color: 'white', 
          border: 'none', 
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Set Category to 'test'
      </button>
      <p>Check console for debug logs</p>
      <p>Current URL: {window.location.search || '(empty)'}</p>
    </div>
  )
}

export default DebugApp