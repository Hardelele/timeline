# Interactive Vertical Timeline

Interactive vertical timeline built with React + Konva featuring zoom and drag functionality.

## Features

- **Interactive Timeline**: Vertical timeline with smooth zoom and drag capabilities
- **Time Scale**: Supports time intervals from seconds to millennia
- **Responsive Design**: Adapts to different screen sizes
- **Smooth Animations**: Built with Konva for high-performance rendering
- **Customizable**: Configurable props for styling and behavior

## Technology Stack

- React 19
- TypeScript
- Konva + React-Konva
- Zustand (State Management)
- Vite (Build Tool)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Hardelele/timeline.git
cd timeline
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

The timeline component can be used as a standalone component or integrated into larger applications:

```tsx
import { Timeline } from './timeline';

function App() {
  return (
    <Timeline
      width={800}
      height={600}
      backgroundColor="#f5f5f5"
      showAxes={true}
      showTimeScale={true}
      onZoom={(delta) => console.log('Zoom:', delta)}
      onOffsetChange={(offset) => console.log('Offset:', offset)}
    />
  );
}
```

## Controls

- **Mouse Wheel**: Zoom in/out
- **Click and Drag**: Pan the timeline vertically
- **Automatic Scale**: Time intervals automatically adjust based on zoom level

## Project Structure

```
src/
├── components/
│   └── timeline/          # Timeline components
├── hooks/                 # Custom React hooks
├── services/              # Business logic services
├── stores/                # Zustand state management
├── constants/             # Application constants
└── pages/                 # Page components
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
