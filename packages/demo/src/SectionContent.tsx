import { qs, useQueryState } from '@vinctus/querystate'
import { Select } from 'antd'

type Section =
  | 'string-basic'
  | 'string-constraints'
  | 'string-transformations'
  | 'string-validations'
  | 'number-basic'
  | 'boolean-basic'
  | 'array-string'
  | 'array-number'
  | 'array-boolean'
  | 'array-date'
  | 'tuple-string'
  | 'tuple-number'
  | 'tuple-boolean'
  | 'tuple-date'
  | 'date-basic'
  | 'antd-integration'

// Define schema based on current section
const getSchema = (section: Section) => {
  switch (section) {
    case 'string-basic':
      return {
        category: qs.string(),
        name: qs.string().default('John'),
      }
    case 'string-constraints':
      return {
        name: qs.string().min(2).max(10).default('John'),
        title: qs.string().min(5).max(50),
      }
    case 'string-transformations':
      return {
        username: qs.string().min(3).max(20).lowercase().default('user123'),
        displayName: qs.string().min(2).max(30).uppercase(),
        code: qs.string().uppercase(),
      }
    case 'string-validations':
      return {
        email: qs.string().email().default('user@example.com'),
        website: qs.string().url(),
        userId: qs.string().uuid(),
      }
    case 'number-basic':
      return {
        score: qs.number(),
        age: qs.number().min(0).max(120).default(25),
        price: qs.number().min(0),
      }
    case 'boolean-basic':
      return {
        hasDiscount: qs.boolean(),
        isActive: qs.boolean().default(true),
        isPublic: qs.boolean().default(false),
      }
    case 'array-string':
      return {
        categories: qs.string().array(),
        tags: qs.string().min(2).max(10).array().min(1).max(3).default(['react', 'typescript']),
        emptyDriverIds: qs.string().array(),
        keywords: qs.string().lowercase().array().max(5),
      }
    case 'array-number':
      return {
        ratings: qs.number().array(),
        scores: qs.number().min(0).max(100).array().min(2).max(4).default([85, 92]),
        prices: qs.number().min(0).array(),
      }
    case 'array-boolean':
      return {
        flags: qs.boolean().array(),
        features: qs.boolean().array().min(1).max(3).default([true, false]),
        permissions: qs.boolean().array(),
      }
    case 'array-date':
      return {
        events: qs.date().array(),
        milestones: qs
          .date()
          .future()
          .array()
          .default([new Date('2025-01-01'), new Date('2025-06-01')]),
        deadlines: qs.date().array(),
      }
    case 'tuple-string':
      return {
        fullName: qs.string().min(2).tuple(2),
        defaultName: qs.string().min(2).tuple(2).default(['Default', 'User']),
        coordinates: qs.string().tuple(2),
      }
    case 'tuple-number':
      return {
        point: qs.number().tuple(2),
        dimensions: qs.number().min(0).tuple(2).default([100, 200]),
        range: qs.number().tuple(2),
      }
    case 'tuple-boolean':
      return {
        switches: qs.boolean().tuple(2),
        states: qs.boolean().tuple(2).default([true, false]),
        options: qs.boolean().tuple(2),
      }
    case 'tuple-date':
      return {
        dateRange: qs.date().tuple(2),
        defaultDateRange: qs
          .date()
          .min(new Date('2024-01-01'))
          .tuple(2)
          .default([new Date('2024-06-01'), new Date('2024-06-30')]),
        quarter: qs.date().tuple(2),
      }
    case 'date-basic':
      return {
        startDate: qs.date().default(new Date()),
        eventDate: qs.date().future(),
        deadline: qs.date().min(new Date('2024-01-01')).max(new Date('2024-12-31')),
        birthDate: qs.date().past(),
      }
    case 'antd-integration':
      const tagsSchema = qs
        .string()
        .min(2)
        .max(10)
        .array()
        .min(1)
        .max(3)
        .default(['react', 'typescript'])
      return {
        categories: qs.string().array(),
        tags: tagsSchema,
        emptyDriverIds: qs.string().array(),
        priorities: qs.number().array().default([1, 2]),
      }
    default:
      return { test: qs.string() }
  }
}

interface SectionContentProps {
  section: Section
}

export function SectionContent({ section }: SectionContentProps) {
  const schema = getSchema(section)
  const queryState = useQueryState(schema)

  // Helper to display values clearly
  const displayValue = (value: any) => {
    if (value === undefined) {
      return <span style={{ color: '#888', fontStyle: 'italic' }}>undefined</span>
    }
    if (value === null) {
      return <span style={{ color: '#888', fontStyle: 'italic' }}>null</span>
    }
    if (value instanceof Date) {
      return <span style={{ color: '#fff' }}>{value.toLocaleDateString()}</span>
    }
    return <span style={{ color: '#fff' }}>{String(value)}</span>
  }

  const buttonStyle = {
    background: '#1890ff',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '2px',
  }

  const clearButtonStyle = {
    ...buttonStyle,
    background: '#ff4d4f',
  }

  const renderSection = () => {
    switch (section) {
      case 'string-basic':
        return (
          <div>
            <h2>String - Basic</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3>String without default</h3>
              <p>Category: {displayValue(queryState.category)}</p>
              <button style={buttonStyle} onClick={() => queryState.setCategory('electronics')}>
                Set 'electronics'
              </button>
              <button style={buttonStyle} onClick={() => queryState.setCategory('books')}>
                Set 'books'
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setCategory(undefined)}>
                Clear
              </button>
              <p style={{ fontSize: '12px', color: '#888' }}>
                qs.string() - No default, should not appear in URL when empty
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>String with default</h3>
              <p>Name: {displayValue(queryState.name)}</p>
              <button style={buttonStyle} onClick={() => queryState.setName('Alice')}>
                Set 'Alice'
              </button>
              <button style={buttonStyle} onClick={() => queryState.setName('Bob')}>
                Set 'Bob'
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setName(undefined)}>
                Clear (revert to default)
              </button>
              <p style={{ fontSize: '12px', color: '#888' }}>
                qs.string().default('John') - Should show name=John in URL initially
              </p>
            </div>
          </div>
        )

      case 'string-constraints':
        return (
          <div>
            <h2>String - Constraints</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3>String with min/max length (min: 2, max: 10, default: 'John')</h3>
              <p>Name: {displayValue(queryState.name)}</p>
              <button style={buttonStyle} onClick={() => queryState.setName('A')}>
                Set 'A' (too short - should revert to default)
              </button>
              <button style={buttonStyle} onClick={() => queryState.setName('ThisNameIsTooLong')}>
                Set long name (should truncate to 10 chars)
              </button>
              <button style={buttonStyle} onClick={() => queryState.setName('Alice')}>
                Set 'Alice' (valid)
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setName(undefined)}>
                Clear (revert to default)
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>String with constraints, no default (min: 5, max: 50)</h3>
              <p>Title: {displayValue(queryState.title)}</p>
              <button style={buttonStyle} onClick={() => queryState.setTitle('Hi')}>
                Set 'Hi' (too short)
              </button>
              <button
                style={buttonStyle}
                onClick={() => queryState.setTitle('This is a valid title')}
              >
                Set valid title
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setTitle(undefined)}>
                Clear
              </button>
            </div>
          </div>
        )

      case 'string-transformations':
        return (
          <div>
            <h2>String - Transformations</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3>Lowercase transformation (default: 'user123')</h3>
              <p>Username: {displayValue(queryState.username)}</p>
              <button style={buttonStyle} onClick={() => queryState.setUsername('HELLO')}>
                Set 'HELLO' (converts to lowercase)
              </button>
              <button style={buttonStyle} onClick={() => queryState.setUsername('Alice_2024')}>
                Set 'Alice_2024'
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setUsername(undefined)}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Uppercase transformation</h3>
              <p>Display Name: {displayValue(queryState.displayName)}</p>
              <button style={buttonStyle} onClick={() => queryState.setDisplayName('hello world')}>
                Set 'hello world' (converts to uppercase)
              </button>
              <button style={buttonStyle} onClick={() => queryState.setDisplayName('admin')}>
                Set 'admin'
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setDisplayName(undefined)}>
                Clear
              </button>
            </div>
          </div>
        )

      case 'string-validations':
        return (
          <div>
            <h2>String - Validations</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3>Email validation (default: 'user@example.com')</h3>
              <p>Email: {displayValue(queryState.email)}</p>
              <button style={buttonStyle} onClick={() => queryState.setEmail('test@domain.com')}>
                Set valid email
              </button>
              <button style={buttonStyle} onClick={() => queryState.setEmail('invalid-email')}>
                Set invalid email
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setEmail(undefined)}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>URL validation</h3>
              <p>Website: {displayValue(queryState.website)}</p>
              <button
                style={buttonStyle}
                onClick={() => queryState.setWebsite('https://example.com')}
              >
                Set valid URL
              </button>
              <button style={buttonStyle} onClick={() => queryState.setWebsite('not-a-url')}>
                Set invalid URL
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setWebsite(undefined)}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>UUID validation</h3>
              <p>User ID: {displayValue(queryState.userId)}</p>
              <button
                style={buttonStyle}
                onClick={() => queryState.setUserId('550e8400-e29b-41d4-a716-446655440000')}
              >
                Set valid UUID
              </button>
              <button style={buttonStyle} onClick={() => queryState.setUserId('invalid-uuid')}>
                Set invalid UUID
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setUserId(undefined)}>
                Clear
              </button>
            </div>
          </div>
        )

      case 'number-basic':
        return (
          <div>
            <h2>Number - Basic</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3>Number without default</h3>
              <p>Score: {displayValue(queryState.score)}</p>
              <button style={buttonStyle} onClick={() => queryState.setScore(100)}>
                Set 100
              </button>
              <button style={buttonStyle} onClick={() => queryState.setScore(42.5)}>
                Set 42.5
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setScore(undefined)}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Number with constraints (min: 0, max: 120, default: 25)</h3>
              <p>Age: {displayValue(queryState.age)}</p>
              <button style={buttonStyle} onClick={() => queryState.setAge(-5)}>
                Set -5 (clamps to 0)
              </button>
              <button style={buttonStyle} onClick={() => queryState.setAge(150)}>
                Set 150 (clamps to 120)
              </button>
              <button style={buttonStyle} onClick={() => queryState.setAge(30)}>
                Set 30
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setAge(undefined)}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Number with min only (min: 0)</h3>
              <p>Price: {displayValue(queryState.price)}</p>
              <button style={buttonStyle} onClick={() => queryState.setPrice(-10)}>
                Set -10 (clamps to 0)
              </button>
              <button style={buttonStyle} onClick={() => queryState.setPrice(99.99)}>
                Set 99.99
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setPrice(undefined)}>
                Clear
              </button>
            </div>
          </div>
        )

      case 'boolean-basic':
        return (
          <div>
            <h2>Boolean - Basic</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3>Boolean without default</h3>
              <p>Has Discount: {displayValue(queryState.hasDiscount)}</p>
              <button style={buttonStyle} onClick={() => queryState.setHasDiscount(true)}>
                Set true
              </button>
              <button style={buttonStyle} onClick={() => queryState.setHasDiscount(false)}>
                Set false
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setHasDiscount(undefined)}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Boolean with default (default: true)</h3>
              <p>Is Active: {displayValue(queryState.isActive)}</p>
              <button style={buttonStyle} onClick={() => queryState.setIsActive(true)}>
                Set true
              </button>
              <button style={buttonStyle} onClick={() => queryState.setIsActive(false)}>
                Set false
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setIsActive(undefined)}>
                Clear (revert to default)
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Boolean with default (default: false)</h3>
              <p>Is Public: {displayValue(queryState.isPublic)}</p>
              <button style={buttonStyle} onClick={() => queryState.setIsPublic(true)}>
                Set true
              </button>
              <button style={buttonStyle} onClick={() => queryState.setIsPublic(false)}>
                Set false
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setIsPublic(undefined)}>
                Clear (revert to default)
              </button>
            </div>
          </div>
        )

      case 'array-string':
        return (
          <div>
            <h2>String - Array</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3>String array without default</h3>
              <p>Categories: {displayValue(queryState.categories.join(', ') || '(empty array)')}</p>
              <button
                style={buttonStyle}
                onClick={() => queryState.setCategories(['tech', 'design'])}
              >
                Set ['tech', 'design']
              </button>
              <button
                style={buttonStyle}
                onClick={() => queryState.setCategories(['food', 'travel'])}
              >
                Set ['food', 'travel']
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setCategories(undefined)}>
                Clear
              </button>
              <p style={{ fontSize: '12px', color: '#888' }}>
                qs.string().array() - No default, should NOT appear in URL when empty
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>String array with non-empty default</h3>
              <p>Tags: {displayValue(queryState.tags.join(', '))}</p>
              <button style={buttonStyle} onClick={() => queryState.setTags(['vue', 'angular'])}>
                Set ['vue', 'angular']
              </button>
              <button
                style={buttonStyle}
                onClick={() => queryState.setTags(['vue', 'angular', 'svelte', 'react'])}
              >
                Set 4 items (should truncate to 3)
              </button>
              <button style={buttonStyle} onClick={() => queryState.setTags(['react'])}>
                Set ['react'] (single item)
              </button>
              <button style={buttonStyle} onClick={() => queryState.setTags(['a', 'vue', 'react'])}>
                Set ['a', 'vue', 'react'] ('a' should be filtered out - too short)
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setTags(undefined)}>
                Clear (revert to default)
              </button>
              <p style={{ fontSize: '12px', color: '#888' }}>
                qs.string().array().default(['react', 'typescript']) - Should show
                tags[]=react&tags[]=typescript initially
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>String array with empty default</h3>
              <p>
                Empty Driver IDs:{' '}
                {displayValue(queryState.emptyDriverIds.join(', ') || '(empty array)')}
              </p>
              <button
                style={buttonStyle}
                onClick={() => queryState.setEmptyDriverIds(['driver-001'])}
              >
                Set ['driver-001']
              </button>
              <button
                style={buttonStyle}
                onClick={() => queryState.setEmptyDriverIds(['driver-001', 'driver-002'])}
              >
                Set ['driver-001', 'driver-002']
              </button>
              <button
                style={clearButtonStyle}
                onClick={() => queryState.setEmptyDriverIds(undefined)}
              >
                Clear (revert to empty array)
              </button>
              <p style={{ fontSize: '12px', color: '#888' }}>
                qs.string().array() - Empty arrays show nothing in URL (clean URLs)
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>String array with transformations and constraints</h3>
              <p>Keywords: {displayValue(queryState.keywords.join(', ') || '(empty array)')}</p>
              <button style={buttonStyle} onClick={() => queryState.setKeywords(['REACT', 'VUE'])}>
                Set ['REACT', 'VUE'] (converts to lowercase)
              </button>
              <button
                style={buttonStyle}
                onClick={() =>
                  queryState.setKeywords([
                    'javascript',
                    'typescript',
                    'python',
                    'go',
                    'rust',
                    'c++',
                  ])
                }
              >
                Set 6 items (will truncate to 5)
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setKeywords(undefined)}>
                Clear
              </button>
            </div>
          </div>
        )

      case 'array-number':
        return (
          <div>
            <h2>Number - Array</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3>Number array without default</h3>
              <p>Ratings: {displayValue(queryState.ratings.join(', ') || '(empty array)')}</p>
              <button style={buttonStyle} onClick={() => queryState.setRatings([1, 2, 3])}>
                Set [1, 2, 3]
              </button>
              <button style={buttonStyle} onClick={() => queryState.setRatings([4.5, 3.8, 2.1])}>
                Set [4.5, 3.8, 2.1]
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setRatings(undefined)}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>
                Number array with constraints (min: 2, max: 4, values: 0-100, default: [85, 92])
              </h3>
              <p>Scores: {displayValue(queryState.scores.join(', '))}</p>
              <button style={buttonStyle} onClick={() => queryState.setScores([75])}>
                Set [75] (too few items)
              </button>
              <button
                style={buttonStyle}
                onClick={() => queryState.setScores([60, 70, 80, 90, 95])}
              >
                Set 5 items (will truncate to 4)
              </button>
              <button style={buttonStyle} onClick={() => queryState.setScores([-10, 150, 75])}>
                Set [-10, 150, 75] (clamps to [0, 100, 75])
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setScores(undefined)}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Number array (natural empty default)</h3>
              <p>Prices: {displayValue(queryState.prices.join(', ') || '(empty array)')}</p>
              <button style={buttonStyle} onClick={() => queryState.setPrices([9.99, 19.99])}>
                Set [9.99, 19.99]
              </button>
              <button style={buttonStyle} onClick={() => queryState.setPrices([-5, 10])}>
                Set [-5, 10] (negative clamps to 0)
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setPrices(undefined)}>
                Clear (revert to empty array)
              </button>
            </div>
          </div>
        )

      case 'array-boolean':
        return (
          <div>
            <h2>Boolean - Array</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3>Boolean array without default</h3>
              <p>Flags: {displayValue(queryState.flags.join(', ') || '(empty array)')}</p>
              <button style={buttonStyle} onClick={() => queryState.setFlags([true, false, true])}>
                Set [true, false, true]
              </button>
              <button style={buttonStyle} onClick={() => queryState.setFlags([false])}>
                Set [false]
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setFlags(undefined)}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Boolean array with constraints (min: 1, max: 3, default: [true, false])</h3>
              <p>Features: {displayValue(queryState.features.join(', '))}</p>
              <button style={buttonStyle} onClick={() => queryState.setFeatures([])}>
                Set [] (too few)
              </button>
              <button
                style={buttonStyle}
                onClick={() => queryState.setFeatures([true, false, true, false])}
              >
                Set 4 items (will truncate to 3)
              </button>
              <button style={buttonStyle} onClick={() => queryState.setFeatures([false, true])}>
                Set [false, true]
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setFeatures(undefined)}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Boolean array (natural empty default)</h3>
              <p>
                Permissions: {displayValue(queryState.permissions.join(', ') || '(empty array)')}
              </p>
              <button
                style={buttonStyle}
                onClick={() => queryState.setPermissions([true, true, false])}
              >
                Set [true, true, false]
              </button>
              <button style={buttonStyle} onClick={() => queryState.setPermissions([false])}>
                Set [false]
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setPermissions(undefined)}>
                Clear (revert to empty array)
              </button>
            </div>
          </div>
        )

      case 'array-date':
        return (
          <div>
            <h2>Date - Array</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3>Date array without default</h3>
              <p>
                Events:{' '}
                {displayValue(
                  queryState.events.map((d) => d?.toLocaleDateString()).join(', ') ||
                    '(empty array)',
                )}
              </p>
              <button
                style={buttonStyle}
                onClick={() =>
                  queryState.setEvents([new Date('2024-06-01'), new Date('2024-07-01')])
                }
              >
                Set June & July 2024
              </button>
              <button
                style={buttonStyle}
                onClick={() => queryState.setEvents([new Date('2025-01-01')])}
              >
                Set New Year 2025
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setEvents(undefined)}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Date array with future constraint and default</h3>
              <p>
                Milestones:{' '}
                {displayValue(queryState.milestones.map((d) => d.toLocaleDateString()).join(', '))}
              </p>
              <button
                style={buttonStyle}
                onClick={() =>
                  queryState.setMilestones([new Date('2025-03-01'), new Date('2025-09-01')])
                }
              >
                Set Mar & Sep 2025
              </button>
              <button
                style={buttonStyle}
                onClick={() => queryState.setMilestones([new Date('2020-01-01')])}
              >
                Set past date (should fail)
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setMilestones(undefined)}>
                Clear (revert to default)
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Date array (natural empty default)</h3>
              <p>
                Deadlines:{' '}
                {displayValue(
                  queryState.deadlines.map((d) => d?.toLocaleDateString()).join(', ') ||
                    '(empty array)',
                )}
              </p>
              <button
                style={buttonStyle}
                onClick={() => queryState.setDeadlines([new Date('2024-12-31')])}
              >
                Set End of 2024
              </button>
              <button
                style={buttonStyle}
                onClick={() =>
                  queryState.setDeadlines([new Date('2024-06-01'), new Date('2024-09-01')])
                }
              >
                Set June & Sep 2024
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setDeadlines(undefined)}>
                Clear (revert to empty array)
              </button>
            </div>
          </div>
        )

      case 'tuple-string':
        return (
          <div>
            <h2>String - Tuple</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3>String tuple without default (exactly 2 strings, min 2 chars each)</h3>
              <p>
                Full Name:{' '}
                {displayValue(
                  queryState.fullName ? queryState.fullName.join(', ') : queryState.fullName,
                )}
              </p>
              <button style={buttonStyle} onClick={() => queryState.setFullName(['John', 'Doe'])}>
                Set ['John', 'Doe']
              </button>
              <button style={buttonStyle} onClick={() => queryState.setFullName(['A', 'Smith'])}>
                Set ['A', 'Smith'] (first too short)
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setFullName(undefined)}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>String tuple with default (exactly 2 strings, min 2 chars each)</h3>
              <p>Default Name: {displayValue(queryState.defaultName.join(', '))}</p>
              <button
                style={buttonStyle}
                onClick={() => queryState.setDefaultName(['Admin', 'User'])}
              >
                Set ['Admin', 'User']
              </button>
              <button style={buttonStyle} onClick={() => queryState.setDefaultName(['A', 'Test'])}>
                Set ['A', 'Test'] (first too short)
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setDefaultName(undefined)}>
                Clear (revert to default)
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>String tuple for coordinates</h3>
              <p>
                Coordinates:{' '}
                {displayValue(
                  queryState.coordinates
                    ? queryState.coordinates.join(', ')
                    : queryState.coordinates,
                )}
              </p>
              <button
                style={buttonStyle}
                onClick={() => queryState.setCoordinates(['40.7128', '-74.0060'])}
              >
                Set NYC coordinates
              </button>
              <button
                style={buttonStyle}
                onClick={() => queryState.setCoordinates(['51.5074', '0.1278'])}
              >
                Set London coordinates
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setCoordinates(undefined)}>
                Clear
              </button>
            </div>
          </div>
        )

      case 'tuple-number':
        return (
          <div>
            <h2>Number - Tuple</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3>Number tuple without default (exactly 2 numbers)</h3>
              <p>
                Point:{' '}
                {displayValue(queryState.point ? queryState.point.join(', ') : queryState.point)}
              </p>
              <button style={buttonStyle} onClick={() => queryState.setPoint([10, 20])}>
                Set [10, 20]
              </button>
              <button style={buttonStyle} onClick={() => queryState.setPoint([0, 0])}>
                Set [0, 0] (origin)
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setPoint(undefined)}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Number tuple with constraints and default (min: 0, default: [100, 200])</h3>
              <p>Dimensions: {displayValue(queryState.dimensions.join(', '))}</p>
              <button style={buttonStyle} onClick={() => queryState.setDimensions([300, 400])}>
                Set [300, 400]
              </button>
              <button style={buttonStyle} onClick={() => queryState.setDimensions([-10, 50])}>
                Set [-10, 50] (negative clamps to 0)
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setDimensions(undefined)}>
                Clear (revert to default)
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Number tuple for range</h3>
              <p>
                Range:{' '}
                {displayValue(
                  Array.isArray(queryState.range) ? queryState.range.join(', ') : queryState.range,
                )}
              </p>
              <button style={buttonStyle} onClick={() => queryState.setRange([1, 100])}>
                Set [1, 100]
              </button>
              <button style={buttonStyle} onClick={() => queryState.setRange([0, 10])}>
                Set [0, 10]
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setRange(undefined)}>
                Clear
              </button>
            </div>
          </div>
        )

      case 'tuple-boolean':
        return (
          <div>
            <h2>Boolean - Tuple</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3>Boolean tuple without default (exactly 2 booleans)</h3>
              <p>
                Switches:{' '}
                {displayValue(
                  Array.isArray(queryState.switches)
                    ? queryState.switches.join(', ')
                    : queryState.switches,
                )}
              </p>
              <button style={buttonStyle} onClick={() => queryState.setSwitches([true, false])}>
                Set [true, false]
              </button>
              <button style={buttonStyle} onClick={() => queryState.setSwitches([false, false])}>
                Set [false, false]
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setSwitches(undefined)}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Boolean tuple with default (default: [true, false])</h3>
              <p>States: {displayValue(queryState.states.join(', '))}</p>
              <button style={buttonStyle} onClick={() => queryState.setStates([false, true])}>
                Set [false, true]
              </button>
              <button style={buttonStyle} onClick={() => queryState.setStates([true, true])}>
                Set [true, true]
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setStates(undefined)}>
                Clear (revert to default)
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Boolean tuple for options</h3>
              <p>
                Options:{' '}
                {displayValue(
                  Array.isArray(queryState.options)
                    ? queryState.options.join(', ')
                    : queryState.options,
                )}
              </p>
              <button style={buttonStyle} onClick={() => queryState.setOptions([true, true])}>
                Set [true, true]
              </button>
              <button style={buttonStyle} onClick={() => queryState.setOptions([false, true])}>
                Set [false, true]
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setOptions(undefined)}>
                Clear
              </button>
            </div>
          </div>
        )

      case 'tuple-date':
        return (
          <div>
            <h2>Date - Tuple</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3>Date tuple without default (exactly 2 dates)</h3>
              <p>
                Date Range:{' '}
                {displayValue(
                  Array.isArray(queryState.dateRange)
                    ? queryState.dateRange.map((d) => d?.toLocaleDateString()).join(' to ')
                    : queryState.dateRange,
                )}
              </p>
              <button
                style={buttonStyle}
                onClick={() =>
                  queryState.setDateRange([new Date('2024-06-01'), new Date('2024-06-30')])
                }
              >
                Set June 2024 range
              </button>
              <button
                style={buttonStyle}
                onClick={() =>
                  queryState.setDateRange([new Date('2024-12-01'), new Date('2024-12-31')])
                }
              >
                Set December 2024 range
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setDateRange(undefined)}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Date tuple with constraints and default (min: 2024-01-01, default: June 2024)</h3>
              <p>
                Default Date Range:{' '}
                {displayValue(
                  queryState.defaultDateRange.map((d) => d.toLocaleDateString()).join(' to '),
                )}
              </p>
              <button
                style={buttonStyle}
                onClick={() =>
                  queryState.setDefaultDateRange([new Date('2024-08-01'), new Date('2024-08-31')])
                }
              >
                Set August 2024 range
              </button>
              <button
                style={buttonStyle}
                onClick={() =>
                  queryState.setDefaultDateRange([new Date('2023-01-01'), new Date('2023-01-31')])
                }
              >
                Set 2023 range (before min)
              </button>
              <button
                style={clearButtonStyle}
                onClick={() => queryState.setDefaultDateRange(undefined)}
              >
                Clear (revert to default)
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Date tuple for quarter</h3>
              <p>
                Quarter:{' '}
                {displayValue(
                  Array.isArray(queryState.quarter)
                    ? queryState.quarter.map((d) => d?.toLocaleDateString()).join(' to ')
                    : queryState.quarter,
                )}
              </p>
              <button
                style={buttonStyle}
                onClick={() =>
                  queryState.setQuarter([new Date('2024-01-01'), new Date('2024-03-31')])
                }
              >
                Set Q1 2024
              </button>
              <button
                style={buttonStyle}
                onClick={() =>
                  queryState.setQuarter([new Date('2024-07-01'), new Date('2024-09-30')])
                }
              >
                Set Q3 2024
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setQuarter(undefined)}>
                Clear
              </button>
            </div>
          </div>
        )

      case 'date-basic':
        return (
          <div>
            <h2>Date - Basic</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3>Date with default (default: today)</h3>
              <p>
                Start Date:{' '}
                {displayValue(
                  queryState.startDate
                    ? queryState.startDate.toLocaleDateString()
                    : queryState.startDate,
                )}
              </p>
              <button
                style={buttonStyle}
                onClick={() => queryState.setStartDate(new Date('2024-06-15'))}
              >
                Set June 15, 2024
              </button>
              <button
                style={buttonStyle}
                onClick={() => queryState.setStartDate(new Date('2025-12-25'))}
              >
                Set December 25, 2025
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setStartDate(undefined)}>
                Clear (revert to default)
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Future date only</h3>
              <p>
                Event Date:{' '}
                {displayValue(
                  queryState.eventDate
                    ? queryState.eventDate.toLocaleDateString()
                    : queryState.eventDate,
                )}
              </p>
              <button
                style={buttonStyle}
                onClick={() => queryState.setEventDate(new Date('2020-01-01'))}
              >
                Set 2020 date (past - should fail)
              </button>
              <button
                style={buttonStyle}
                onClick={() => queryState.setEventDate(new Date('2025-06-01'))}
              >
                Set June 1, 2025 (future)
              </button>
              <button
                style={buttonStyle}
                onClick={() => queryState.setEventDate(new Date(Date.now() + 86400000))}
              >
                Set tomorrow
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setEventDate(undefined)}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Date with min/max bounds (2024 only)</h3>
              <p>
                Deadline:{' '}
                {displayValue(
                  queryState.deadline
                    ? queryState.deadline.toLocaleDateString()
                    : queryState.deadline,
                )}
              </p>
              <button
                style={buttonStyle}
                onClick={() => queryState.setDeadline(new Date('2023-12-31'))}
              >
                Set 2023 date (too early)
              </button>
              <button
                style={buttonStyle}
                onClick={() => queryState.setDeadline(new Date('2025-01-01'))}
              >
                Set 2025 date (too late)
              </button>
              <button
                style={buttonStyle}
                onClick={() => queryState.setDeadline(new Date('2024-07-04'))}
              >
                Set July 4, 2024
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setDeadline(undefined)}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Past date only</h3>
              <p>
                Birth Date:{' '}
                {displayValue(
                  queryState.birthDate
                    ? queryState.birthDate.toLocaleDateString()
                    : queryState.birthDate,
                )}
              </p>
              <button
                style={buttonStyle}
                onClick={() => queryState.setBirthDate(new Date('1990-01-01'))}
              >
                Set 1990 (past)
              </button>
              <button
                style={buttonStyle}
                onClick={() => queryState.setBirthDate(new Date('2030-01-01'))}
              >
                Set 2030 (future - should fail)
              </button>
              <button style={clearButtonStyle} onClick={() => queryState.setBirthDate(undefined)}>
                Clear
              </button>
            </div>
          </div>
        )

      case 'antd-integration':
        return (
          <div>
            <h2>Ant Design - Integration</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3>Select (multiple) with array without default</h3>
              <p>Categories: {displayValue(queryState.categories.join(', ') || '(empty array)')}</p>
              <Select
                mode="multiple"
                style={{ width: '100%', marginBottom: '10px' }}
                placeholder="Select categories"
                value={queryState.categories} // Arrays are never undefined
                onChange={(value) => queryState.setCategories(value.length > 0 ? value : undefined)}
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

            <div style={{ marginBottom: '20px' }}>
              <h3>Select (multiple) with string array with default</h3>
              <p>Tags: {displayValue(queryState.tags.join(', '))}</p>
              <Select
                mode="multiple"
                style={{ width: '100%', marginBottom: '10px' }}
                placeholder="Select tags"
                value={queryState.tags} // No need for || since it has defaults
                onChange={(value) => {
                  queryState.setTags(value)
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

            <div style={{ marginBottom: '20px' }}>
              <h3>Select (multiple) with string array (natural empty default)</h3>
              <p>
                Empty Driver IDs:{' '}
                {displayValue(queryState.emptyDriverIds.join(', ') || '(empty array)')}
              </p>
              <Select
                mode="multiple"
                style={{ width: '100%', marginBottom: '10px' }}
                placeholder="Select driver IDs"
                value={queryState.emptyDriverIds} // Arrays are never undefined
                onChange={(value) =>
                  queryState.setEmptyDriverIds(value.length > 0 ? value : undefined)
                }
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

            <div style={{ marginBottom: '20px' }}>
              <h3>Select (multiple) with number array with default</h3>
              <p>Priorities: {displayValue(queryState.priorities.join(', '))}</p>
              <Select
                mode="multiple"
                style={{ width: '100%', marginBottom: '10px' }}
                placeholder="Select priorities"
                value={queryState.priorities.map(String)} // Convert numbers to strings for Select
                onChange={(value) =>
                  queryState.setPriorities(value.length > 0 ? value.map(Number) : undefined)
                }
                options={[
                  { label: 'Low (1)', value: '1' },
                  { label: 'Medium (2)', value: '2' },
                  { label: 'High (3)', value: '3' },
                  { label: 'Critical (4)', value: '4' },
                ]}
              />
              <p style={{ fontSize: '12px', color: '#888' }}>
                Number arrays work with Select by converting to/from strings
              </p>
            </div>
          </div>
        )

      default:
        return <div>Section not implemented yet</div>
    }
  }

  // Debug info for this section
  const debugInfo = [
    `=== CURRENT VALUES ===`,
    ...Object.entries(queryState)
      .filter(([key]) => !key.startsWith('set'))
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`),
  ].join('\n')

  return (
    <div>
      {/* Current Section */}
      <div style={{ marginBottom: '30px', minHeight: '400px' }}>{renderSection()}</div>

      {/* Current URL */}
      <div style={{ marginTop: '30px', padding: '10px', background: '#333', borderRadius: '4px' }}>
        <h3>Current URL:</h3>
        <p style={{ wordBreak: 'break-all' }}>{window.location.search || '(empty)'}</p>
      </div>

      {/* Debug Output */}
      <div style={{ marginTop: '20px', padding: '10px', background: '#222', borderRadius: '4px' }}>
        <h3>Debug Output:</h3>
        <textarea
          value={debugInfo}
          readOnly
          style={{
            width: '100%',
            height: '300px',
            fontFamily: 'monospace',
            fontSize: '12px',
            background: '#1a1a1a',
            color: '#ccc',
            border: '1px solid #555',
            padding: '10px',
            resize: 'vertical',
          }}
        />
      </div>
    </div>
  )
}
