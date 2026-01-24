# Shufersal attendance scraper and synchronizer.

Automatically scrape attendance hours and sync them.

## Features

- **Multi-source scraping**: Extensible scraper architecture for multiple attendance systems
- **Multi-target automation**: Flexible automation engine for various time-tracking platforms
- **Day modifiers**: Support for vacation days and other time-off modifiers
- **Pluggable architecture**: Easy to add new scrapers and automation targets

## Installation

```bash
git clone git@github.com:RonStShufersal/attendance-sync.git
cd attendance-sync
npm install
```

## Configuration

Create a `.env` file in the root directory with the following:

```env
SCRAPING_TARGET=hilan          # Attendance system to scrape from
AUTOMATION_TARGET=webtime      # Time-tracking platform to sync to
```

### Supported Targets

**Scraping Sources:**

- `hilan` - Hilan attendance system
- `synerion` - Synerion platform

**Automation Targets:**

- `webtime` - Webtime time-tracking

### Required Credentials

Credentials for your selected targets should be provided in the `.env` file:

```env
HILAN_USERNAME=your_username
HILAN_PASSWORD=your_password
WEBTIME_USERNAME=your_username
WEBTIME_PASSWORD=your_password
```

## Usage

### Run full automation

Scrape from Hilan and sync to Webtime:

```bash
npm start
```

### Development

Build the project:

```bash
npm run build
```

Run tests:

```bash
npm run test:browser
```

Lint code:

```bash
npm run lint
```

## License

MIT
