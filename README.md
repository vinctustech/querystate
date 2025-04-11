# QueryState

A lightweight utility that uses URL query parameters as React state, eliminating the need for `useState` when working with filterable views and Ant Design's Select components.

## Overview

QueryState provides a simple, type-safe way to persist UI filter/view state directly in the URL. It's built on top of React Router's `useSearchParams` hook but eliminates the need to maintain separate local state for UI components, as the URL itself becomes your state store.

Key features:
- Eliminates the need for separate React state management (`useState`) for filter components
- Seamless integration with Ant Design's Select components
- Support for both single-select and multi-select parameters
- Type-safe parameter access and updates
- Automatic URL-based state persistence with no additional code

## Installation

```bash
npm install querystate
```

## Usage

### Basic Example

```tsx
import { useQueryState } from 'querystate'
import { Select } from 'antd'

function FilterPanel() {
  // Define parameters and their types - no separate useState needed!
  const { category, setCategory, tags, setTags } = useQueryState({
    category: 'single',  // Single value parameter
    tags: 'array'        // Multi-value parameter
  })

  return (
    <div>
      {/* Single-select component */}
      <Select 
        placeholder="Select category"
        value={category}
        onChange={setCategory}
        options={[
          { value: '123e4567-e89b-12d3-a456-426614174000', label: 'Electronics' },
          { value: '223e4567-e89b-12d3-a456-426614174001', label: 'Books' }
        ]}
      />

      {/* Multi-select component */}
      <Select
        mode="multiple"
        placeholder="Select tags"
        value={tags}
        onChange={setTags}
        options={[
          { value: '523e4567-e89b-12d3-a456-426614174004', label: 'New' },
          { value: '623e4567-e89b-12d3-a456-426614174005', label: 'Sale' }
        ]}
      />
    </div>
  )
}
```

### URL Format

QueryState generates URL parameters that correctly represent both single and multiple values:

- Single values: `?category=123e4567-e89b-12d3-a456-426614174000`
- Multiple values: `?tags=523e4567-e89b-12d3-a456-426614174004&tags=623e4567-e89b-12d3-a456-426614174005`

This format ensures compatibility with server-side processing and proper bookmarking behavior.

## API Reference

### useQueryState

```tsx
function useQueryState<T extends ParamSchema>(schema: T): QueryStateResult<T>
```

#### Parameters

- `schema`: An object mapping parameter names to their types (`'single'` or `'array'`)

#### Returns

An object containing:
- A property for each parameter with its current value
    - `single` parameters return `string | undefined`
    - `array` parameters return `string[]` (empty array if no values)
- A setter function for each parameter with the naming convention `setParameterName`

## Why QueryState?

- **URL as State**: The URL itself becomes your state store, eliminating the need for separate React state
- **Automatic Persistence**: Filter selections are automatically preserved when sharing links, bookmarking pages, or refreshing
- **Reduced Boilerplate**: No need to write duplicate state management code or synchronization logic
- **Clean Type Interface**: Automatically handles the type differences between single and multi-select components
- **Optimized for Ant Design**: Works perfectly with Ant Design's Select components out of the box

## Requirements

- React 16.8+ (Hooks support)
- React Router 6+
- TypeScript 4.7+ (recommended)

## License

ISC
