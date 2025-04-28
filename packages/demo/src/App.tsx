import {
  Select,
  Card,
  Space,
  Divider,
  Typography,
  Alert,
  InputNumber,
  Slider,
  Badge,
  Row,
  Col,
  Button,
} from 'antd'
import { useQueryState, queryState as qs } from 'querystate/src/useQueryState'
import { useState } from 'react'

const { Title, Text, Paragraph } = Typography

function App() {
  // Destructure everything to make it explicit for demo/testing
  const {
    // String parameters
    category,
    setCategory,
    tags,
    setTags,
    status,
    setStatus,
    priority,
    setPriority,
    // Number parameters
    page,
    setPage,
    limit,
    setLimit,
    // Number arrays (variable length)
    scores,
    setScores,
    productIds,
    setProductIds,
    // Number tuples (fixed length with enforced length)
    priceRange,
    setPriceRange,
    coordinates,
    setCoordinates,
    rgbColor,
    setRgbColor,
  } = useQueryState({
    // String parameters
    category: qs.string(),
    tags: qs.string().array(),
    status: qs.string().default('active'),
    priority: qs.string().array().default(['medium']),
    // Number parameters
    page: qs.number().default(1),
    limit: qs.number().default(10),
    // Number arrays (variable length)
    scores: qs.number().array(),
    productIds: qs.number().array(),
    // Number tuples (fixed length with enforced length)
    priceRange: qs.number().tuple(2).default([0, 100]),
    coordinates: qs.number().tuple(2).default([0, 0]),
    rgbColor: qs.number().tuple(3).default([128, 128, 128]),
  })

  // Log setter usage for testing
  const [testLog, setTestLog] = useState<string[]>([])

  // Helper function to log setter usage with timestamp
  const logSetterUsage = (setterName: string, value: any) => {
    const time = new Date().toLocaleTimeString()
    setTestLog((prev) => [`${time}: ${setterName}(${JSON.stringify(value)})`, ...prev.slice(0, 9)])
  }

  // Test helpers for each setter
  const testSetCategory = (value: string | undefined) => {
    setCategory(value)
    logSetterUsage('setCategory', value)
  }

  const testSetTags = (value: string[] | undefined) => {
    setTags(value)
    logSetterUsage('setTags', value)
  }

  const testSetStatus = (value: string | undefined) => {
    setStatus(value)
    logSetterUsage('setStatus', value)
  }

  const testSetPriority = (value: string[] | undefined) => {
    setPriority(value)
    logSetterUsage('setPriority', value)
  }

  const testSetPage = (value: number | undefined) => {
    setPage(value)
    logSetterUsage('setPage', value)
  }

  const testSetLimit = (value: number | undefined) => {
    setLimit(value)
    logSetterUsage('setLimit', value)
  }

  const testSetScores = (value: number[] | undefined) => {
    setScores(value)
    logSetterUsage('setScores', value)
  }

  const testSetProductIds = (value: number[] | undefined) => {
    setProductIds(value)
    logSetterUsage('setProductIds', value)
  }

  const testSetPriceRange = (value: [number, number] | undefined) => {
    setPriceRange(value)
    logSetterUsage('setPriceRange', value)
  }

  const testSetCoordinates = (value: [number, number] | undefined) => {
    setCoordinates(value)
    logSetterUsage('setCoordinates', value)
  }

  const testSetRgbColor = (value: [number, number, number] | undefined) => {
    setRgbColor(value)
    logSetterUsage('setRgbColor', value)
  }

  // Helper to display tuple values with labels
  const formatCoordinates = (coords: number[]) => {
    return `X: ${coords[0]}, Y: ${coords[1]}`
  }

  // Helper to format RGB color
  const formatRGB = (rgb: number[]) => {
    return `RGB(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
  }

  // Style for the color preview
  const colorPreviewStyle = {
    width: '50px',
    height: '50px',
    backgroundColor: `rgb(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]})`,
    border: '1px solid #999',
    display: 'inline-block',
    marginLeft: '10px',
  }

  return (
    <Card title="URL Query Parameters Demo">
      <Alert
        message="Enhanced QueryState with Tuple Support"
        description="This demo showcases the difference between variable-length arrays and fixed-length tuples. Note how tuples always maintain their length even when manipulated in the URL."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {/* Testing Panel */}
      <Card title="Testing Panel" style={{ marginBottom: 16 }}>
        <Alert
          message="Test All Setters"
          description="This panel ensures that all setters are properly exported and can be tested explicitly."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space wrap>
            <Button onClick={() => testSetCategory('123e4567-e89b-12d3-a456-426614174000')}>
              Test setCategory
            </Button>
            <Button
              onClick={() =>
                testSetTags([
                  '523e4567-e89b-12d3-a456-426614174004',
                  '623e4567-e89b-12d3-a456-426614174005',
                ])
              }
            >
              Test setTags
            </Button>
            <Button onClick={() => testSetStatus('pending')}>Test setStatus</Button>
            <Button onClick={() => testSetPriority(['high', 'critical'])}>Test setPriority</Button>
            <Button onClick={() => testSetPage(3)}>Test setPage</Button>
            <Button onClick={() => testSetLimit(25)}>Test setLimit</Button>
            <Button onClick={() => testSetScores([2, 4, 6, 8])}>Test setScores</Button>
            <Button onClick={() => testSetProductIds([1001, 1003, 1005])}>
              Test setProductIds
            </Button>
            <Button onClick={() => testSetPriceRange([250, 750])}>Test setPriceRange</Button>
            <Button onClick={() => testSetCoordinates([42, 84])}>Test setCoordinates</Button>
            <Button onClick={() => testSetRgbColor([255, 0, 0])}>Test setRgbColor (Red)</Button>
          </Space>

          <Divider orientation="left">Test Log (last 10 operations)</Divider>
          <div
            style={{
              maxHeight: '200px',
              overflow: 'auto',
              border: '1px solid #ccc',
              padding: '8px',
            }}
          >
            {testLog.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {testLog.map((entry, index) => (
                  <li key={index} style={{ marginBottom: '4px', fontFamily: 'monospace' }}>
                    {entry}
                  </li>
                ))}
              </ul>
            ) : (
              <Text type="secondary">No setter calls logged yet</Text>
            )}
          </div>
        </Space>
      </Card>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* String Parameters Section */}
        <Title level={3}>String Parameters</Title>

        <div>
          <Title level={4}>Single Select (Category)</Title>
          <Select
            placeholder="Select a category"
            allowClear
            style={{ width: 300 }}
            value={category}
            onChange={(value) => testSetCategory(value)}
            options={[
              { value: '123e4567-e89b-12d3-a456-426614174000', label: 'Electronics' },
              { value: '223e4567-e89b-12d3-a456-426614174001', label: 'Books' },
              { value: '323e4567-e89b-12d3-a456-426614174002', label: 'Clothing' },
              { value: '423e4567-e89b-12d3-a456-426614174003', label: 'Home & Garden' },
            ]}
          />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            No default value - will be removed from URL when cleared
          </Text>
        </div>
        <Divider />
        <div>
          <Title level={4}>Multi-Select (Tags)</Title>
          <Select
            mode="multiple"
            placeholder="Select tags"
            allowClear
            style={{ width: 300 }}
            value={tags}
            onChange={(values) => testSetTags(values)}
            options={[
              { value: '523e4567-e89b-12d3-a456-426614174004', label: 'New' },
              { value: '623e4567-e89b-12d3-a456-426614174005', label: 'Sale' },
              { value: '723e4567-e89b-12d3-a456-426614174006', label: 'Featured' },
              { value: '823e4567-e89b-12d3-a456-426614174007', label: 'Exclusive' },
            ]}
          />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            No default value - will be removed from URL when cleared
          </Text>
        </div>
        <Divider />
        <div>
          <Title level={4}>Single Select with Default (Status)</Title>
          <Select
            placeholder="Select status"
            allowClear
            style={{ width: 300 }}
            value={status}
            onChange={(value) => testSetStatus(value)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Default value: "active" - will revert to this value when cleared
          </Text>
        </div>
        <Divider />
        <div>
          <Title level={4}>Multi-Select with Default (Priority)</Title>
          <Select
            mode="multiple"
            placeholder="Select priority levels"
            allowClear
            style={{ width: 300 }}
            value={priority}
            onChange={(values) => testSetPriority(values)}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'critical', label: 'Critical' },
            ]}
          />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Default value: ["medium"] - will revert to this value when cleared
          </Text>
        </div>

        {/* Number Parameters Section */}
        <Divider style={{ borderWidth: 2 }} />
        <Title level={3}>Number Parameters</Title>

        <div>
          <Title level={4}>Single Number (Page)</Title>
          <Space>
            <InputNumber
              min={1}
              max={100}
              value={page}
              onChange={(value) => testSetPage(value !== null ? value : undefined)}
            />
            <Badge count={page} color="blue" />
          </Space>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Default value: 1 - will revert to this value when cleared
          </Text>
        </div>
        <Divider />
        <div>
          <Title level={4}>Single Number (Items per Page)</Title>
          <Space direction="vertical" style={{ width: 300 }}>
            <InputNumber
              min={5}
              max={100}
              step={5}
              value={limit}
              onChange={(value) => testSetLimit(value !== null ? value : undefined)}
              style={{ width: 120 }}
            />
            <Text>Show {limit} items per page</Text>
          </Space>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Default value: 10 - will revert to this value when cleared
          </Text>
        </div>

        {/* Number Arrays Section */}
        <Divider style={{ borderWidth: 2 }} />
        <Title level={3}>Number Arrays (Variable Length)</Title>
        <Alert
          message="Array Parameters"
          description="Arrays can have any number of values, and will be empty if all values are removed from the URL."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <div>
          <Title level={4}>Number Array (Scores)</Title>
          <Space wrap>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
              <Badge
                key={score}
                count={score}
                style={{ backgroundColor: scores.includes(score) ? '#1890ff' : '#d9d9d9' }}
                onClick={() => {
                  if (scores.includes(score)) {
                    testSetScores(scores.filter((s) => s !== score))
                  } else {
                    testSetScores([...scores, score])
                  }
                }}
              />
            ))}
          </Space>
          <Paragraph style={{ marginTop: 8 }}>
            Selected scores: {scores.length > 0 ? scores.join(', ') : '(none)'}
          </Paragraph>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Variable-length array - can have any number of items (including zero)
          </Text>
        </div>
        <Divider />
        <div>
          <Title level={4}>Number Array (Product IDs)</Title>
          <Select
            mode="multiple"
            placeholder="Select product IDs"
            allowClear
            style={{ width: 300 }}
            value={productIds}
            onChange={(values) => testSetProductIds(values)}
            options={[
              { value: 1001, label: 'Product #1001' },
              { value: 1002, label: 'Product #1002' },
              { value: 1003, label: 'Product #1003' },
              { value: 1004, label: 'Product #1004' },
              { value: 1005, label: 'Product #1005' },
            ]}
          />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Variable-length array - no default value, will be removed from URL when cleared
          </Text>
        </div>

        {/* Number Tuples Section */}
        <Divider style={{ borderWidth: 2 }} />
        <Title level={3}>Number Tuples (Fixed Length)</Title>
        <Alert
          message="Tuple Parameters"
          description="Tuples are fixed-length arrays that always maintain their structure. If the URL is manually edited to remove some values, they'll be restored with defaults."
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <div>
          <Title level={4}>Price Range (2-Tuple for slider)</Title>
          <Space direction="vertical" style={{ width: 300 }}>
            <Slider
              range
              min={0}
              max={1000}
              value={priceRange as [number, number]}
              onChange={(values) => testSetPriceRange(values as [number, number])}
            />
            <Text>
              Price: ${priceRange[0]} to ${priceRange[1]}
            </Text>
          </Space>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            2-Tuple with default [0, 100] - always has exactly 2 elements, even if URL is edited
          </Text>
        </div>
        <Divider />
        <div>
          <Title level={4}>Coordinates (2-Tuple)</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Space direction="vertical">
                <Text>X Coordinate:</Text>
                <InputNumber
                  value={coordinates[0]}
                  onChange={(value) => {
                    if (value !== null) {
                      const newCoords = [...coordinates]
                      newCoords[0] = value
                      testSetCoordinates(newCoords as [number, number])
                    }
                  }}
                />
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical">
                <Text>Y Coordinate:</Text>
                <InputNumber
                  value={coordinates[1]}
                  onChange={(value) => {
                    if (value !== null) {
                      const newCoords = [...coordinates]
                      newCoords[1] = value
                      testSetCoordinates(newCoords as [number, number])
                    }
                  }}
                />
              </Space>
            </Col>
          </Row>
          <Text style={{ marginTop: 8 }}>{formatCoordinates(coordinates)}</Text>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            2-Tuple with default [0, 0] - always has exactly 2 elements
          </Text>
        </div>
        <Divider />
        <div>
          <Title level={4}>RGB Color (3-Tuple)</Title>
          <Row gutter={16}>
            <Col span={18}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>Red:</Text>
                <Slider
                  min={0}
                  max={255}
                  value={rgbColor[0]}
                  onChange={(value) => {
                    const newColor = [...rgbColor]
                    newColor[0] = value
                    testSetRgbColor(newColor as [number, number, number])
                  }}
                />
                <Text>Green:</Text>
                <Slider
                  min={0}
                  max={255}
                  value={rgbColor[1]}
                  onChange={(value) => {
                    const newColor = [...rgbColor]
                    newColor[1] = value
                    testSetRgbColor(newColor as [number, number, number])
                  }}
                />
                <Text>Blue:</Text>
                <Slider
                  min={0}
                  max={255}
                  value={rgbColor[2]}
                  onChange={(value) => {
                    const newColor = [...rgbColor]
                    newColor[2] = value
                    testSetRgbColor(newColor as [number, number, number])
                  }}
                />
              </Space>
            </Col>
            <Col span={6}>
              <div style={colorPreviewStyle}></div>
              <Text style={{ display: 'block', marginTop: 8 }}>{formatRGB(rgbColor)}</Text>
            </Col>
          </Row>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            3-Tuple with default [128, 128, 128] - always has exactly 3 elements
          </Text>
        </div>

        {/* URL and Values Display */}
        <Divider style={{ borderWidth: 2 }} />
        <div>
          <Title level={4}>Current URL Parameters:</Title>
          <pre>{window.location.search}</pre>
          <Alert
            message="Try this experiment"
            description="Try manually removing some values from the tuples in the URL (e.g., delete one of the priceRange values). Notice how they are automatically restored because tuples always maintain their full structure."
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        </div>
        <div>
          <Title level={4}>Parameter Values:</Title>
          <Space direction="vertical">
            <Title level={5}>String Parameters</Title>
            <Text>Category: {category ?? '(none)'}</Text>
            <Text>Tags: {tags.length > 0 ? JSON.stringify(tags) : '(none)'}</Text>
            <Text>Status: {status ?? '(none)'}</Text>
            <Text>Priority: {priority.length > 0 ? JSON.stringify(priority) : '(none)'}</Text>

            <Title level={5}>Number Parameters</Title>
            <Text>Page: {page !== undefined ? page : '(none)'}</Text>
            <Text>Limit: {limit !== undefined ? limit : '(none)'}</Text>

            <Title level={5}>Number Arrays (Variable Length)</Title>
            <Text>Scores: {scores.length > 0 ? JSON.stringify(scores) : '(none)'}</Text>
            <Text>
              Product IDs: {productIds.length > 0 ? JSON.stringify(productIds) : '(none)'}
            </Text>

            <Title level={5}>Number Tuples (Fixed Length)</Title>
            <Text>Price Range: {JSON.stringify(priceRange)}</Text>
            <Text>Coordinates: {JSON.stringify(coordinates)}</Text>
            <Text>RGB Color: {JSON.stringify(rgbColor)}</Text>
          </Space>
        </div>
      </Space>
    </Card>
  )
}

export default App
