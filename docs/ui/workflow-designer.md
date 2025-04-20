# Workflow Designer

This document provides detailed specifications for the Workflow Designer component of the OpenAI Agents UI.

## Overview

The Workflow Designer is a visual canvas for designing multi-agent workflows. It allows users to create complex workflows by connecting multiple agents with handoff conditions, enabling sophisticated agent collaboration patterns.

## User Interface

The Workflow Designer consists of several key areas:

### 1. Canvas

![Workflow Designer Canvas](../assets/workflow-designer-canvas.png)

The canvas is the main area where users design workflows. It includes:

- **Grid**: A background grid for alignment
- **Nodes**: Visual representations of agents
- **Edges**: Connections between agents representing handoffs
- **Selection**: Ability to select and manipulate nodes and edges
- **Zoom and Pan**: Controls for navigating the canvas

### 2. Toolbar

![Workflow Designer Toolbar](../assets/workflow-designer-toolbar.png)

The toolbar provides access to common actions:

- **Save**: Save the current workflow
- **Undo/Redo**: Undo or redo actions
- **Delete**: Delete selected elements
- **Zoom Controls**: Zoom in, zoom out, fit view
- **Run**: Run the workflow
- **Export**: Export the workflow as an image or JSON

### 3. Sidebar

![Workflow Designer Sidebar](../assets/workflow-designer-sidebar.png)

The sidebar provides access to workflow components and properties:

#### Agents Panel
- List of available agents
- Search and filter options
- Drag-and-drop functionality to add agents to the canvas

#### Properties Panel
- Properties of the selected element (node or edge)
- For nodes: Agent details and configuration
- For edges: Handoff condition and configuration

### 4. Mini-map

![Workflow Designer Mini-map](../assets/workflow-designer-minimap.png)

The mini-map provides an overview of the entire workflow:

- **Viewport**: Shows the current view area
- **Navigation**: Click to navigate to a specific area
- **Toggle**: Option to show/hide the mini-map

## Component Architecture

The Workflow Designer is built using a modular component architecture:

```
WorkflowDesigner
├── WorkflowDesignerHeader
├── WorkflowDesignerToolbar
├── WorkflowDesignerCanvas
│   ├── Grid
│   ├── Nodes
│   │   └── AgentNode
│   ├── Edges
│   │   └── HandoffEdge
│   ├── SelectionArea
│   └── ContextMenu
├── WorkflowDesignerSidebar
│   ├── AgentsPanel
│   │   ├── AgentSearch
│   │   └── AgentList
│   │       └── AgentItem
│   └── PropertiesPanel
│       ├── NodeProperties
│       │   └── AgentProperties
│       └── EdgeProperties
│           └── HandoffProperties
└── WorkflowDesignerMinimap
```

## State Management

The Workflow Designer uses Redux for state management with the following slice:

```typescript
interface WorkflowDesignerState {
  workflow: Workflow | null;
  availableAgents: Agent[];
  selectedElements: {
    nodes: string[];
    edges: string[];
  };
  isLoading: boolean;
  isSaving: boolean;
  history: {
    past: Workflow[];
    future: Workflow[];
  };
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  isDirty: boolean;
}

interface Workflow {
  id?: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}

interface Node {
  id: string;
  type: 'agent';
  agentId: string;
  position: {
    x: number;
    y: number;
  };
  data?: Record<string, any>;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type: 'handoff';
  condition: string;
  data?: Record<string, any>;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  // Other agent properties
}
```

## Canvas Interactions

The Workflow Designer supports a rich set of canvas interactions:

### Node Interactions

- **Add Node**: Drag an agent from the sidebar to the canvas
- **Select Node**: Click on a node to select it
- **Multi-select Nodes**: Hold Shift and click on nodes, or drag a selection area
- **Move Node**: Drag a selected node to a new position
- **Delete Node**: Select a node and press Delete or use the toolbar
- **Copy/Paste Node**: Use keyboard shortcuts or context menu

### Edge Interactions

- **Create Edge**: Click and drag from a node's output handle to another node's input handle
- **Select Edge**: Click on an edge to select it
- **Delete Edge**: Select an edge and press Delete or use the toolbar
- **Edit Edge**: Double-click on an edge to edit its properties

### Canvas Navigation

- **Pan**: Drag the canvas background or use middle mouse button
- **Zoom**: Use mouse wheel, pinch gesture, or zoom controls
- **Fit View**: Automatically adjust the view to show all elements
- **Center Selection**: Center the view on the selected elements

## Workflow Validation

The Workflow Designer implements validation to ensure that workflows are valid:

### Node Validation

- Each node must represent a valid agent
- Nodes must have unique IDs
- Nodes must have valid positions

### Edge Validation

- Edges must connect existing nodes
- Edges must have a source and target
- Edges must have a condition
- No circular references are allowed

### Workflow Validation

- Workflow must have a name
- Workflow must have at least one node
- Workflow must have a valid entry point
- All paths must lead to a valid end point

## Error Handling

The Workflow Designer handles errors in the following ways:

- **Validation Errors**: Displayed inline with visual indicators on the canvas
- **API Errors**: Displayed in a toast notification
- **Network Errors**: Displayed in a toast notification with retry option

## Accessibility

The Workflow Designer is designed to be accessible with the following features:

- Keyboard navigation for all interactions
- Screen reader support for canvas elements
- High contrast mode
- Zoom controls for visibility
- Alternative text for visual elements

## Responsive Design

The Workflow Designer adapts to different screen sizes:

- **Desktop**: Full layout with all features
- **Tablet**: Collapsible sidebar and adjusted controls
- **Mobile**: Simplified view with essential features

## Implementation Details

### Canvas Implementation

The canvas is implemented using React Flow, a library for building node-based editors and interactive diagrams:

- Custom node and edge components
- Custom handles for connections
- Custom controls and mini-map
- Integration with Redux for state management

### Drag and Drop

The drag and drop functionality is implemented using React DnD:

- Draggable agent items in the sidebar
- Drop targets on the canvas
- Visual feedback during drag operations
- Position calculation for dropped elements

### Handoff Condition Editor

The handoff condition editor provides a user-friendly interface for defining conditions:

- Simple text input for basic conditions
- Visual condition builder for complex conditions
- Syntax highlighting for condition expressions
- Validation and error checking

## API Integration

The Workflow Designer integrates with the backend API using the following endpoints:

- `GET /api/v1/workflows/{id}`: Get an existing workflow
- `POST /api/v1/workflows`: Create a new workflow
- `PUT /api/v1/workflows/{id}`: Update an existing workflow
- `DELETE /api/v1/workflows/{id}`: Delete a workflow
- `GET /api/v1/agents`: Get available agents
- `POST /api/v1/workflows/{id}/run`: Run a workflow

## Performance Considerations

The Workflow Designer is optimized for performance with the following techniques:

- Virtualization for large workflows
- Lazy loading of node details
- Throttled updates during drag operations
- Efficient rendering with React.memo
- Canvas rendering optimizations

## Workflow Execution

The Workflow Designer allows users to execute workflows directly from the design interface:

### Execution Process

1. User clicks the Run button
2. System validates the workflow
3. System displays an input dialog for the initial message
4. User enters the initial message
5. System starts the workflow execution
6. System opens the Execution Console to show the execution progress
7. System highlights the active node in the workflow designer

### Execution Visualization

During execution, the Workflow Designer provides visual feedback:

- Active node highlighting
- Animated edges for active handoffs
- Status indicators for completed nodes
- Error indicators for failed nodes

## Collaboration Features

The Workflow Designer supports collaborative workflow design:

- Real-time updates for multiple users
- User presence indicators
- Change history and versioning
- Comments and annotations

## Export and Import

The Workflow Designer supports exporting and importing workflows:

### Export Formats

- **JSON**: Complete workflow definition
- **PNG/SVG**: Visual representation of the workflow
- **PDF**: Documentation of the workflow

### Import Options

- **JSON**: Import a workflow definition
- **Template**: Start from a predefined template
- **Example**: Load an example workflow

## Future Enhancements

Planned enhancements for the Workflow Designer include:

- **Workflow Templates**: Library of reusable workflow templates
- **Conditional Branching**: More advanced branching logic
- **Parallel Execution**: Support for parallel agent execution
- **Subworkflows**: Nested workflows for complex scenarios
- **Analytics Integration**: Performance metrics and optimization suggestions

## Conclusion

The Workflow Designer is a powerful and intuitive interface for designing multi-agent workflows. Its visual approach makes it easy for users to create complex agent collaboration patterns, while its validation and execution features ensure that workflows are both valid and effective.