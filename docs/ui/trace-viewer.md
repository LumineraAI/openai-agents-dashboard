# Trace Viewer

This document provides detailed specifications for the Trace Viewer component of the OpenAI Agents UI.

## Overview

The Trace Viewer is a detailed interface for analyzing agent executions. It provides a comprehensive view of execution traces, including timeline visualization, event details, tool call inspection, handoff inspection, and performance metrics.

## User Interface

The Trace Viewer consists of several key areas:

### 1. Timeline Visualization

![Trace Viewer Timeline](../assets/trace-viewer-timeline.png)

The timeline visualization shows the chronological sequence of events:

- **Event Timeline**: Horizontal timeline of all events
  - Message events
  - Tool call events
  - Handoff events
  - Error events
- **Time Scale**: Adjustable time scale with zoom controls
- **Event Filtering**: Filter events by type, agent, or other criteria
- **Event Grouping**: Group events by agent, tool, or other criteria
- **Timeline Navigation**: Scroll, zoom, and jump to specific points

### 2. Event Details

![Trace Viewer Event Details](../assets/trace-viewer-event-details.png)

The event details panel shows information about the selected event:

- **Event Type**: Type of the selected event
- **Timestamp**: When the event occurred
- **Duration**: How long the event took
- **Agent**: Which agent was involved
- **Content**: Detailed content of the event
- **Context**: Contextual information about the event

### 3. Tool Call Inspector

![Trace Viewer Tool Call Inspector](../assets/trace-viewer-tool-inspector.png)

The tool call inspector provides detailed information about tool calls:

- **Tool Information**: Name, description, and type of the tool
- **Input Parameters**: Parameters passed to the tool
- **Output Results**: Results returned by the tool
- **Execution Details**: Duration, status, and errors
- **Call Stack**: Context of the tool call in the execution

### 4. Handoff Inspector

![Trace Viewer Handoff Inspector](../assets/trace-viewer-handoff-inspector.png)

The handoff inspector shows details about agent handoffs:

- **Source Agent**: Agent that initiated the handoff
- **Target Agent**: Agent that received the handoff
- **Handoff Condition**: Condition that triggered the handoff
- **Context Transfer**: Information passed between agents
- **Timing Information**: When the handoff occurred

### 5. Performance Metrics

![Trace Viewer Performance Metrics](../assets/trace-viewer-metrics.png)

The performance metrics panel displays execution statistics:

- **Token Usage**: Detailed breakdown of token usage
  - By agent
  - By message type
  - By tool call
- **Response Times**: Analysis of response times
  - Average, minimum, and maximum
  - Distribution chart
- **Cost Analysis**: Breakdown of execution costs
  - By agent
  - By model
  - By component
- **Execution Flow**: Sankey diagram of execution flow

### 6. Trace Comparison

![Trace Viewer Comparison](../assets/trace-viewer-comparison.png)

The trace comparison feature allows comparing multiple traces:

- **Side-by-side View**: Compare two traces side by side
- **Difference Highlighting**: Highlight differences between traces
- **Metric Comparison**: Compare performance metrics
- **Timeline Alignment**: Align timelines for easier comparison

## Component Architecture

The Trace Viewer is built using a modular component architecture:

```
TraceViewer
├── TraceViewerHeader
├── TraceViewerLayout
│   ├── TimelinePanel
│   │   ├── TimelineControls
│   │   │   ├── ZoomControls
│   │   │   ├── FilterControls
│   │   │   └── GroupingControls
│   │   ├── TimelineAxis
│   │   └── TimelineEvents
│   │       ├── MessageEvent
│   │       ├── ToolCallEvent
│   │       ├── HandoffEvent
│   │       └── ErrorEvent
│   ├── DetailsPanel
│   │   ├── EventDetails
│   │   │   ├── MessageDetails
│   │   │   ├── ToolCallDetails
│   │   │   ├── HandoffDetails
│   │   │   └── ErrorDetails
│   │   ├── ToolCallInspector
│   │   │   ├── ToolInfo
│   │   │   ├── InputParams
│   │   │   ├── OutputResults
│   │   │   └── ExecutionDetails
│   │   └── HandoffInspector
│   │       ├── AgentInfo
│   │       ├── ConditionDetails
│   │       └── ContextTransfer
│   ├── MetricsPanel
│   │   ├── TokenUsage
│   │   ├── ResponseTimes
│   │   ├── CostAnalysis
│   │   └── ExecutionFlow
│   └── ComparisonPanel
│       ├── TraceSelector
│       ├── DiffViewer
│       └── MetricComparison
└── TraceViewerFooter
    ├── ExportOptions
    └── ShareOptions
```

## State Management

The Trace Viewer uses Redux for state management with the following slice:

```typescript
interface TraceViewerState {
  trace: Trace | null;
  comparisonTrace: Trace | null;
  isLoading: boolean;
  error: string | null;
  selectedEventId: string | null;
  timeRange: {
    start: number;
    end: number;
  };
  filters: {
    eventTypes: string[];
    agentIds: string[];
    toolNames: string[];
    timeRange: [number, number] | null;
    searchQuery: string;
  };
  grouping: 'none' | 'agent' | 'tool' | 'type';
  view: 'timeline' | 'list' | 'graph';
  metrics: {
    tokenUsage: TokenUsageMetrics;
    responseTimes: ResponseTimeMetrics;
    costs: CostMetrics;
    flow: FlowMetrics;
  };
}

interface Trace {
  id: string;
  executionId: string;
  startTime: string;
  endTime: string;
  events: TraceEvent[];
  agents: Agent[];
  tools: Tool[];
  metrics: TraceMetrics;
}

interface TraceEvent {
  id: string;
  type: 'message' | 'tool_call' | 'tool_result' | 'handoff' | 'error';
  timestamp: string;
  duration: number;
  agentId: string;
  data: Record<string, any>;
  parentEventId: string | null;
}

interface TraceMetrics {
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    byAgent: Record<string, {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    }>;
  };
  responseTimes: {
    average: number;
    min: number;
    max: number;
    byAgent: Record<string, {
      average: number;
      min: number;
      max: number;
    }>;
  };
  costs: {
    total: number;
    byAgent: Record<string, number>;
    byModel: Record<string, number>;
  };
}
```

## Timeline Visualization

The timeline visualization is a key feature of the Trace Viewer:

### Event Representation

Each event type has a distinct visual representation:

- **Message Events**: Speech bubble icons with role indicators
- **Tool Call Events**: Tool icons with status indicators
- **Handoff Events**: Arrow icons showing direction
- **Error Events**: Warning icons with severity indicators

### Timeline Interactions

Users can interact with the timeline in various ways:

- **Click**: Select an event to view details
- **Drag**: Pan the timeline
- **Scroll**: Zoom in and out
- **Hover**: Show event preview
- **Double-click**: Zoom to event

### Timeline Controls

The timeline includes several controls:

- **Zoom Slider**: Adjust the time scale
- **Time Range Selector**: Focus on a specific time range
- **Play Button**: Animate the timeline
- **Jump Controls**: Jump to next/previous event

## Event Details

The event details panel provides comprehensive information about events:

### Message Events

For message events, the details include:

- **Role**: User, assistant, or system
- **Content**: The message text with formatting
- **Tokens**: Token count and cost
- **Generation Settings**: Temperature, top_p, etc.
- **Context**: Conversation context at this point

### Tool Call Events

For tool call events, the details include:

- **Tool Name**: Name of the tool
- **Input**: Parameters passed to the tool
- **Output**: Results returned by the tool
- **Duration**: How long the tool call took
- **Status**: Success, error, or timeout

### Handoff Events

For handoff events, the details include:

- **Source Agent**: Agent that initiated the handoff
- **Target Agent**: Agent that received the handoff
- **Condition**: Condition that triggered the handoff
- **Context**: Information passed between agents
- **Timing**: When the handoff occurred

### Error Events

For error events, the details include:

- **Error Type**: Type of error
- **Error Message**: Detailed error message
- **Stack Trace**: Stack trace if available
- **Context**: Context in which the error occurred
- **Impact**: How the error affected execution

## Performance Metrics

The Trace Viewer provides detailed performance metrics:

### Token Usage Analysis

The token usage analysis includes:

- **Total Tokens**: Overall token usage
- **Prompt vs. Completion**: Breakdown of token types
- **By Agent**: Token usage per agent
- **By Message**: Token usage per message
- **By Tool Call**: Token usage per tool call
- **Timeline View**: Token usage over time

### Response Time Analysis

The response time analysis includes:

- **Average Response Time**: Overall average
- **Response Time Distribution**: Histogram of response times
- **By Agent**: Response times per agent
- **By Complexity**: Correlation with message complexity
- **Timeline View**: Response times over time

### Cost Analysis

The cost analysis includes:

- **Total Cost**: Overall execution cost
- **By Agent**: Cost per agent
- **By Model**: Cost per model
- **By Component**: Cost breakdown by component
- **Projected Costs**: Cost projections for production use

### Execution Flow Analysis

The execution flow analysis includes:

- **Sankey Diagram**: Visual representation of execution flow
- **Agent Interactions**: How agents interact
- **Tool Usage Patterns**: Patterns in tool usage
- **Bottleneck Identification**: Identify performance bottlenecks
- **Optimization Suggestions**: Suggestions for improvement

## Trace Comparison

The trace comparison feature allows users to compare multiple traces:

### Comparison Views

- **Side-by-side**: Two traces shown side by side
- **Overlay**: Two traces overlaid on the same timeline
- **Diff**: Differences between traces highlighted

### Comparison Metrics

- **Token Usage Difference**: Compare token usage
- **Response Time Difference**: Compare response times
- **Cost Difference**: Compare costs
- **Flow Difference**: Compare execution flows

### Use Cases

- **Version Comparison**: Compare different versions of an agent
- **Configuration Comparison**: Compare different configurations
- **Model Comparison**: Compare different models
- **Before/After Analysis**: Analyze the impact of changes

## Export and Sharing

The Trace Viewer supports exporting and sharing traces:

### Export Formats

- **JSON**: Complete trace data
- **CSV**: Tabular data for analysis
- **PNG/SVG**: Timeline visualization
- **PDF**: Comprehensive trace report

### Sharing Options

- **Share Link**: Generate a shareable link
- **Team Sharing**: Share with team members
- **Annotations**: Add notes and annotations
- **Highlights**: Highlight important events

## Integration with OpenAI Agents SDK

The Trace Viewer integrates with the OpenAI Agents SDK's tracing capabilities:

### Trace Collection

- Automatic trace collection during execution
- Custom trace events for specific use cases
- Trace storage and retrieval

### Trace Processing

- Trace normalization and enrichment
- Metric calculation
- Event correlation

## Accessibility

The Trace Viewer is designed to be accessible with the following features:

- Keyboard navigation for all interactions
- Screen reader support for timeline and events
- High contrast mode for visibility
- Text alternatives for visual elements
- Focus management for interactive elements

## Responsive Design

The Trace Viewer adapts to different screen sizes:

- **Desktop**: Full layout with all panels
- **Tablet**: Simplified layout with tabbed panels
- **Mobile**: Essential features with optimized views

## Implementation Details

### Timeline Implementation

The timeline is implemented using a custom visualization component:

- Canvas-based rendering for performance
- Virtual scrolling for large traces
- Efficient event rendering
- Smooth animations and transitions

### Metric Visualization

Metrics are visualized using D3.js:

- Interactive charts and graphs
- Real-time updates
- Customizable views
- Export capabilities

### Data Processing

Trace data is processed with the following steps:

1. Raw trace data is loaded from the API
2. Events are normalized and enriched
3. Metrics are calculated from events
4. Data is transformed for visualization
5. Updates are applied incrementally

## API Integration

The Trace Viewer integrates with the backend API using the following endpoints:

- `GET /api/v1/traces/{id}`: Get a specific trace
- `GET /api/v1/traces/{id}/events`: Get events for a specific trace
- `GET /api/v1/traces/{id}/metrics`: Get metrics for a specific trace
- `GET /api/v1/traces/compare?trace_id1={id1}&trace_id2={id2}`: Compare two traces

## Performance Considerations

The Trace Viewer is optimized for performance with the following techniques:

- Virtualized rendering for large traces
- Incremental loading of trace data
- Efficient data structures for quick lookups
- Web workers for heavy computations
- Caching of processed data

## Use Cases

The Trace Viewer supports various use cases:

### Debugging

- Identify and diagnose errors
- Understand execution flow
- Inspect tool calls and results
- Analyze handoff conditions

### Performance Optimization

- Identify performance bottlenecks
- Optimize token usage
- Reduce response times
- Lower execution costs

### Behavior Analysis

- Understand agent behavior
- Analyze decision-making
- Identify patterns and trends
- Compare different approaches

### Documentation and Sharing

- Document agent behavior
- Share insights with team members
- Create reports for stakeholders
- Archive execution traces

## Future Enhancements

Planned enhancements for the Trace Viewer include:

- **AI-Powered Analysis**: Automatic insights and recommendations
- **Advanced Filtering**: More powerful filtering capabilities
- **Custom Visualizations**: User-defined visualizations
- **Integration with Monitoring**: Real-time monitoring integration
- **Collaborative Analysis**: Multi-user analysis sessions

## Conclusion

The Trace Viewer is a powerful tool for analyzing and understanding agent executions. Its comprehensive visualization, detailed metrics, and comparison capabilities make it an essential component for developing, debugging, and optimizing agents and workflows.