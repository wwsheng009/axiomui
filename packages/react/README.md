# @axiomui/react

React component library for AxiomUI.

## Installation

```bash
npm install @axiomui/react @axiomui/tokens
```

`@axiomui/react` declares `react` and `react-dom` as peer dependencies.

## Usage

Import the shared styles once in your application entry:

```ts
import "@axiomui/react/styles.css";
```

Then import the components you need:

```tsx
import { Button } from "@axiomui/react";

export function Example() {
  return <Button>Save</Button>;
}
```

## Package Notes

- Distributed as ESM
- Type declarations are published under `dist/types`
- Requires the companion `@axiomui/tokens` package for design token styles

## Repository

- Source: https://github.com/wwsheng009/axiomui/tree/main/packages/react
- Issue tracker: https://github.com/wwsheng009/axiomui/issues
