import { useState } from 'react'
import { useQueryState, queryState } from 'querystate/src/useQueryState'
import { Card, DatePicker, Space, Typography, Divider, Button, Tag, Alert, Row, Col } from 'antd'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

function DateTestApp() {
  // Use only date parameters
  const {
    // Date parameters (native Date objects)
    simpleDate,
    setSimpleDate,
    defaultDate,
    setDefaultDate,
    dateArray,
    setDateArray,
    dateTuple,
    setDateTuple,

    // Dayjs date parameters
    dayjsDate,
    setDayjsDate,
  } = useQueryState({
    // Native Date objects
    simpleDate: queryState.dateJs(),
    defaultDate: queryState.date().default(new Date()),
    dateArray: queryState.date().array(),
    dateTuple: queryState
      .date()
      .tuple(2)
      .default([new Date(), new Date(new Date().setDate(new Date().getDate() + 7))]),

    // Dayjs objects with different formats
    dayjsDate: queryState.dateDayjs(),
  })

  // Log for showing operations
  const [log, setLog] = useState<string[]>([])
  const addToLog = (message: string) => {
    setLog((prev) => [message, ...prev.slice(0, 9)])
  }

  // Helper to format date for display
  const formatDate = (date: Date | undefined) => {
    return date ? date.toLocaleDateString() + ' ' + date.toLocaleTimeString() : '(none)'
  }

  // Test dates
  const testDates = [
    new Date(2025, 0, 15), // Jan 15, 2025
    new Date(2025, 1, 14), // Feb 14, 2025
    new Date(2025, 2, 17), // Mar 17, 2025
  ]

  return (
    <Card title="QueryState Date Support Test">
      <Alert
        message="Date Parameter Testing"
        description="This minimal app tests only the date functionality of queryState. Check the URL as you interact with the components."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {/* Native Date Parameters */}
      <Title level={3}>Native Date Parameters</Title>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Title level={4}>Simple Date (No Default)</Title>
          <Space direction="vertical">
            <DatePicker
              value={simpleDate ? dayjs(simpleDate) : null}
              onChange={(date) => {
                const newDate = date ? date.toDate() : undefined
                setSimpleDate(newDate)
                addToLog(`Set simpleDate to ${formatDate(newDate)}`)
              }}
            />
            <Text>Current value: {formatDate(simpleDate)}</Text>
            <Button
              onClick={() => {
                setSimpleDate(new Date())
                addToLog(`Set simpleDate to now`)
              }}
            >
              Set to Now
            </Button>
            <Button
              onClick={() => {
                setSimpleDate(undefined)
                addToLog(`Cleared simpleDate`)
              }}
            >
              Clear
            </Button>
          </Space>
        </Col>

        <Col span={12}>
          <Title level={4}>Date with Default</Title>
          <Space direction="vertical">
            <DatePicker
              value={defaultDate ? dayjs(defaultDate) : null}
              onChange={(date) => {
                const newDate = date ? date.toDate() : undefined
                setDefaultDate(newDate)
                addToLog(`Set defaultDate to ${formatDate(newDate)}`)
              }}
            />
            <Text>Current value: {formatDate(defaultDate)}</Text>
            <Text type="secondary">Default is today's date - try clearing and check URL</Text>
            <Button
              onClick={() => {
                setDefaultDate(undefined)
                addToLog(`Cleared defaultDate (should use default)`)
              }}
            >
              Clear (Use Default)
            </Button>
          </Space>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Title level={4}>Date Array</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              {testDates.map((date, i) => (
                <Tag
                  key={i}
                  color={
                    dateArray.some((d) => d.toDateString() === date.toDateString())
                      ? 'blue'
                      : 'default'
                  }
                  style={{ margin: '4px', cursor: 'pointer' }}
                  onClick={() => {
                    if (dateArray.some((d) => d.toDateString() === date.toDateString())) {
                      // Remove date
                      const newDates = dateArray.filter(
                        (d) => d.toDateString() !== date.toDateString(),
                      )
                      setDateArray(newDates)
                      addToLog(`Removed date from dateArray: ${date.toLocaleDateString()}`)
                    } else {
                      // Add date
                      const newDates = [...dateArray, date]
                      setDateArray(newDates)
                      addToLog(`Added date to dateArray: ${date.toLocaleDateString()}`)
                    }
                  }}
                >
                  {date.toLocaleDateString()}
                </Tag>
              ))}
            </div>
            <Text>
              Selected dates: {dateArray.map((d) => d.toLocaleDateString()).join(', ') || '(none)'}
            </Text>
            <Button
              onClick={() => {
                setDateArray([])
                addToLog(`Cleared dateArray`)
              }}
            >
              Clear All
            </Button>
          </Space>
        </Col>

        <Col span={12}>
          <Title level={4}>Date Tuple (Always 2 dates)</Title>
          <Space direction="vertical">
            <RangePicker
              value={[dayjs(dateTuple[0]), dayjs(dateTuple[1])]}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  const newRange = [dates[0].toDate(), dates[1].toDate()]
                  setDateTuple(newRange as [Date, Date])
                  addToLog(
                    `Set dateTuple to range: ${newRange[0].toLocaleDateString()} - ${newRange[1].toLocaleDateString()}`,
                  )
                }
              }}
            />
            <Text>
              Date range: {dateTuple[0].toLocaleDateString()} - {dateTuple[1].toLocaleDateString()}
            </Text>
            <Text type="secondary">Try removing one date from the URL - it will be restored</Text>
            <Button
              onClick={() => {
                const newDates: [Date, Date] = [
                  new Date(2025, 4, 1), // May 1, 2025
                  new Date(2025, 4, 15), // May 15, 2025
                ]
                setDateTuple(newDates)
                addToLog(`Set dateTuple to fixed range: May 1-15, 2025`)
              }}
            >
              Set to May 1-15, 2025
            </Button>
          </Space>
        </Col>
      </Row>

      <Divider />

      {/* Dayjs Date Parameters */}
      <Title level={3}>Dayjs Date Parameters</Title>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Title level={4}>Dayjs Date</Title>
          <Space direction="vertical">
            <DatePicker
              value={dayjsDate || null}
              onChange={(date) => {
                setDayjsDate(date || undefined)
                addToLog(`Set dayjsDate to ${date?.format() || 'undefined'}`)
              }}
            />
            <Text>Current value: {dayjsDate?.format() || '(none)'}</Text>
            <Button
              onClick={() => {
                setDayjsDate(undefined)
                addToLog(`Cleared dayjsDate`)
              }}
            >
              Clear
            </Button>
          </Space>
        </Col>
      </Row>

      <Divider />

      {/* URL and Log Display */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={4}>Current URL Parameters</Title>
          <pre
            style={{
              background: '#f0f0f0',
              padding: '8px',
              borderRadius: '4px',
              maxWidth: '100%',
              overflowX: 'auto',
            }}
          >
            {window.location.search}
          </pre>
        </Col>

        <Col span={24}>
          <Title level={4}>Operation Log</Title>
          <div
            style={{
              background: '#f0f0f0',
              padding: '8px',
              borderRadius: '4px',
              height: '200px',
              overflowY: 'auto',
            }}
          >
            {log.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {log.map((entry, index) => (
                  <li
                    key={index}
                    style={{
                      borderBottom: '1px solid #ddd',
                      padding: '4px 0',
                    }}
                  >
                    {entry}
                  </li>
                ))}
              </ul>
            ) : (
              <Text type="secondary">No operations logged yet</Text>
            )}
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default DateTestApp
