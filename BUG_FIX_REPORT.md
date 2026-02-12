# Bug Fix Report: Invalid Hook Call in CreateEventDialog

## Issue
The application was crashing with `Error: Invalid hook call. Hooks can only be called inside of the body of a function component.`
This was caused by calling `useGetTemplateById` (a React Hook) inside the `handleSubmit` function, which is a violation of the Rules of Hooks.

## Fix
1. Moved `useGetTemplateById(1)` to the top level of the `CreateEventDialog` component.
2. Updated the `handleSubmit` logic to use the data returned by the hook hook (`templateData`).
3. Switched `useCreateTemplate` to use `mutateAsync` so we can `await` the template creation if it's missing.
4. Added async/await to `handleSubmit` to handle the template creation flow correctly.
