# Google Play Data Safety Answers

## Does the app collect data?

Answer:

- Limited user-entered data is handled for app functionality

Notes:

- receipt numbers may be entered by the user
- saved cases are stored locally on the device using AsyncStorage
- the app sends receipt-number lookups to your backend so it can request case status
- AI support messages are sent to your backend and then to the configured AI provider

## Does the app share data with third parties?

Answer:

- No advertising or marketing data sharing
- Operational requests are sent to backend and AI infrastructure only to provide app features

Notes:

- USCIS case lookup requests go through your backend
- AI support messages go through your backend to the configured AI provider
- no ad SDK is currently included

## Is data encrypted in transit?

Answer:

- Yes

Notes:

- production backend should be served over HTTPS on Render
- AI provider calls are made over HTTPS

## Can users delete their data?

Answer:

- Yes

Notes:

- users can delete saved cases from the app
- users can clear all saved cases
- uninstalling the app also removes locally stored app data on the device

## Data types involved

Likely answers for Play Console:

- Personal info: No direct personal identity required by default
- Messages: Yes, only if user sends AI support chat messages
- App activity: Not currently for analytics unless you later add analytics SDKs
- Device or other identifiers: Not intentionally collected by the app itself
- Financial info: No
- Health info: No
- Photos or files: No
- Location: No

## Suggested summary for Play Console

- data is used only for core app functionality
- data is not sold
- data is not used for advertising
- users can delete saved local data from inside the app
