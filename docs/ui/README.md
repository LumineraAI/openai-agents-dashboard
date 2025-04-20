# UI Overview

This document provides a comprehensive overview of the OpenAI Agents UI frontend architecture, design principles, and key components.

## UI Architecture

The OpenAI Agents UI is built using a modern frontend stack with React, TypeScript, and Material-UI (MUI). It follows a component-based architecture with Redux Toolkit for state management.

### Technology Stack

- **React**: A JavaScript library for building user interfaces
- **TypeScript**: A typed superset of JavaScript
- **Vite**: A build tool that provides faster and leaner development experience
- **Material-UI (MUI)**: A comprehensive React UI component library
- **Emotion**: A CSS-in-JS library used by MUI for styling
- **Redux Toolkit**: A state management library
- **React Router**: A routing library for React
- **React Query**: A data fetching and caching library
- **Vitest**: A testing framework

### Project Structure

```
agents-ui/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, fonts, etc.
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Common components
│   │   ├── agent-editor/    # Agent Editor components
│   │   ├── workflow-designer/ # Workflow Designer components
│   │   ├── execution-console/ # Execution Console components
│   │   └── trace-viewer/    # Trace Viewer components
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Layout components
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   │   ├── agents/          # Agent management pages
│   │   ├── workflows/       # Workflow management pages
│   │   ├── executions/      # Execution pages
│   │   └── traces/          # Trace pages
│   ├── services/            # API services
│   ├── store/               # Redux store
│   │   ├── slices/          # Redux slices
│   │   └── index.ts         # Store configuration
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts        # Vite environment types
├── .env                     # Environment variables
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── theme.ts                 # MUI theme configuration
├── tsconfig.json            # TypeScript configuration
└── # Vite configuration
```

### State Management

The application uses Redux Toolkit for global state management with the following slices:

- **agents**: Manages agent data and operations
- **workflows**: Manages workflow data and operations
- **executions**: Manages execution data and operations
- **traces**: Manages trace data and operations
- **auth**: Manages authentication state
- **ui**: Manages UI state (theme, sidebar, etc.)

### Routing

The application uses React Router for routing with the following main routes:

- `/`: Home page
- `/agents`: Agent management
- `/agents/new`: Create a new agent
- `/agents/:id`: View and edit an agent
- `/workflows`: Workflow management
- `/workflows/new`: Create a new workflow
- `/workflows/:id`: View and edit a workflow
- `/executions`: Execution history
- `/executions/:id`: View execution details
- `/traces/:id`: View trace details

### API Integration

The application communicates with the backend API using custom services built with Axios. The services are organized by resource:

- **agentService**: Manages agent-related API calls
- **workflowService**: Manages workflow-related API calls
- **executionService**: Manages execution-related API calls
- **traceService**: Manages trace-related API calls
- **authService**: Manages authentication-related API calls

## Design Principles

The UI follows these key design principles:

### 1. Component-Based Architecture

- Components are modular and reusable
- Each component has a single responsibility
- Components are organized by feature and function

### 2. Responsive Design

- The UI adapts to different screen sizes
- Responsive components with MUI's Grid system
- Breakpoint-based styling with MUI's useMediaQuery
- Consistent user experience across devices

### 3. Accessibility

- ARIA attributes for screen readers
- Keyboard navigation support
- Color contrast compliance
- Focus management

### 4. Performance Optimization

- Code splitting for faster initial load
- Lazy loading of components
- Memoization of expensive computations
- Efficient rendering with React.memo and useMemo

### 5. Consistent Design Language

- Consistent use of colors, typography, and spacing
- Centralized theme configuration
- Material-UI components for consistent look and feel
- Dark mode support with MUI's ThemeProvider with MUI's ThemeProvider

## Key Components

### 1. Agent Editor

The Agent Editor is a comprehensive interface for creating and editing agents. It includes the following features:

#### Basic Information Section
- Agent name and description
- Instructions editor with syntax highlighting
- Model selection and configuration

#### Tools Configuration
- Add, edit, and remove tools
- Configure tool parameters
- Test tools

#### Handoffs Configuration
- Add, edit, and remove handoff conditions
- Select target agents
- Configure handoff parameters

#### Guardrails Settings
- Content filter configuration
- Maximum turns configuration
- Safety settings

#### Validation and Error Handling
- Real-time validation
- Error messages
- Form submission handling

### 2. Workflow Designer

The Workflow Designer is a visual canvas for designing multi-agent workflows. It includes the following features:

#### Canvas
- Interactive canvas with zoom and pan
- Grid and snap-to-grid
- Mini-map for navigation

#### Node Management
- Drag-and-drop agent placement
- Node selection and movement
- Node configuration

#### Edge Management
- Connection creation between nodes
- Edge styling and labeling
- Handoff condition configuration

#### Workflow Testing
- Run workflow from the designer
- Visualize execution path
- Debug workflow issues

### 3. Execution Console

The Execution Console is a real-time interface for running agents and workflows. It includes the following features:

#### Chat Interface
- Message history
- User input
- Agent responses
- Markdown and code formatting

#### Tool Call Visualization
- Tool call details
- Tool call results
- Tool call errors

#### Handoff Visualization
- Handoff events
- Agent transitions
- Handoff conditions

#### Execution Metrics
- Token usage
- Response time
- Cost estimation

### 4. Trace Viewer

The Trace Viewer is a detailed interface for analyzing agent executions. It includes the following features:

#### Timeline Visualization
- Chronological view of events
- Event filtering
- Timeline zooming and panning

#### Event Details
- Message details
- Tool call details
- Handoff details
- Error details

#### Performance Metrics
- Token usage breakdown
- Response time analysis
- Cost analysis

#### Trace Comparison
- Compare multiple traces
- Highlight differences
- Performance comparison

## Theming and Styling

The UI uses Material-UI (MUI) for styling with Emotion CSS-in-JS. The theme is customizable through MUI's theming system through MUI's theming system with the following features:

### Color Scheme

- Primary: Blue (#9c27b0)
- Secondary: Purple (#9c27b0)
- Success: Green (#2e7d32)
- Warning: Amber (#ed6c02)
- Error: Red (#d32f2f)
- Info: Light Blue (#0288d1)
- Info: Light Blue (#0288d1)
- Background: White (#FFFFFF) / Dark (#1221212)
- Text: Dark (#212121) / Light (#f5f5f5)

### Typography

- Font Family: Roboto
- Base Size: 16px (1rem)
- Variants: h1, h2, h3, h4, h5, h6, subtitle1, subtitle2, body1, body2, button, caption, overl (1rem)
- Variants: h1, h2, h3, h4, h5, h6, subtitle1, subtitle2, body1, body2, button, caption, overline
- Weights: 300 (Light), 300 (Light), 400 (Regular), 700 (Bold)

### Spacing

- Base Unit: 8px (1 = 8px)
- Custom spacing can be applied using the theme.spacing() function
- Common values: 1 (8px), 2 (16px), 3 (24px), 4 (32px), etc.

### Breakpoints

- xs: 0px
- sm: 600px
- md: 900Custom spacing can be applied using the theme.spacing() function
- Common values: 1 (8px), 2 (16px), 3 (24px), 4 (32px), etc.

### Breakpoints

- xs: 0px
- sm: 600px
- md: 900px
- gg: 1200px
- l: 1536px

## Accessibility

The UI is designed to be accessible to all users, including those with disabilities. It follows the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.

### Keyboard Navigation

- All interactive elements are focusable
- Logical tab order
- Keyboard shortcuts for common actions
- Focus indicators

### Screen Reader Support

- Semantic HTML
- ARIA labels and descriptions
- Live regions for dynamic content
- Announcements for important events

### Color and Contrast

- Sufficient color contrast
- Color is not the only means of conveying information
- High contrast mode support

## Performance Considerations

The UI is optimized for performance with the following techniques:

### Code Splitting

- Route-based code splitting
- Component-based code splitting
- Dynamic imports

### Rendering Optimization

- Virtualized lists for large data sets
- Memoization of expensive computations
- Debouncing and throttling of frequent events

### Data Management

- Efficient data fetching with React Query
- Caching and invalidation strategies
- Optimistic updates

## Browser Compatibility

The UI is designed to work on modern browsers:

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Conclusion

The OpenAI Agents UI provides a comprehensive and user-friendly interface for creating, configuring, managing, and deploying AI agents. Its modern architecture, consistent design language, and focus on accessibility and performance make it a powerful tool for working with the OpenAI Agents SDK.