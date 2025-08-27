import { qs, useQueryState } from '@vinctus/querystate'
import { Select } from 'antd'

export function AntdIntegration() {
  const {
    categories,
    setCategories,
    tags,
    setTags,
    emptyDriverIds,
    setEmptyDriverIds,
    priorities,
    setPriorities,
  } = useQueryState({
    categories: qs.string().array(),
    tags: qs.string().array().min(1).max(3).default(['react', 'typescript']),
    emptyDriverIds: qs.string().array(),
    priorities: qs.number().array().default([1, 2]),
  })

  const displayValue = (value: any) => {
    if (value === undefined) {
      return <span style={{ color: '#888', fontStyle: 'italic' }}>undefined</span>
    }
    if (Array.isArray(value) && value.length === 0) {
      return <span style={{ color: '#888', fontStyle: 'italic' }}>(empty array)</span>
    }
    return <span style={{ color: '#52c41a' }}>{JSON.stringify(value)}</span>
  }

  return (
    <div style={{ color: 'white', padding: '20px', fontFamily: 'monospace' }}>
      <h2>Ant Design - Integration</h2>

      <div style={{ marginBottom: '30px' }}>
        <h3>Select (multiple) with array without default</h3>
        <p>Categories: {displayValue(categories.join(', ') || '(empty array)')}</p>
        <Select
          mode="multiple"
          style={{ width: '100%', marginBottom: '10px' }}
          placeholder="Select categories"
          value={categories} // Arrays are never undefined
          onChange={(value) => setCategories(value.length > 0 ? value : undefined)}
          options={[
            { label: 'Technology', value: 'tech' },
            { label: 'Design', value: 'design' },
            { label: 'Food', value: 'food' },
            { label: 'Travel', value: 'travel' },
          ]}
        />
        <p style={{ fontSize: '12px', color: '#888' }}>
          Arrays are never undefined - no need for fallbacks
        </p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Select (multiple) with string array with default</h3>
        <p>Tags: {displayValue(tags.join(', '))}</p>
        <Select
          mode="multiple"
          style={{ width: '100%', marginBottom: '10px' }}
          placeholder="Select tags"
          value={tags} // No need for || since it has defaults
          onChange={(value) => {
            setTags(value)
          }}
          options={[
            { label: 'React', value: 'react' },
            { label: 'TypeScript', value: 'typescript' },
            { label: 'Vue', value: 'vue' },
            { label: 'Angular', value: 'angular' },
          ]}
        />
        <p style={{ fontSize: '12px', color: '#888' }}>
          Arrays with defaults never return undefined
        </p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Select (multiple) with string array (natural empty default)</h3>
        <p>Empty Driver IDs: {displayValue(emptyDriverIds.join(', ') || '(empty array)')}</p>
        <Select
          mode="multiple"
          style={{ width: '100%', marginBottom: '10px' }}
          placeholder="Select driver IDs"
          value={emptyDriverIds} // Arrays are never undefined
          onChange={(value) => setEmptyDriverIds(value.length > 0 ? value : undefined)}
          options={[
            { label: 'Driver 001', value: 'driver-001' },
            { label: 'Driver 002', value: 'driver-002' },
            { label: 'Driver 003', value: 'driver-003' },
            { label: 'Admin User', value: 'admin' },
          ]}
        />
        <p style={{ fontSize: '12px', color: '#888' }}>
          Arrays naturally default to empty - clean URLs when empty
        </p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Select (multiple) with number array and default</h3>
        <p>Priorities: {displayValue(priorities.join(', '))}</p>
        <Select
          mode="multiple"
          style={{ width: '100%', marginBottom: '10px' }}
          placeholder="Select priorities"
          value={priorities} // Never undefined due to default
          onChange={(value) => {
            setPriorities(value)
          }}
          options={[
            { label: 'Priority 1 (Highest)', value: 1 },
            { label: 'Priority 2 (High)', value: 2 },
            { label: 'Priority 3 (Medium)', value: 3 },
            { label: 'Priority 4 (Low)', value: 4 },
          ]}
        />
        <p style={{ fontSize: '12px', color: '#888' }}>
          Number arrays work seamlessly with Ant Design
        </p>
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
          <strong>emptyDriverIds:</strong> {typeof emptyDriverIds}, isArray:{' '}
          {Array.isArray(emptyDriverIds).toString()}
        </p>
        <p>
          <strong>Expected:</strong> string[] (never undefined)
        </p>
        <p>
          <strong>priorities:</strong> {typeof priorities}, isArray:{' '}
          {Array.isArray(priorities).toString()}
        </p>
        <p>
          <strong>Expected:</strong> number[] (never undefined due to default)
        </p>
        <p>
          <strong>URL params:</strong> {window.location.search || '(none)'}
        </p>
      </div>
    </div>
  )
}
