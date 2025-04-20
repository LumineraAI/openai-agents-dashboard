# Agent Editor

This document provides detailed specifications for the Agent Editor component of the OpenAI Agents UI.

## Overview

The Agent Editor is a comprehensive interface for creating and editing agents. It allows users to configure all aspects of an agent, including basic information, instructions, model settings, tools, handoffs, and guardrails.

## User Interface

The Agent Editor is organized into several sections, each focusing on a specific aspect of agent configuration:

### 1. Basic Information

![Basic Information Section](../assets/agent-editor-basic-info.png)

This section includes:

- **Agent Name**: A text input for the agent's name
- **Description**: A text area for the agent's description
- **Instructions**: A code editor for the agent's instructions with syntax highlighting and formatting

### 2. Model Settings

![Model Settings Section](../assets/agent-editor-model-settings.png)

This section includes:

- **Model Provider**: A dropdown to select the model provider (e.g., OpenAI)
- **Model**: A dropdown to select the model (e.g., GPT-4)
- **Model Parameters**: A form to configure model-specific parameters:
  - Temperature
  - Top P
  - Frequency Penalty
  - Presence Penalty
  - Max Tokens

### 3. Tools Configuration

![Tools Configuration Section](../assets/agent-editor-tools.png)

This section includes:

- **Tool List**: A list of configured tools with:
  - Tool name
  - Tool type
  - Tool description
  - Actions (edit, delete)
- **Add Tool Button**: Opens a modal to add a new tool
- **Tool Configuration Modal**: A modal for configuring a tool:
  - Tool Type (Function, Retrieval, etc.)
  - Tool Name
  - Tool Description
  - Tool Parameters (schema-based form)
  - Test Tool Button

### 4. Handoffs Configuration

![Handoffs Configuration Section](../assets/agent-editor-handoffs.png)

This section includes:

- **Handoff List**: A list of configured handoffs with:
  - Target agent
  - Condition
  - Actions (edit, delete)
- **Add Handoff Button**: Opens a modal to add a new handoff
- **Handoff Configuration Modal**: A modal for configuring a handoff:
  - Target Agent (dropdown)
  - Condition (text input)
  - Parameters (if applicable)

### 5. Guardrails Settings

![Guardrails Settings Section](../assets/agent-editor-guardrails.png)

This section includes:

- **Content Filter**: A dropdown to select the content filter level
- **Max Turns**: A number input for the maximum number of turns
- **Additional Guardrails**: Configuration options for additional guardrails:
  - Topic boundaries
  - Response constraints
  - Safety settings

### 6. Action Bar

![Action Bar](../assets/agent-editor-action-bar.png)

This section includes:

- **Save Button**: Saves the agent configuration
- **Cancel Button**: Discards changes and returns to the previous page
- **Test Button**: Opens the Execution Console to test the agent
- **Delete Button**: Deletes the agent (with confirmation)

## Component Architecture

The Agent Editor is built using a modular component architecture:

```
AgentEditor
├── AgentEditorHeader
├── AgentEditorTabs
│   ├── BasicInfoTab
│   │   ├── NameInput
│   │   ├── DescriptionInput
│   │   └── InstructionsEditor
│   ├── ModelSettingsTab
│   │   ├── ModelProviderSelect
│   │   ├── ModelSelect
│   │   └── ModelParametersForm
│   ├── ToolsTab
│   │   ├── ToolList
│   │   │   └── ToolListItem
│   │   ├── AddToolButton
│   │   └── ToolConfigurationModal
│   ├── HandoffsTab
│   │   ├── HandoffList
│   │   │   └── HandoffListItem
│   │   ├── AddHandoffButton
│   │   └── HandoffConfigurationModal
│   └── GuardrailsTab
│       ├── ContentFilterSelect
│       ├── MaxTurnsInput
│       └── AdditionalGuardrailsForm
└── AgentEditorActionBar
```

## State Management

The Agent Editor uses Redux for state management with the following slice:

```typescript
interface AgentEditorState {
  agent: Agent | null;
  isLoading: boolean;
  isSaving: boolean;
  errors: Record<string, string>;
  activeTab: string;
  isDirty: boolean;
}

interface Agent {
  id?: string;
  name: string;
  description: string;
  instructions: string;
  model: {
    provider: string;
    name: string;
    parameters: Record<string, any>;
  };
  tools: Tool[];
  handoffs: Handoff[];
  guardrails: {
    contentFilter: string;
    maxTurns: number;
    additionalGuardrails: Record<string, any>;
  };
}

interface Tool {
  id: string;
  type: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
}

interface Handoff {
  id: string;
  targetAgentId: string;
  condition: string;
  parameters: Record<string, any>;
}
```

## Validation

The Agent Editor implements comprehensive validation to ensure that the agent configuration is valid:

### Basic Information Validation

- Agent name is required
- Instructions are required

### Model Settings Validation

- Model provider is required
- Model is required
- Model parameters are validated based on the selected model

### Tools Validation

- Tool name is required
- Tool description is required
- Tool parameters are validated based on the tool type

### Handoffs Validation

- Target agent is required
- Condition is required

### Guardrails Validation

- Max turns must be a positive integer

## Error Handling

The Agent Editor handles errors in the following ways:

- **Validation Errors**: Displayed inline next to the relevant field
- **API Errors**: Displayed in a toast notification
- **Network Errors**: Displayed in a toast notification with retry option

## Accessibility

The Agent Editor is designed to be accessible with the following features:

- All form fields have associated labels
- Error messages are linked to form fields
- Keyboard navigation is supported
- ARIA attributes are used for screen readers
- Color contrast meets WCAG 2.1 AA standards

## Responsive Design

The Agent Editor is responsive and works on various screen sizes:

- **Desktop**: Full layout with all sections visible
- **Tablet**: Sections stack vertically with some layout adjustments
- **Mobile**: Simplified layout with collapsible sections

## Interactions

### Creating a New Agent

1. User navigates to the Agent Editor
2. User fills in the basic information
3. User configures the model settings
4. User adds tools (optional)
5. User adds handoffs (optional)
6. User configures guardrails (optional)
7. User clicks the Save button
8. System validates the configuration
9. System saves the agent and redirects to the agent list or details page

### Editing an Existing Agent

1. User navigates to the Agent Editor for an existing agent
2. System loads the agent configuration
3. User makes changes to the configuration
4. User clicks the Save button
5. System validates the configuration
6. System saves the agent and redirects to the agent list or details page

### Testing an Agent

1. User configures the agent
2. User clicks the Test button
3. System opens the Execution Console with the current agent configuration
4. User interacts with the agent in the Execution Console
5. User returns to the Agent Editor to make adjustments based on testing

## Implementation Details

### Instructions Editor

The instructions editor is implemented using CodeMirror with the following features:

- Syntax highlighting for Markdown
- Line numbers
- Code folding
- Search and replace
- Undo/redo
- Auto-save

### Tool Configuration

The tool configuration uses a schema-based approach:

1. Each tool type has a JSON Schema that defines its parameters
2. The UI dynamically generates a form based on the schema
3. The form includes validation based on the schema
4. The tool configuration is stored in the agent configuration

### Model Parameters

The model parameters form is dynamically generated based on the selected model:

1. Each model has a set of parameters with default values
2. The UI displays the relevant parameters for the selected model
3. The parameters are validated based on the model's requirements
4. The model configuration is stored in the agent configuration

## API Integration

The Agent Editor integrates with the backend API using the following endpoints:

- `GET /api/v1/agents/{id}`: Get an existing agent
- `POST /api/v1/agents`: Create a new agent
- `PUT /api/v1/agents/{id}`: Update an existing agent
- `DELETE /api/v1/agents/{id}`: Delete an agent
- `GET /api/v1/models`: Get available models
- `GET /api/v1/tools`: Get available tool types

## Performance Considerations

The Agent Editor is optimized for performance with the following techniques:

- Debounced saving of changes
- Lazy loading of complex components
- Memoization of expensive computations
- Efficient form state management

## Future Enhancements

Planned enhancements for the Agent Editor include:

- **Template Library**: A library of agent templates for common use cases
- **Version History**: Tracking and restoring previous versions of an agent
- **Collaborative Editing**: Multiple users editing an agent simultaneously
- **Advanced Testing**: More comprehensive testing capabilities
- **Import/Export**: Importing and exporting agent configurations

## Conclusion

The Agent Editor is a powerful and flexible interface for creating and configuring agents. Its comprehensive feature set, intuitive design, and robust validation make it easy for users to create effective agents for a wide range of use cases.