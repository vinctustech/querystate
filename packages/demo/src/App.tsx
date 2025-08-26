import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { SectionContent } from './SectionContent'

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

const sections = [
  { id: 'string-basic', name: 'String - Basic', path: '/string-basic' },
  { id: 'string-constraints', name: 'String - Constraints', path: '/string-constraints' },
  {
    id: 'string-transformations',
    name: 'String - Transformations',
    path: '/string-transformations',
  },
  { id: 'string-validations', name: 'String - Validations', path: '/string-validations' },
  { id: 'number-basic', name: 'Number - Basic', path: '/number-basic' },
  { id: 'boolean-basic', name: 'Boolean - Basic', path: '/boolean-basic' },
  { id: 'array-string', name: 'Array - String', path: '/array-string' },
  { id: 'array-number', name: 'Array - Number', path: '/array-number' },
  { id: 'array-boolean', name: 'Array - Boolean', path: '/array-boolean' },
  { id: 'array-date', name: 'Array - Date', path: '/array-date' },
  { id: 'tuple-string', name: 'Tuple - String', path: '/tuple-string' },
  { id: 'tuple-number', name: 'Tuple - Number', path: '/tuple-number' },
  { id: 'tuple-boolean', name: 'Tuple - Boolean', path: '/tuple-boolean' },
  { id: 'tuple-date', name: 'Tuple - Date', path: '/tuple-date' },
  { id: 'date-basic', name: 'Date - Basic', path: '/date-basic' },
  { id: 'antd-integration', name: 'Ant Design - Integration', path: '/antd-integration' },
] as const

function Navigation() {
  const location = useLocation()

  const navButtonStyle = {
    background: '#52c41a',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '4px',
    textDecoration: 'none',
    display: 'inline-block',
  }

  const activeNavButtonStyle = {
    ...navButtonStyle,
    background: '#1890ff',
    fontWeight: 'bold',
  }

  return (
    <div style={{ marginBottom: '30px', padding: '20px', background: '#333', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '15px' }}>Choose a section to test:</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {sections.map((section) => (
          <Link
            key={section.id}
            to={section.path}
            style={location.pathname === section.path ? activeNavButtonStyle : navButtonStyle}
          >
            {section.name}
          </Link>
        ))}
      </div>
      <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
        Each route is a separate page - defaults apply automatically on navigation
      </p>
    </div>
  )
}

function App() {
  return (
    <div style={{ color: 'white', padding: '20px', fontFamily: 'monospace' }}>
      <h1>
        <code>useQueryState</code> Demo App
      </h1>

      <Navigation />

      <Routes>
        <Route path="/" element={<Navigate to="/string-basic" replace />} />
        <Route path="/string-basic" element={<SectionContent section="string-basic" />} />
        <Route
          path="/string-constraints"
          element={<SectionContent section="string-constraints" />}
        />
        <Route
          path="/string-transformations"
          element={<SectionContent section="string-transformations" />}
        />
        <Route
          path="/string-validations"
          element={<SectionContent section="string-validations" />}
        />
        <Route path="/number-basic" element={<SectionContent section="number-basic" />} />
        <Route path="/boolean-basic" element={<SectionContent section="boolean-basic" />} />
        <Route path="/array-string" element={<SectionContent section="array-string" />} />
        <Route path="/array-number" element={<SectionContent section="array-number" />} />
        <Route path="/array-boolean" element={<SectionContent section="array-boolean" />} />
        <Route path="/array-date" element={<SectionContent section="array-date" />} />
        <Route path="/tuple-string" element={<SectionContent section="tuple-string" />} />
        <Route path="/tuple-number" element={<SectionContent section="tuple-number" />} />
        <Route path="/tuple-boolean" element={<SectionContent section="tuple-boolean" />} />
        <Route path="/tuple-date" element={<SectionContent section="tuple-date" />} />
        <Route path="/date-basic" element={<SectionContent section="date-basic" />} />
        <Route path="/antd-integration" element={<SectionContent section="antd-integration" />} />
      </Routes>
    </div>
  )
}

export default App
