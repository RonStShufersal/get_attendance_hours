# Attendance Automation Tool for Shufersal

## Overview

This project automates the process of filling in your attendance hours. It scrapes the attendance data from Synerion and submits it to your desired system. It uses Puppeteer for browser automation and is designed to streamline attendance management.

## Features

- Scrapes attendance data from Synerion's web interface.
- Submits attendance data to your desired system (current support is for Attenix only).
- Supports minimal error handling.

## Installation

Clone the repository and install dependencies:

```bash
git clone git@github.com:RonStShufersal/get_attendance_hours.git
cd get_attendance_hours
npm install
```

## Setup

1. Create a .env file in the root of the project with the following variables:

```bash
ATTENIX_USERNAME=<your_attenix_username>
ATTENIX_PASSWORD=<your_attenix_password>
```

2. (Optional) Ensure that Docker is running if you are using Puppeteer with a Dockerized Chromium instance.

## Usage

Start the browser and scrape attendance data

```bash
npm run serve
```

Run the automation script

```bash
npm start
```

The script currently supports Synerion and Attenix but is designed to accommodate additional platforms in the future.

## Development

### Scripts

- **Build**: Compile the TypeScript code.

```bash
npm run build
```

- **Lint**: Run ESLint to fix code issues.

```bash
npm run lint
```

- **Test**: Run browser-based tests using Vitest.

```bash
npm run test:browser
```

#### Debugging

Launch the project in debug mode using the provided VS Code configuration. Open `.vscode/launch.json` for details.

### Project Structure

- `src/`: Contains the main source code.

  - `scrapers/`: Logic for scraping attendance data from Synerion.
  - `submitters/`: Logic for submitting data to Attenix.
  - `util/`: Utility functions for form handling, date formatting, and type checks.
  - `errors/`: Custom error classes for better error handling.
  - `types/`: Type definitions for Synerion and Attenix data structures.

- `vitest-example`: Example test files for browser-based testing.

### Future Plans

- Add support for additional attendance platforms.
- Enhance error handling and reporting.
- Improve scalability and modularity for easier integration of new platforms.

### License

This project is licensed under the [MIT License](LICENSE).

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
