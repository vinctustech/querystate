import { qs, useQueryState } from '@vinctus/querystate'

export function DateSingle() {
  const { birthday, setBirthday } = useQueryState({ birthday: qs.date() })
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
  const displayValue = (value: any) =>
    value === undefined ? (
      <span style={{ color: '#888', fontStyle: 'italic' }}>undefined</span>
    ) : (
      <span style={{ color: '#52c41a' }}>{JSON.stringify(value)}</span>
    )

  return (
    <div style={{ color: 'white', padding: '20px', fontFamily: 'monospace' }}>
      <h2>Date - Single Values</h2>
      <div style={{ marginBottom: '30px' }}>
        <h3>Date without default</h3>
        <p>Birthday: {displayValue(birthday)}</p>
        <p>Type: {typeof birthday}</p>
        <button style={buttonStyle} onClick={() => setBirthday(new Date('1990-01-01'))}>
          Set 1990-01-01
        </button>
        <button style={buttonStyle} onClick={() => setBirthday(new Date())}>
          Set Today
        </button>
        <button style={buttonStyle} onClick={() => setBirthday(undefined)}>
          Clear
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
          <strong>birthday:</strong> {typeof birthday} (should be object | undefined, instanceof
          Date: {birthday instanceof Date ? 'true' : 'false'})
        </p>
      </div>
    </div>
  )
}
