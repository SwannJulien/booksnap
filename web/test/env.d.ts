/// <reference types="vite/client" />

// Kept local to test/ on purpose: tsconfig.json sets "types": [] so that the
// front is typed as browser code and nothing else. The test suite is the one
// place that legitimately needs Vite's ambient types, for import.meta.glob.
