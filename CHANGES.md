Version 3.1.2 -> 4.0.0

Breaking changes:

- Renamed `onDOMChange` to `render`.
- Rewritten core to TypeScript.
- Updated build tooling (webpack, sass).
- Split public and private fields, removed access to internal methods.
- Adjusted type definitions and validation signatures.
- Added getters `activeIndex`, `isBound`, `rootNode`.
- Methods `bind`, `unbind`, `destroy` and `render` are public, others are private now.

Migration notes:

- Replace all calls to `onDOMChange()` with `render()`.
