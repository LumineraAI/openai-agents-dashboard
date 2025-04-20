# Execution Console

This document provides detailed specifications for the Execution Console component of the OpenAI Agents UI.

## Overview

The Execution Console is a real-time interface for running agents and workflows. It provides a chat-like interface for interacting with agents, visualizes tool calls and handoffs, and displays execution metrics.

## User Interface

The Execution Console consists of several key areas:

### 1. Chat Interface

![Execution Console Chat](../assets/execution-console-chat.png)

The chat interface is the main area where users interact with agents:

- **Message History**: Displays the conversation history
  - User messages
  - Agent responses
  - System messages
- **Input Area**: Allows users to send messages to the agent
  - Text input
  - Send button
  - Attachment options (if applicable)
- **Typing Indicator**: Shows when the agent is generating a response
- **Markdown Rendering**: Supports rich text formatting in messages
  - Code blocks with syntax highlighting
  - Lists and tables
  - Links and images
  - Math equations

### 2. Tool Call Visualization

![Execution Console Tool Calls](../assets/execution-console-tool-calls.png)

The tool call visualization shows details about tool calls made by the agent:

- **Tool Call List**: List of tool calls in the current execution
- **Tool Call Details**: Expanded view of a selected tool call
  - Tool name and description
  - Input parameters
  - Output results
  - Execution time
  - Status (pending, success, error)
- **Error Display**: Clear indication of tool call errors

### 3. Handoff Visualization

![Execution Console Handoffs](../assets/execution-console-handoffs.png)

The handoff visualization shows agent transitions in a workflow:

- **Handoff Events**: Visual representation of handoffs between agents
- **Agent Timeline**: Shows which agent is active at each point
- **Handoff Reasons**: Displays the conditions that triggered handoffs
- **Agent Context**: Shows the context passed between agents

### 4. Execution Metrics

![Execution Console Metrics](../assets/execution-console-metrics.png)

The execution metrics panel displays performance information:

- **Token Usage**: Prompt and completion tokens used
- **Response Time**: Time taken for agent responses
- **Cost Estimation**: Estimated cost of the execution
- **Turn Counter**: Number of turns in the conversation
- **Tool Usage**: Statistics on tool usage

### 5. Control Panel

![Execution Console Controls](../assets/execution-console-controls.png)

The control panel provides execution controls:

- **Start/Stop**: Start or stop the execution
- **Reset**: Reset the conversation
- **Save**: Save the conversation
- **Export**: Export the conversation as a transcript
- **View Trace**: Open the Trace Viewer for detailed analysis

## Component Architecture

The Execution Console is built using a modular component architecture:

```
ExecutionConsole
├── ExecutionConsoleHeader
├── ExecutionConsoleLayout
│   ├── ChatPanel
│   │   ├── MessageList
│   │   │   ├── UserMessage
│   │   │   ├── AgentMessage
│   │   │   └── SystemMessage
│   │   ├── TypingIndicator
│   │   └── MessageInput
│   ├── DetailsPanel
│   │   ├── ToolCallsTab
│   │   │   ├── ToolCallList
│   │   │   │   └── ToolCallItem
│   │   │   └── ToolCallDetails
│   │   ├── HandoffsTab
│   │   │   ├── HandoffList
│   │   │   │   └── HandoffItem
│   │   │   └── HandoffDetails
│   │   └── MetricsTab
│   │       ├── TokenUsage
│   │       ├── ResponseTime
│   │       ├── CostEstimation
│   │       └── ToolUsage
│   └── ControlPanel
│       ├── ExecutionControls
│       └── ExportOptions
└── ExecutionConsoleFooter
```

## State Management

The Execution Console uses Redux for state management with the following slice:

```typescript
interface ExecutionConsoleState {
  execution: Execution | null;
  messages: Message[];
  toolCalls: ToolCall[];
  handoffs: Handoff[];
  metrics: Metrics;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  error: string | null;
  selectedToolCall: string | null;
  selectedHandoff: string | null;
  isInputDisabled: boolean;
  eventSource: EventSource | null;
}

interface Execution {
  id: string;
  type: 'agent' | 'workflow';
  entityId: string;
  entityName: string;
  startedAt: string;
  completedAt: string | null;
  status: 'running' | 'completed' | 'failed';
  input: string;
  output: string | null;
  error: string | null;
  traceId: string | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agentId?: string;
  agentName?: string;
  isStreaming?: boolean;
}

interface ToolCall {
  id: string;
  toolName: string;
  toolDescription: string;
  input: Record<string, any>;
  output: Record<string, any> | null;
  error: string | null;
  startTime: string;
  endTime: string | null;
  status: 'pending' | 'success' | 'error';
  agentId: string;
  agentName: string;
}

interface Handoff {
  id: string;
  sourceAgentId: string;
  sourceAgentName: string;
  targetAgentId: string;
  targetAgentName: string;
  condition: string;
  context: Record<string, any>;
  timestamp: string;
}

interface Metrics {
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  responseTimes: number[];
  estimatedCost: number;
  turnCount: number;
  toolUsage: Record<string, number>;
}
```

## Real-time Updates

The Execution Console uses Server-Sent Events (SSE) for real-time updates:

### Event Types

- **message**: New message from the agent
- **message_stream**: Streaming message chunk from the agent
- **tool_call**: Tool call made by the agent
- **tool_call_result**: Result of a tool call
- **handoff**: Handoff between agents
- **metrics_update**: Updated execution metrics
- **execution_complete**: Execution completed
- **execution_error**: Error during execution

### Event Handling

1. The client establishes an SSE connection to the server
2. The server sends events as they occur during execution
3. The client processes events and updates the UI in real-time
4. The connection is closed when the execution completes or errors

## Message Rendering

The Execution Console renders messages with rich formatting:

### Markdown Support

- **Syntax Highlighting**: Code blocks with language detection
- **Tables**: Formatted tables with alignment
- **Lists**: Ordered and unordered lists
- **Links**: Clickable links with previews
- **Images**: Inline images with lazy loading
- **Math**: LaTeX equations using KaTeX

### Message Components

- **User Messages**: Right-aligned with user avatar
- **Agent Messages**: Left-aligned with agent avatar
- **System Messages**: Centered with distinctive styling
- **Typing Indicator**: Animated dots during response generation

## Tool Call Visualization

The Execution Console provides detailed visualization of tool calls:

### Tool Call List

- Chronological list of tool calls
- Visual indicators for status (pending, success, error)
- Filtering options by tool type or status

### Tool Call Details

- Formatted display of input parameters
- Syntax-highlighted JSON for input and output
- Error messages with stack traces
- Execution timeline

## Handoff Visualization

The Execution Console visualizes handoffs between agents:

### Handoff Timeline

- Visual timeline of agent transitions
- Agent avatars and names
- Handoff conditions displayed at transition points

### Handoff Details

- Source and target agent information
- Condition that triggered the handoff
- Context passed between agents
- Timestamp and duration

## Execution Metrics

The Execution Console displays real-time metrics:

### Token Usage

- Bar chart of prompt vs. completion tokens
- Running total of tokens used
- Breakdown by agent (for workflows)

### Response Time

- Line chart of response times
- Average, minimum, and maximum response times
- Trend analysis

### Cost Estimation

- Estimated cost based on token usage
- Breakdown by model type
- Running total and projected cost

## Accessibility

The Execution Console is designed to be accessible with the following features:

- Screen reader support for all components
- Keyboard navigation for all interactions
- ARIA attributes for dynamic content
- Focus management for real-time updates
- Color contrast compliance

## Responsive Design

The Execution Console adapts to different screen sizes:

- **Desktop**: Side-by-side layout with chat and details panels
- **Tablet**: Tabbed interface for details panel
- **Mobile**: Stacked layout with collapsible panels

## Implementation Details

### Streaming Responses

The Execution Console supports streaming responses from the agent:

1. The server sends message chunks as they are generated
2. The client appends chunks to the current message
3. The UI updates in real-time to show the growing message
4. A typing indicator is shown during streaming

### Tool Call Handling

Tool calls are handled with the following process:

1. Agent makes a tool call
2. UI displays the tool call with a pending status
3. Server executes the tool call
4. UI updates with the tool call result
5. Agent continues processing with the tool call result

### Error Handling

The Execution Console handles various error scenarios:

- **Network Errors**: Reconnection attempts with exponential backoff
- **Tool Call Errors**: Display error details with retry options
- **Execution Errors**: Clear error messages with troubleshooting guidance
- **Rate Limiting**: Notification of rate limits with wait time

## API Integration

The Execution Console integrates with the backend API using the following endpoints:

- `POST /api/v1/agents/{id}/run`: Run an agent
- `POST /api/v1/workflows/{id}/run`: Run a workflow
- `GET /api/v1/executions/{id}`: Get execution details
- `GET /api/v1/executions/{id}/events`: Stream execution events (SSE)
- `GET /api/v1/executions/{id}/trace`: Get the execution trace

## Performance Considerations

The Execution Console is optimized for performance with the following techniques:

- Virtualized message list for long conversations
- Efficient rendering of streaming messages
- Throttled updates for metrics
- Lazy loading of details panels
- Memory management for long-running executions

## Conversation Management

The Execution Console provides features for managing conversations:

### Saving Conversations

- Save the current conversation to history
- Add tags and notes to saved conversations
- Browse and search conversation history

### Exporting Conversations

- Export as plain text
- Export as Markdown
- Export as JSON
- Export as HTML

### Conversation Templates

- Save conversation starters as templates
- Reuse common queries
- Share templates with team members

## Integration with Other Components

The Execution Console integrates with other components of the OpenAI Agents UI:

### Agent Editor Integration

- Test button in Agent Editor opens Execution Console
- Quick edits to agent configuration from Execution Console
- Performance feedback for agent improvement

### Workflow Designer Integration

- Run button in Workflow Designer opens Execution Console
- Visual indication of current agent in workflow
- Workflow visualization alongside conversation

### Trace Viewer Integration

- View Trace button opens Trace Viewer for the current execution
- Seamless transition between conversation and trace analysis
- Shared context between components

## Future Enhancements

Planned enhancements for the Execution Console include:

- **Multi-modal Interactions**: Support for image and audio inputs
- **Conversation Branching**: Explore alternative conversation paths
- **Collaborative Sessions**: Multiple users in the same conversation
- **Advanced Analytics**: More detailed performance metrics
- **Debugging Tools**: Step-through execution and breakpoints

## Conclusion

The Execution Console is a powerful and intuitive interface for interacting with agents and workflows. Its real-time updates, rich visualizations, and comprehensive metrics make it easy for users to run, monitor, and analyze agent executions.