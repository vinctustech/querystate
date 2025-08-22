import React from 'react'
import { useSearchParams } from 'react-router-dom'

// Minimal test without any library code
function MinimalTest() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const testValue = searchParams.get('test') || ''
  
  const handleClick = () => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('test', 'hello')
    setSearchParams(newParams)
  }
  
  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>Minimal Test - Direct React Router</h1>
      <p>Value: {testValue || 'undefined'}</p>
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
      <p>URL: {window.location.search || '(empty)'}</p>
    </div>
  )
}

export default MinimalTest