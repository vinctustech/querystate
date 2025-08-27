import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { StringSingle } from './sections/StringSingle'
import { StringConstraints } from './sections/StringConstraints'
import { StringTransformations } from './sections/StringTransformations'
import { StringValidations } from './sections/StringValidations'
import { StringArray } from './sections/StringArray'
import { StringTuple } from './sections/StringTuple'
import { NumberSingle } from './sections/NumberSingle'
import { NumberArray } from './sections/NumberArray'
import { NumberTuple } from './sections/NumberTuple'
import { BooleanSingle } from './sections/BooleanSingle'
import { BooleanArray } from './sections/BooleanArray'
import { BooleanTuple } from './sections/BooleanTuple'
import { DateSingle } from './sections/DateSingle'
import { DateArray } from './sections/DateArray'
import { DateTuple } from './sections/DateTuple'
import { AntdIntegration } from './sections/AntdIntegration'

const sections = [
  { id: 'string-single', name: 'String - Single', path: '/string-single', component: StringSingle },
  {
    id: 'string-constraints',
    name: 'String - Constraints',
    path: '/string-constraints',
    component: StringConstraints,
  },
  {
    id: 'string-transformations',
    name: 'String - Transformations',
    path: '/string-transformations',
    component: StringTransformations,
  },
  {
    id: 'string-validations',
    name: 'String - Validations',
    path: '/string-validations',
    component: StringValidations,
  },
  { id: 'string-array', name: 'String - Array', path: '/string-array', component: StringArray },
  { id: 'string-tuple', name: 'String - Tuple', path: '/string-tuple', component: StringTuple },
  { id: 'number-single', name: 'Number - Single', path: '/number-single', component: NumberSingle },
  { id: 'number-array', name: 'Number - Array', path: '/number-array', component: NumberArray },
  { id: 'number-tuple', name: 'Number - Tuple', path: '/number-tuple', component: NumberTuple },
  {
    id: 'boolean-single',
    name: 'Boolean - Single',
    path: '/boolean-single',
    component: BooleanSingle,
  },
  { id: 'boolean-array', name: 'Boolean - Array', path: '/boolean-array', component: BooleanArray },
  { id: 'boolean-tuple', name: 'Boolean - Tuple', path: '/boolean-tuple', component: BooleanTuple },
  { id: 'date-single', name: 'Date - Single', path: '/date-single', component: DateSingle },
  { id: 'date-array', name: 'Date - Array', path: '/date-array', component: DateArray },
  { id: 'date-tuple', name: 'Date - Tuple', path: '/date-tuple', component: DateTuple },
  {
    id: 'antd-integration',
    name: 'Ant Design - Integration',
    path: '/antd-integration',
    component: AntdIntegration,
  },
] as const

function Navigation() {
  const location = useLocation()

  const navButtonStyle = {
    padding: '8px 16px',
    margin: '4px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '14px',
    backgroundColor: '#262626',
    color: '#fff',
    transition: 'background-color 0.2s',
  }

  const activeNavButtonStyle = {
    ...navButtonStyle,
    backgroundColor: '#1890ff',
    color: '#fff',
  }

  return (
    <div
      style={{
        marginBottom: '32px',
        padding: '20px',
        backgroundColor: '#1f1f1f',
        borderRadius: '8px',
      }}
    >
      <h1 style={{ color: '#fff', marginBottom: '20px', fontSize: '24px' }}>
        QueryState Type Testing Demo
      </h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
    </div>
  )
}

export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#141414',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '20px',
      }}
    >
      <Navigation />

      <Routes>
        <Route path="/" element={<Navigate to="/string-single" replace />} />
        {sections.map((section) => (
          <Route key={section.id} path={section.path} element={<section.component />} />
        ))}
      </Routes>

      {/* URL Display */}
      <div
        style={{
          marginTop: '32px',
          padding: '16px',
          backgroundColor: '#262626',
          borderRadius: '6px',
          fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
          fontSize: '14px',
        }}
      >
        <strong>Current URL:</strong> {window.location.href}
      </div>
    </div>
  )
}
