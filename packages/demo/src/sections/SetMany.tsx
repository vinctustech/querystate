import { qs, useQueryState } from '@vinctus/querystate'

export function SetMany() {
  const { page, setPage, role, setRole, storeId, setStoreId, tab, setTab, setMany } = useQueryState(
    {
      page: qs.number().default(1),
      role: qs.string().enum(['DISPATCHER', 'DRIVER', 'ADMIN', 'OWNER', 'BILLING']),
      storeId: qs.string(),
      tab: qs.string().enum(['active', 'deactivated']).default('active'),
    },
  )

  const buttonStyle = {
    padding: '8px 16px',
    margin: '4px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#1890ff',
    color: '#fff',
    fontSize: '14px',
  }

  const dangerButtonStyle = { ...buttonStyle, backgroundColor: '#cf1322' }
  const successButtonStyle = { ...buttonStyle, backgroundColor: '#389e0d' }

  const displayValue = (value: unknown) => {
    if (value === undefined) {
      return <span style={{ color: '#888', fontStyle: 'italic' }}>undefined</span>
    }
    return <span style={{ color: '#52c41a' }}>{JSON.stringify(value)}</span>
  }

  return (
    <div style={{ color: 'white', padding: '20px', fontFamily: 'monospace' }}>
      <h2>setMany — Batched Multi-Key Setter</h2>
      <p style={{ color: '#aaa', maxWidth: 720 }}>
        Calling two individual setters synchronously fails because each setter rebuilds the URL
        from the same stale snapshot of <code>searchParams</code>; the second call overwrites the
        first. <code>setMany</code> applies every update in one <code>setSearchParams</code> call,
        so cross-key changes compose correctly.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <h3>Current state</h3>
        <p>page: {displayValue(page)}</p>
        <p>role: {displayValue(role)}</p>
        <p>storeId: {displayValue(storeId)}</p>
        <p>tab: {displayValue(tab)}</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Seed state for the test</h3>
        <button style={buttonStyle} onClick={() => setPage(3)}>
          setPage(3)
        </button>
        <button style={buttonStyle} onClick={() => setRole(undefined)}>
          Clear role
        </button>
        <button style={buttonStyle} onClick={() => setStoreId(undefined)}>
          Clear storeId
        </button>
        <button style={buttonStyle} onClick={() => setTab('active')}>
          setTab('active')
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Broken pattern — two synchronous setters</h3>
        <p style={{ color: '#aaa' }}>
          After seeding page=3, click below. Expected naively: page=1, role=ADMIN. Actual: page=3,
          role=ADMIN — the second call clobbers the first because both used the same stale
          searchParams snapshot.
        </p>
        <button
          style={dangerButtonStyle}
          onClick={() => {
            setPage(1)
            setRole('ADMIN')
          }}
        >
          setPage(1); setRole('ADMIN') — BROKEN
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Fixed pattern — setMany</h3>
        <p style={{ color: '#aaa' }}>
          After seeding page=3, click below. Result: page=1 AND role=ADMIN in a single URL update.
        </p>
        <button
          style={successButtonStyle}
          onClick={() => setMany({ page: 1, role: 'ADMIN' })}
        >
          setMany({'{'} page: 1, role: 'ADMIN' {'}'})
        </button>
        <button
          style={successButtonStyle}
          onClick={() => setMany({ page: 1, storeId: 'store-42', tab: 'deactivated' })}
        >
          setMany({'{'} page: 1, storeId: 'store-42', tab: 'deactivated' {'}'})
        </button>
        <button
          style={successButtonStyle}
          onClick={() => setMany({ page: 1, role: undefined, storeId: undefined })}
        >
          setMany — clear role + storeId, reset page
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Edge cases</h3>
        <button
          style={buttonStyle}
          onClick={() => setMany({})}
        >
          setMany({'{}'}) — no changes (URL still normalized)
        </button>
        <button
          style={buttonStyle}
          onClick={() =>
            (setMany as (u: Record<string, unknown>) => void)({
              unknownKey: 'ignored',
              page: 2,
            })
          }
        >
          setMany with unknown key (silently ignored, page still updates)
        </button>
      </div>

      <div
        style={{
          marginTop: '30px',
          padding: '16px',
          backgroundColor: '#262626',
          borderRadius: '6px',
        }}
      >
        <h3>Current URL</h3>
        <p>{window.location.search || '(empty)'}</p>
      </div>
    </div>
  )
}
