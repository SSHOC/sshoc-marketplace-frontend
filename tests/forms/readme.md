# Final Form upgrade baseline

Run `pnpm test` for the backend-independent baseline, or `pnpm test:watch` while working.
Tests use the real shared form controls, React bindings, array bindings, mutators, validation
adapter, error-focus decorator, and review metadata hook. They use synthetic data and do not
read `.env.local` or contact a backend.

Coverage:

- Add, edit, reorder, remove, and submit nested array entries.
- Required and URL validation, translated errors, correction, and focus on the first invalid field.
- Pending submission disables fields and buttons; failure preserves edits and exposes the error.
- Successful save followed by reinitialization establishes a pristine baseline.
- Background reinitialization updates untouched fields while retaining dirty edits.
- Approve/reject review metadata and set touched state through the configured mutators.
- Conditional field unmount/remount, explicit null values, and submitted values.
- Date review controls register against their date fields rather than the item label.
- Query serialization preserves arrays, zero, and false; signed-out requests omit authorization.
- Unregistration during field notification and completion of pending field validation after removal.

## Compatibility patches for the upgraded packages

- `final-form@5.0.1`: retains our defensive missing-field notification guard and corrects the
  `pauseValidation(preventNotification)` declaration. The upstream release still needs both.
- `react-final-form@7.0.1`: preserves a stored edited value when a conditional field remounts,
  instead of resetting it to the original initial value.
- `react-final-form-arrays@5.0.0`: restores generic declarations and the omitted `fields.update`
  signature. Array runtime code is unchanged.
- `final-form-focus@2.0.0`: points ESM imports to the ESM distribution and restores focusing only
  after submission, including unsuccessful submissions without changed validation errors.

These are upstream compatibility fixes, not relaxed test expectations. Keep the remount, focus,
array-update, and unregistration checks when evaluating future releases or removing patches.

## Local backend browser baseline

Run `pnpm test:e2e` with `E2E_USERNAME` and `E2E_PASSWORD` set to a local moderator account.
The suite starts its own frontend at `http://127.0.0.1:3117` and uses the backend at
`http://localhost:8080`. API calls to other origins are rejected. Credentials are supplied at
runtime; the tests do not save browser authentication state in the repository.

The Playwright test signs in, checks virtualized select keyboard navigation and async combo-box
empty/results states, virtualized pagination and loading-more feedback, checks required and URL errors and focus, adds/edits/removes URL fields,
simulates a server save failure, retries, then reloads and edits the saved dataset. It also checks
loading, error, and success toasts and dismissing an error toast. Pagination uses a controlled local
response with two pages; those synthetic actors are removed before saving. The component suite
also checks that required combo boxes retain a named editable input for Final Form's error focus.
It creates a clearly named disposable dataset in the local backend and retains it for inspection.
The created ID is attached to the test result. Reordering and review mutators are covered by
the component suite; the browser flow currently exercises dataset creation and editing only.

Run both suites against the current dependencies before upgrading, and again afterwards.
Review the Final Form patch and compare type diagnostics against the existing baseline.
