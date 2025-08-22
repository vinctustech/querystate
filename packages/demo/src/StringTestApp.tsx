import {
  Select,
  Card,
  Space,
  Typography,
  Alert,
  Button,
  Input,
  Tag,
} from 'antd'
import { useQueryState, queryState } from 'querystate/src'
import { useState } from 'react'

const { Title, Text, Paragraph } = Typography

function StringTestApp() {
  // Test string functionality only
  const {
    // Single string parameters
    category,
    setCategory,
    username,
    setUsername,
    email,
    setEmail,
    
    // String arrays
    tags,
    setTags,
    
    // String tuples
    address,
    setAddress,
    
    // String sets
    categories,
    setCategories,
  } = useQueryState({
    // Single strings
    category: queryState.string(),
    username: queryState.string().min(3).max(20).lowercase(),
    email: queryState.string().email().default('user@example.com'),
    
    // String arrays
    tags: queryState.string()
      .min(2)          // Each tag >= 2 chars
      .max(20)         // Each tag <= 20 chars
      .lowercase()
      .array()
      .min(1)          // At least 1 tag
      .max(5),         // At most 5 tags
    
    // String tuple (address: street, city, state, zip)
    address: queryState.string()
      .tuple(4)
      .default(['', '', '', '']),
    
    // String set (unique categories)
    categories: queryState.string()
      .set()
      .min(1)          // At least 1 category
      .max(10),        // At most 10 categories
  })

  // Test log
  const [testLog, setTestLog] = useState<string[]>([])

  const logAction = (action: string, value: any) => {
    const time = new Date().toLocaleTimeString()
    setTestLog(prev => [`${time}: ${action}(${JSON.stringify(value)})`, ...prev.slice(0, 9)])
  }

  // Test helpers
  const testSetCategory = (value: string | undefined) => {
    setCategory(value)
    logAction('setCategory', value)
  }

  const testSetUsername = (value: string | undefined) => {
    setUsername(value)
    logAction('setUsername', value)
  }

  const testSetEmail = (value: string | undefined) => {
    setEmail(value)
    logAction('setEmail', value)
  }

  const testSetTags = (value: string[] | undefined) => {
    setTags(value)
    logAction('setTags', value)
  }

  const testSetAddress = (value: [string, string, string, string] | undefined) => {
    setAddress(value)
    logAction('setAddress', value)
  }

  const testSetCategories = (value: string[] | undefined) => {
    setCategories(value)
    logAction('setCategories', value)
  }

  return (
    <Card title="String Parameter Testing">
      <Alert
        message="Testing String Parameters Only"
        description="This demo tests the refactored library with string parameters: single, arrays, tuples, and sets."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Single String Parameters */}
        <Title level={3}>Single String Parameters</Title>
        
        <div>
          <Title level={4}>Category (Basic String)</Title>
          <Select
            placeholder="Select a category"
            allowClear
            style={{ width: 300 }}
            value={category}
            onChange={testSetCategory}
            options={[
              { value: 'electronics', label: 'Electronics' },
              { value: 'books', label: 'Books' },
              { value: 'clothing', label: 'Clothing' },
            ]}
          />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            No constraints, no default - can be undefined
          </Text>
          <Text>Current: {category ?? '(none)'}</Text>
        </div>

        <div>
          <Title level={4}>Username (with constraints)</Title>
          <Input
            placeholder="Enter username (3-20 chars, lowercase)"
            value={username ?? ''}
            onChange={e => testSetUsername(e.target.value || undefined)}
            style={{ width: 300 }}
          />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Min 3 chars, max 20 chars, auto-lowercase
          </Text>
          <Text>Current: {username ?? '(none)'}</Text>
        </div>

        <div>
          <Title level={4}>Email (with validation & default)</Title>
          <Input
            placeholder="Enter email"
            value={email}
            onChange={e => testSetEmail(e.target.value)}
            style={{ width: 300 }}
          />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Email validation, has default value
          </Text>
          <Text>Current: {email}</Text>
        </div>

        {/* String Arrays */}
        <Title level={3}>String Arrays</Title>
        
        <div>
          <Title level={4}>Tags (constrained array)</Title>
          <Select
            mode="multiple"
            placeholder="Select tags (2-20 chars each, lowercase, 1-5 total)"
            allowClear
            style={{ width: 400 }}
            value={tags}
            onChange={testSetTags}
            options={[
              { value: 'react', label: 'React' },
              { value: 'typescript', label: 'TypeScript' },
              { value: 'javascript', label: 'JavaScript' },
              { value: 'nodejs', label: 'Node.js' },
              { value: 'frontend', label: 'Frontend' },
              { value: 'backend', label: 'Backend' },
            ]}
          />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Each tag: 2-20 chars, lowercase. Array: 1-5 items
          </Text>
          <Text>Current: {JSON.stringify(tags)}</Text>
        </div>

        {/* String Tuples */}
        <Title level={3}>String Tuples</Title>
        
        <div>
          <Title level={4}>Address (4-tuple)</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              placeholder="Street"
              value={address[0]}
              onChange={e => testSetAddress([e.target.value, address[1], address[2], address[3]])}
              style={{ width: 300 }}
            />
            <Input
              placeholder="City"
              value={address[1]}
              onChange={e => testSetAddress([address[0], e.target.value, address[2], address[3]])}
              style={{ width: 300 }}
            />
            <Input
              placeholder="State"
              value={address[2]}
              onChange={e => testSetAddress([address[0], address[1], e.target.value, address[3]])}
              style={{ width: 300 }}
            />
            <Input
              placeholder="ZIP"
              value={address[3]}
              onChange={e => testSetAddress([address[0], address[1], address[2], e.target.value])}
              style={{ width: 300 }}
            />
          </Space>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Fixed 4-element tuple, always has exactly 4 values
          </Text>
          <Text>Current: {JSON.stringify(address)}</Text>
        </div>

        {/* String Sets */}
        <Title level={3}>String Sets</Title>
        
        <div>
          <Title level={4}>Categories (unique set)</Title>
          <Space wrap>
            {['tech', 'design', 'business', 'marketing', 'development', 'finance'].map(cat => (
              <Tag
                key={cat}
                color={categories.includes(cat) ? 'blue' : 'default'}
                onClick={() => {
                  if (categories.includes(cat)) {
                    testSetCategories(categories.filter(c => c !== cat))
                  } else {
                    testSetCategories([...categories, cat])
                  }
                }}
                style={{ cursor: 'pointer', padding: '5px 10px' }}
              >
                {cat}
              </Tag>
            ))}
          </Space>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Set: unique values only, 1-10 items
          </Text>
          <Text>Current: {JSON.stringify(categories)}</Text>
        </div>

        {/* Testing Panel */}
        <Title level={3}>Testing Panel</Title>
        <Space wrap>
          <Button onClick={() => testSetCategory('electronics')}>
            Set Category: electronics
          </Button>
          <Button onClick={() => testSetUsername('johndoe')}>
            Set Username: johndoe
          </Button>
          <Button onClick={() => testSetEmail('test@example.com')}>
            Set Email: test@example.com
          </Button>
          <Button onClick={() => testSetTags(['react', 'typescript', 'frontend'])}>
            Set Tags
          </Button>
          <Button onClick={() => testSetAddress(['123 Main St', 'Anytown', 'CA', '12345'])}>
            Set Address
          </Button>
          <Button onClick={() => testSetCategories(['tech', 'design'])}>
            Set Categories
          </Button>
        </Space>

        {/* Test Log */}
        <div>
          <Title level={4}>Action Log</Title>
          <div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid #ccc', padding: '8px' }}>
            {testLog.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {testLog.map((entry, index) => (
                  <li key={index} style={{ marginBottom: '4px', fontFamily: 'monospace' }}>
                    {entry}
                  </li>
                ))}
              </ul>
            ) : (
              <Text type="secondary">No actions logged yet</Text>
            )}
          </div>
        </div>

        {/* URL Display */}
        <div>
          <Title level={4}>Current URL Parameters:</Title>
          <pre style={{ background: '#f5f5f5', padding: '10px' }}>
            {window.location.search || '(none)'}
          </pre>
        </div>
      </Space>
    </Card>
  )
}

export default StringTestApp