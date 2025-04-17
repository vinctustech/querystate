# QueryState

[![npm version](https://img.shields.io/npm/v/@vinctus/querystate.svg)](https://www.npmjs.com/package/@vinctus/querystate)
[![npm downloads](https://img.shields.io/npm/dm/@vinctus/querystate.svg)](https://www.npmjs.com/package/@vinctus/querystate)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.7%2B-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-16.8%2B-blue)](https://reactjs.org/)

A lightweight, type-safe React library for managing URL query parameters as application state, with robust handling of array parameters, number values, and fixed-length tuples.

## Features

- **URL-Synchronized State** - Persist UI state directly in the URL without manual synchronization
- **Type-Safe API** - Fully TypeScript-compatible with intuitive types for values and setters
- **Chainable Configuration** - Fluent API for defining parameter types with defaults
- **Array Support** - First-class handling of multi-select components and array parameters
- **Number Values** - Native support for numeric parameters with proper type conversion
- **Tuple Support** - Fixed-length arrays that maintain their structure (perfect for sliders, coordinates, colors)
- **Default Values** - Optional defaults that automatically populate the URL when parameters are missing
- **React Router Integration** - Built on React Router's useSearchParams for seamless compatibility
- **Framework Agnostic** - Works with any UI component library that accepts string/array values

## Installation

```bash
npm install @vinctus/querystate react-router-dom
```

## Basic Usage

```tsx
import { useQueryState, queryState } from '@vinctus/querystate';
import { Select, InputNumber, Slider } from 'antd';

function FilterComponent() {
  const {
    category, setCategory,        // String parameter (string | undefined)
    tags, setTags,                // String array (string[])
    page, setPage,                // Number parameter with default (number - never undefined)
    priceRange, setPriceRange     // Number tuple with default ([number, number] - never undefined)
  } = useQueryState({
    category: queryState.string(),
    tags: queryState.string().array(),
    page: queryState.number().default(1),
    priceRange: queryState.number().tuple(2).default([0, 100])
  });

  return (
          <div>
            <Select
                    placeholder="Select category"
                    value={category}  // May be undefined if not in URL
                    onChange={setCategory}
                    options={[
                      { value: 'electronics', label: 'Electronics' },
                      { value: 'books', label: 'Books' }
                    ]}
            />

            <Select
                    mode="multiple"
                    placeholder="Select tags"
                    value={tags}  // Empty array if not in URL, never undefined
                    onChange={setTags}
                    options={[
                      { value: 'new', label: 'New' },
                      { value: 'sale', label: 'Sale' }
                    ]}
            />

            <InputNumber
                    value={page}  // Always a number (default: 1), never undefined
                    onChange={setPage}
                    min={1}
            />

            <Slider
                    range
                    min={0}
                    max={1000}
                    value={priceRange}  // Always [number, number] (default: [0, 100]), never undefined
                    onChange={setPriceRange}
            />
          </div>
  );
}
```

## Parameter Types

Here's what each parameter type returns based on whether it has a default value:

### String Parameters

```tsx
// Without default: string | undefined
const { name, setName } = useQueryState({
  name: queryState.string()
});
// name: string | undefined

// With default: string (never undefined)
const { status, setStatus } = useQueryState({
  status: queryState.string().default('active')
});
// status: string
```

### Array Parameters

```tsx
// Array without default: always returns [] when not in URL (never undefined)
const { tags, setTags } = useQueryState({
  tags: queryState.string().array()
});
// tags: string[]

// Array with default: uses default values when not in URL
const { priority, setPriority } = useQueryState({
  priority: queryState.string().array().default(['medium'])
});
// priority: string[]
```

### Number Parameters

```tsx
// Without default: number | undefined
const { id, setId } = useQueryState({
  id: queryState.number()
});
// id: number | undefined

// With default: number (never undefined)
const { page, setPage } = useQueryState({
  page: queryState.number().default(1)
});
// page: number
```

### Tuple Parameters

```tsx
// Tuples are always fixed-length and never undefined
const { priceRange, setPriceRange } = useQueryState({
  priceRange: queryState.number().tuple(2).default([0, 100])
});
// priceRange: [number, number]

// Without an explicit default, tuples will use zeros as the default
const { coordinates, setCoordinates } = useQueryState({
  coordinates: queryState.number().tuple(2)
});
// coordinates: [number, number] (defaults to [0, 0] if not in URL)
```

## Type Safety Benefits

Understanding the type behavior of QueryState has important implications for your application code:

### 1. No Nullability Checks Needed for Defaults

When you provide a default value, you don't need optional chaining or nullability checks:

```tsx
// With default - no need for optional chaining or nullability checks
const { page } = useQueryState({
  page: queryState.number().default(1)
});

// Safe to use directly - will never be undefined
const nextPage = page + 1;
```

### 2. Proper Type Guards for Non-Default Values

For parameters without defaults, use proper type guards:

```tsx
const { category } = useQueryState({
  category: queryState.string()
});

// Need to check for undefined
if (category) {
  // Safe to use category as string here
  console.log(category.toUpperCase());
}
```

### 3. Arrays and Tuples Are Always Available

Array parameters (both with and without defaults) are never undefined:

```tsx
const { tags, coordinates } = useQueryState({
  tags: queryState.string().array(),
  coordinates: queryState.number().tuple(2)
});

// Safe to use array methods directly
const hasSaleTag = tags.includes('sale');

// Safe to access tuple elements directly
const [x, y] = coordinates;
```

## Working with Tuples vs Arrays

### Variable-Length Arrays

Array parameters are variable-length and can be empty:
- The URL might show `?scores=85&scores=92&scores=78` for multiple values
- If all values are removed, the parameter disappears from the URL
- Arrays provide flexibility when the number of items can vary

```tsx
// Array can have any number of items (including zero)
const { productIds, setProductIds } = useQueryState({
  productIds: queryState.number().array()
});

// Adding/removing elements
setProductIds([...productIds, 1005]);  // Add a value
setProductIds(productIds.filter(id => id !== 1002));  // Remove a value
setProductIds([]);  // Clear all values
```

### Fixed-Length Tuples

Tuple parameters always maintain exactly the specified number of elements:
- The URL for a color might show `?rgbColor=255&rgbColor=128&rgbColor=0`
- If some values are manually removed from the URL, they're restored with defaults
- Perfect for parameters that require a specific structure (coordinates, ranges, colors)

```tsx
// Tuple always has exactly 2 elements
const { priceRange, setPriceRange } = useQueryState({
  priceRange: queryState.number().tuple(2).default([0, 100])
});

// Modifying just one element
const newRange = [...priceRange];
newRange[0] = 25;  // Update min value
setPriceRange(newRange);
```

## Why Use QueryState?

- **Simplifies State Management**: Eliminates duplicate state between URL and React components
- **Improves UX**: Enables shareable, bookmarkable filters and views through URL persistence
- **Type Safety**: Provides correct TypeScript types for parameters (strings, numbers, arrays, tuples)
- **UI Library Compatible**: Works with any component library including Ant Design, MUI, etc.
- **Consistent Parameter Handling**: Properly formats array parameters in the URL
- **Automatic Default Values**: Ensures sensible defaults without extra code
- **Structure Preservation**: Tuples maintain their structure even with URL manipulation

## URL Format Examples

QueryState maintains proper URL formatting:

- Single string: `?category=electronics`
- Single number: `?page=3`
- String array: `?tags=new&tags=sale`
- Number array: `?scores=85&scores=92&scores=78`
- Number tuple: `?priceRange=10&priceRange=90`

This format ensures compatibility with server-side processing, browser history, and bookmarking.

## Requirements

- React 16.8+ (for Hooks)
- React Router DOM 6.0+
- TypeScript 4.7+ (recommended)

## License

ISC