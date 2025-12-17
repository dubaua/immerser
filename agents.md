# AGENTS.md

## Tests

- Every test block uses `it('...')`.
- One data scenario per `it`. Only exception: checking multiple fields on the _same_ return value.

## Docs & comments

- Add JSDoc only when a function has non-trivial logic _and_ sits in a shared/standalone module.
- Skip JSDoc for reducers, selectors, event handlers, or simple wrappers.
- Comments explain **why** something happens, never restate the code.

## Code clarity

- No inline “this does that” comments.
- Avoid readability cleanups that do not change behaviour.

## Naming

- All interfaces start with `I...`.

## Obey explicit commands

- Never refactor, rename, or change signatures unless the user says so.
- When asked to move a function, copy it exactly—same name, signature, and body.
- No structural or stylistic edits (imports, ordering, formatting) unless told to.
- Never alter formatting mid-file. Repeat the existing pattern.
- All “improvements” require direct user approval.

## Check for this is followed

Each your answer start with "Honk" word as if you were a goose.
