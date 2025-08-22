# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QueryState is a TypeScript React library for managing URL query parameters as application state. It's a monorepo with two packages:
- `packages/querystate/`: The main library published to npm as `@vinctus/querystate`
- `packages/demo/`: A demo application using Vite and Ant Design

## Common Development Commands

### Build and Development
```bash
# Build the main library
npm run build

# Run the demo app (for testing changes)
npm run dev

# Run tests
npm run test

# Clean all node_modules and dist folders
npm run clean

# Publish to npm (builds first)
npm run publish
```

### Package-specific commands
```bash
# Build the querystate library in watch mode
cd packages/querystate && npm run dev

# Build the demo app
cd packages/demo && npm run build
```

## Architecture and Key Components

### Core Library Structure (`packages/querystate/`)
- **`src/useQueryState.ts`**: Main implementation containing:
  - `useQueryState` hook: Core React hook that manages URL query parameters
  - `queryState` API: Fluent builder for defining parameter schemas
  - Type system: Complex TypeScript types for compile-time safety with parameters
  - Parameter handlers for: strings, numbers, arrays, tuples, and dates (including dayjs support)

- **Build Process**: Uses Rollup to generate:
  - CommonJS bundle (`dist/index.js`)
  - ESM bundle (`dist/index.esm.js`)
  - TypeScript declarations (`dist/index.d.ts`)

### Key Design Patterns

1. **Fluent Builder Pattern**: The `queryState` object provides chainable methods for configuring parameters:
   - `.string()`, `.number()`, `.date()` for base types
   - `.array()` for variable-length arrays
   - `.tuple(n)` for fixed-length arrays
   - `.default(value)` for default values

2. **Type-Safe State Management**: The library uses advanced TypeScript types to ensure:
   - Parameters with defaults are never undefined
   - Arrays always return empty arrays (never undefined)
   - Tuples maintain their fixed length
   - Proper typing for setters based on parameter configuration

3. **URL Synchronization**: Built on React Router's `useSearchParams`, automatically:
   - Syncs state changes to URL query parameters
   - Applies defaults when parameters are missing
   - Maintains proper formatting for arrays (multiple params with same key)

### Testing Approach

The library uses Jest for testing (though test files aren't currently present). To run tests:
```bash
npm run test
```

### Dependencies

- **Peer Dependencies**: React (>=16.8), React DOM, React Router DOM (>=6.0)
- **Date handling**: dayjs for date manipulation
- **Build tools**: Rollup, TypeScript
- **Demo dependencies**: Vite, Ant Design

## TypeScript Configuration

The project uses strict TypeScript settings with:
- Target: ES2017
- Module resolution: bundler
- Strict mode enabled
- No unused locals/parameters

## Testing Standards

### Button-Based Interactive Testing

**ALWAYS use this format for testing new features:**

Create interactive test components with buttons instead of forms or text inputs. This provides:
- **Instant feedback** - Click and immediately see results  
- **Edge case testing** - Easy to test boundaries and constraints  
- **Visual organization** - Each parameter type gets its own section  
- **Clear labeling** - Button text explains exactly what it does  
- **URL visibility** - Real-time URL display shows what's happening  
- **No typing errors** - Eliminates user input mistakes during testing  

**Standard Test Layout Pattern:**
```tsx
function ParameterTest() {
  const schema = {
    param: queryState.string().min(2).max(10).default('default')
  }
  const { param, setParam } = useQueryState(schema)
  
  return (
    <div style={{ color: 'white', padding: '20px', fontFamily: 'monospace' }}>
      <h3>Parameter Type (constraints description)</h3>
      <p>Value: {param ?? 'undefined'}</p>
      
      <button onClick={() => setParam('validValue')}>
        Set Valid Value
      </button>
      <button onClick={() => setParam('invalid')}>
        Set Invalid Value (describe what happens)
      </button>
      <button onClick={() => setParam(undefined)}>
        Clear
      </button>
      
      <div style={{ marginTop: '20px', background: '#333', padding: '10px' }}>
        <h3>Current URL:</h3>
        <p>{window.location.search || '(empty)'}</p>
      </div>
    </div>
  )
}
```

**Example Button Categories:**
- **Valid values** - Normal expected inputs
- **Edge cases** - Boundary conditions (min/max lengths, values)
- **Invalid inputs** - Values that should be rejected or transformed
- **Type coercion** - How different input types are handled
- **Clear/reset** - Setting to undefined

## API Naming Standards

**CRITICAL: Never rename the core library API!**

The library exports must always be:
- `useQueryState` - The main React hook (never `useSimpleQueryState` or variants)
- `queryState` - The main builder object (never `simpleQueryState` or variants)

These names are the public API that users depend on. Even during refactoring or creating simplified implementations, the exported names must remain consistent.

**Example:**
```typescript
// ✅ CORRECT - Always use these exact names
import { queryState, useQueryState } from 'querystate'

const schema = {
  name: queryState.string().min(2).max(10),
  age: queryState.number().min(0).max(120)
}

const { name, setName, age, setAge } = useQueryState(schema)
```

Internal implementation files can have descriptive names (like `simple.ts`), but exports in `index.ts` must use the standard API names.

## Planning Mode Best Practices

When working on complex refactoring or architectural changes, it's recommended to stay in plan mode through the entire planning process. This allows for:
- Iterative refinement of the plan based on feedback
- Full exploration of the codebase before making changes
- Clear communication about what will be changed
- Opportunity to adjust requirements before execution

To use plan mode effectively:
1. Start with `/planning` to enter plan mode
2. Iterate on the plan multiple times if needed
3. Only exit plan mode when the plan is fully refined and agreed upon
4. Use the ExitPlanMode tool only after all planning discussions are complete