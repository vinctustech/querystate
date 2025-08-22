import React, { useState, useEffect, useRef } from 'react'
import { queryState, useQueryState } from 'querystate/src'

function SimpleDebugApp() {
  const [debugOutput, setDebugOutput] = useState<string[]>([])
  const hasInitialized = useRef(false)
  
  const log = (message: string, obj?: any) => {
    const logLine = obj ? `${message}: ${JSON.stringify(obj, null, 2)}` : message
    console.log(logLine)
    setDebugOutput(prev => [...prev, logLine])
  }

  // Test hook usage (this needs to be at top level)
  let result: any = {}
  let hookError = null
  try {
    const builder = queryState.string()
    const schema = { test: builder }
    result = useQueryState(schema)
  } catch (error) {
    hookError = error
  }

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true
    
    log('=== SIMPLE DEBUG START ===')
    
    try {
      log('1. Import successful')
      log('queryState', queryState)
      
      // Test builder creation
      const builder = queryState.string()
      log('2. Builder created', builder)
      log('Builder type', builder.type)
      log('Builder keys', Object.keys(builder))
      
      // Test schema creation
      const schema = { test: builder }
      log('3. Schema', schema)
      log('Schema test type', schema.test.type)
      
      if (hookError) {
        log('Error in hook', hookError.message)
      } else {
        log('4. Hook result', result)
        log('Result keys', Object.keys(result))
        log('test value', result.test)
        log('setTest type', typeof result.setTest)
      }
      
    } catch (error) {
      log('Error during setup', error.message)
    }
  }, [])

  const testSetter = () => {
    try {
      log('5. About to call setTest')
      log('URL before:', window.location.search)
      result.setTest('hello')
      log('6. setTest called successfully')
      
      // Wait a moment then check URL again
      setTimeout(() => {
        log('URL after (delayed):', window.location.search)
      }, 100)
    } catch (error) {
      log('Error calling setTest', error.message)
    }
  }

  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>Simple Debug</h1>
      <p>Value: {result.test ?? 'undefined'}</p>
      <button 
        onClick={testSetter}
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
      
      <h2>Debug Output:</h2>
      <textarea
        value={debugOutput.join('\n')}
        readOnly
        style={{
          width: '100%',
          height: '400px',
          fontFamily: 'monospace',
          fontSize: '12px',
          background: '#2d2d2d',
          color: 'white',
          border: '1px solid #555',
          padding: '10px'
        }}
      />
      
      <button
        onClick={() => setDebugOutput([])}
        style={{
          background: '#666',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          marginTop: '10px',
          cursor: 'pointer'
        }}
      >
        Clear Debug Output
      </button>
    </div>
  )
}

export default SimpleDebugApp