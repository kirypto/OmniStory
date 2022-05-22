# OmniStory

OmniStory is a work in progress web application designed to work with
the [Timeline Tracker API](https://github.com/kirypto/TimelineTracker).

[License Available Here](LICENSE.txt)

## Development Notes

_At some point this will be moved into another markdown file._

- The TTAPI Schema _(located at `src/app/timeline-tracker-api/ttapi-schema.ts`)_ is generated using
  `openapi-typescript` using the following command:
  ```
  npx openapi-typescript .\src\assets\ttapi-specification\apiSpecification.json --output .\src\app\timeline-tracker-api\ttapi-schema.ts
  ```
