# UI Overview

This document provides a comprehensive overview of the OpenAI Agents UI frontend architecture, design principles, and key components.

## UI Architecture

The OpenAI Agents UI is built using a modern frontend stack with React, TypeScript, and Shadcn/UI with Tailwind CSS. It follows a component-based architecture with Redux Toolkit for state management.

### Technology Stack

- **React**: A JavaScript library for building user interfaces
- **TypeScript**: A typed superset of JavaScript
- **Vite**: A build tool that provides faster and leaner development experience
- **Shadcn/UI**: A collection of reusable UI components
- **Tailwind CSS**: A utility-first CSS framework
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
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
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
- Mobile-first approach with Tailwind CSS
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
- Reusable design tokens
- Shadcn/UI components for consistent look and feel
- Dark mode support

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

The UI uses Tailwind CSS for styling with Shadcn/UI components. The theme is customizable with the following features:

### Color Scheme

- Primary: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Accent: Purple (#8B5CF6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)
- Background: White (#FFFFFF) / Dark (#111827)
- Text: Black (#111827) / White (#F9FAFB)

### Typography

- Font Family: Inter
- Base Size: 16px
- Scale: 1.25 (Major Third)
- Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### Spacing

- Base Unit: 4px
- Scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128

### Breakpoints

- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

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