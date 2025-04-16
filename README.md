# QueryState

A lightweight, type-safe React library for managing URL query parameters as application state, with robust handling of array parameters.

## Features

- **URL-Synchronized State** - Persist UI state directly in the URL without manual synchronization
- **Type-Safe API** - Fully TypeScript-compatible with intuitive types for values and setters
- **Chainable Configuration** - Fluent API for defining parameter types with defaults
- **Array Support** - First-class handling of multi-select components and array parameters
- **Default Values** - Optional defaults that automatically populate the URL when parameters are missing
- **React Router Integration** - Built on React Router's useSearchParams for seamless compatibility
- **Framework Agnostic** - Works with any UI component library that accepts string/array values

## Installation

```bash
npm install @vinctus/querystate react-router-dom
```

## Usage

### Basic Example

```tsx
import { useQueryState, queryState } from '@vinctus/querystate';
import { Select } from 'antd';

function FilterComponent() {
  const { category, setCategory, tags, setTags } = useQueryState({
    category: queryState.string(),              // Single value parameter
    tags: queryState.string().array()           // Multi-value parameter array
  });

  // Non-existent parameters without defaults will be `undefined`
  // Making them work seamlessly with controlled components

  return (
    <div>
      <Select
        placeholder="Select category"
        value={category}                        // `undefined` when not in URL
        onChange={setCategory}
        options={[
          { value: 'electronics', label: 'Electronics' },
          { value: 'books', label: 'Books' }
        ]}
      />

      <Select
        mode="multiple"
        placeholder="Select tags"
        value={tags}                           // Empty array when not in URL
        onChange={setTags}
        options={[
          { value: 'new', label: 'New' },
          { value: 'sale', label: 'Sale' }
        ]}
      />
    </div>
  );
}
```

### Default Values

```tsx
import { useQueryState, queryState } from '@vinctus/querystate';

function FiltersWithDefaults() {
  const { status, setPriority, priority } = useQueryState({
    status: queryState.string().default('active'),          // Single value with default
    priority: queryState.string().array().default(['medium']) // Array with default
  });

  // If URL has no status param, it will be set to 'active'
  // If URL has no priority param, it will be set to ['medium']
  // ...
}
```

## API Reference

### useQueryState

```tsx
function useQueryState<T extends Record<string, ParamConfig>>(
  schema: T
): QueryStateResult<T>
```

Creates state variables from URL query parameters and provides setters to update them.

#### Parameters

- `schema`: An object defining parameter configurations using the `queryState` builder API

#### Returns

An object containing:
- A property for each parameter key with its current value:
  - Single string parameters: `string | undefined` (undefined when not in URL)
  - Array parameters: `string[]` (empty array when not in URL)
- A setter function for each parameter with the naming pattern `setParameterName`

### queryState

The `queryState` object provides a chainable API for defining parameter types:

```tsx
// Single string parameter (will be undefined if not in URL)
queryState.string()

// Single string with default
queryState.string().default('defaultValue')

// Array parameter (will be [] if not in URL)
queryState.string().array()

// Array parameter with default values
queryState.string().array().default(['value1', 'value2'])
```

## URL Format

QueryState maintains proper URL formatting:

- Single values: `?category=electronics`
- Multiple values: `?tags=new&tags=sale`

This format ensures compatibility with server-side processing, browser history, and bookmarking.

## Parameter Behavior

- **String parameters without defaults**: Return `undefined` when not present in the URL
- **String parameters with defaults**: Return their default value when not in the URL
- **Array parameters without defaults**: Return an empty array `[]` when not in the URL
- **Array parameters with defaults**: Return their default array when not in the URL

This behavior makes the library work seamlessly with controlled form components that expect `undefined` for empty states.

## Why Use QueryState?

- **Simplifies State Management**: Eliminates duplicate state between URL and React components
- **Improves UX**: Enables shareable, bookmarkable filters and views through URL persistence
- **Type Safety**: Provides correct TypeScript types for single vs array parameters
- **UI Library Compatible**: Works with any component library that accepts string/array values
- **Consistent Parameter Handling**: Properly formats array parameters in the URL
- **Automatic Default Values**: Ensures sensible defaults without extra code

## Requirements

- React 16.8+ (for Hooks)
- React Router DOM 6.0+
- TypeScript 4.7+ (recommended)

## License

MIT