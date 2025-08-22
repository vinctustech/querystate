# Final Design for QueryState Library Rewrite

## Core Philosophy
1. **Schema errors throw** (developer mistakes at definition time)
2. **URL parsing never throws** (gracefully handle invalid user input)
3. **Zod-like API** (familiar patterns, order matters for constraints)
4. **Always makes sensible decisions** (clamp, default, or undefined)

## Complete Type System

### **5 Base Types**
```typescript
queryState.string()
queryState.number()
queryState.date()
queryState.boolean()
queryState.enum(['a', 'b', 'c'] as const)
```

### **3 Collection Types**
```typescript
.array()  // Variable length
.set()    // Unique values only
.tuple(n) // Fixed length
```

### **Constraints (Context-Aware)**
```typescript
// BEFORE collection = element constraints
// AFTER collection = collection constraints

queryState.number()
  .min(0)      // Each number >= 0
  .max(100)    // Each number <= 100
  .array()
  .min(1)      // Array length >= 1
  .max(10)     // Array length <= 10
```

### **All Available Methods**

#### **String Methods**
- `.min(n)` - Minimum character length
- `.max(n)` - Maximum character length
- `.lowercase()` - Convert to lowercase
- `.uppercase()` - Convert to uppercase
- `.email()` - Email validation
- `.url()` - URL validation
- `.uuid()` - UUID validation

#### **Number Methods**
- `.min(n)` - Minimum value
- `.max(n)` - Maximum value
- `.int()` - Round to integer
- `.positive()` - Must be > 0
- `.nonnegative()` - Must be >= 0
- `.negative()` - Must be < 0
- `.step(n)` - Round to nearest n

#### **Date Methods**
- `.min(date)` - Earliest date
- `.max(date)` - Latest date
- `.future()` - Must be after today
- `.past()` - Must be before today

#### **Boolean Methods**
- (No special methods, just `.default()`)

#### **Enum Methods**
- (No special methods, just `.default()`)

#### **Collection Methods (after .array()/.set())**
- `.min(n)` - Minimum items
- `.max(n)` - Maximum items

#### **Universal**
- `.default(value)` - Default when missing/invalid

## Complete API Examples

```typescript
const schema = {
  // --- STRINGS ---
  username: queryState.string().min(3).max(20).lowercase(),
  email: queryState.string().email().default('user@example.com'),
  uuid: queryState.string().uuid(),
  
  // String array
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
  
  // String set (unique tags)
  categories: queryState.string()
    .set()
    .min(1)
    .max(10),

  // --- NUMBERS ---
  age: queryState.number().int().min(0).max(120),
  price: queryState.number().min(0.01).step(0.01).default(9.99),
  
  // Number array
  scores: queryState.number()
    .min(0)          // Each score >= 0
    .max(100)        // Each score <= 100
    .int()
    .array()
    .min(1)          // At least 1 score
    .max(10),        // At most 10 scores
  
  // Number tuple (price range)
  priceRange: queryState.number()
    .min(0)
    .max(10000)
    .tuple(2)
    .default([0, 1000]),
  
  // Number set (selected IDs)
  selectedIds: queryState.number()
    .positive()
    .int()
    .set()
    .min(1)
    .max(20),

  // --- DATES ---
  startDate: queryState.date().future(),
  endDate: queryState.date()
    .min(new Date('2024-01-01'))
    .max(new Date('2024-12-31'))
    .default(new Date()),
  
  // Date array
  eventDates: queryState.date()
    .future()
    .array()
    .min(1)
    .max(10),
  
  // Date tuple (date range)
  dateRange: queryState.date()
    .tuple(2)
    .default([new Date(), new Date()]),

  // --- BOOLEANS ---
  darkMode: queryState.boolean().default(false),
  showSidebar: queryState.boolean(),

  // --- ENUMS ---
  theme: queryState.enum(['light', 'dark', 'auto'] as const).default('auto'),
  size: queryState.enum(['xs', 's', 'm', 'l', 'xl'] as const),
  
  // Enum set (multiple selections)
  permissions: queryState
    .enum(['read', 'write', 'delete', 'admin'] as const)
    .set()
    .min(1)
    .max(3),
}
```

## Invalid Value Handling

| Scenario | Behavior |
|----------|----------|
| Number out of range | Clamp to min/max |
| String too short/long | Use default or undefined |
| Invalid email/url/uuid | Use default or undefined |
| Invalid boolean ('maybe') | Use default or undefined |
| Enum value not in list | Use default or undefined |
| Array too short | Use default if it meets min, else undefined |
| Array too long | Truncate to max length |
| Tuple wrong size | Use default or pad with type defaults |
| Set with duplicates | Automatically deduplicate |
| Invalid date | Use default or undefined |
| Past date when .future() | Use default or undefined |

## Schema Validation (Throws Errors)

```typescript
// ❌ Default doesn't match tuple size
queryState.number().tuple(2).default([5])
// Error: Default must have exactly 2 elements

// ❌ Default violates constraints
queryState.number().min(10).max(100).default(5)
// Error: Default 5 is less than min 10

// ❌ Default not in enum
queryState.enum(['a', 'b'] as const).default('c')
// Error: Default 'c' not in enum values

// ❌ Invalid default email
queryState.string().email().default('not-email')
// Error: Default is not a valid email
```

## Architecture

### **File Structure**
```
src/
├── index.ts
├── useQueryState.ts (~150 lines)
├── builders/
│   ├── queryState.ts
│   ├── StringBuilder.ts
│   ├── NumberBuilder.ts
│   ├── DateBuilder.ts
│   ├── BooleanBuilder.ts
│   └── EnumBuilder.ts
├── handlers/
│   ├── base.ts
│   ├── [12 handler files]
├── types/
│   └── [type definitions]
└── utils/
    └── [parsing, validation]
```

### **Handler Types (15 total)**
1. StringHandler
2. StringArrayHandler
3. StringTupleHandler
4. StringSetHandler
5. NumberHandler
6. NumberArrayHandler
7. NumberTupleHandler
8. NumberSetHandler
9. DateHandler
10. DateArrayHandler
11. DateTupleHandler
12. DateSetHandler
13. BooleanHandler
14. EnumHandler
15. EnumSetHandler

## TypeScript Types

```typescript
// Perfect type inference
const { theme, setTheme } = useQueryState({
  theme: queryState.enum(['light', 'dark'] as const).default('light')
})
// theme: 'light' | 'dark' (never undefined due to default)
// setTheme: (value: 'light' | 'dark' | undefined) => void

const { scores, setScores } = useQueryState({
  scores: queryState.number().array()
})
// scores: number[]
// setScores: (value: number[] | undefined) => void
```

## Migration from Current API
- Remove `dayjs` dependency
- Remove `.dateDayjs()` and `.dateJs()` methods
- Everything else remains compatible
- Add new types: boolean, enum, string tuples, sets

This is our complete, final design. Ready for implementation!