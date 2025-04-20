# OpenAI Agents UI

A comprehensive web interface and API layer for the [OpenAI Agents SDK](https://github.com/openai/openai-agents-python), enabling users to create, configure, manage, and deploy AI agents through a user-friendly interface.

## Project Overview

The OpenAI Agents UI project aims to create a full-fledged web interface and API layer for the OpenAI Agents SDK, making it easier to:

1. Create, configure, and manage agents through a user-friendly interface
2. Design and visualize agent workflows with multiple agents and handoffs
3. Test agents and view execution traces in real-time
4. Deploy agents as services with monitoring capabilities
5. Integrate agents into existing applications via a REST API

## Repository Structure

This repository contains two main components:

- **agents-ui**: The frontend web application built with React and TypeScript
- **openai-agents-python**: A submodule of the official OpenAI Agents SDK

## Documentation

Comprehensive documentation is available in the [docs](./docs) directory:

- [Architecture Overview](./docs/architecture/README.md): System design and technical decisions
- [API Documentation](./docs/api/README.md): REST API specifications and implementation details
- [UI Documentation](./docs/ui/README.md): User interface components and implementation details
- [Guides](./docs/guides/README.md): Step-by-step tutorials and how-to guides
- [Reference](./docs/reference/README.md): Technical reference documentation

## Getting Started

### Prerequisites

- Node.js 16+ for the frontend
- Python 3.9+ for the backend
- PostgreSQL for the database
- Redis for caching (optional)
- Podman and Podman Compose (optional, for containerized development)

### Installation

1. Clone the repository with submodules:

```bash
git clone --recurse-submodules https://github.com/yourusername/openai-agents-ui.git
cd openai-agents-ui
```

2. Set up the backend:

```bash
cd openai-agents-python
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -e .
cd ..
```

3. Set up the frontend:

```bash
cd agents-ui
npm install
```

4. Install Shadcn/UI components:

```bash
npx shadcn-ui@latest init
# Follow the prompts to set up Shadcn/UI with Tailwind CSS
# Add required components
npx shadcn-ui@latest add button card input form tabs dialog
```

5. Configure environment variables:

Create a `.env` file in the root directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://username:password@localhost:5432/agents_ui
SECRET_KEY=your_secret_key
```

6. Start the development servers:

Backend:
```bash
cd api
uvicorn main:app --reload
```

Frontend:
```bash
cd agents-ui
npm run dev
```

## Features

### Agent Management

- Create and configure agents with custom instructions
- Select and configure models
- Add and configure tools
- Set up handoffs between agents
- Configure guardrails for safety

### Workflow Designer

- Visual canvas for designing multi-agent workflows
- Drag-and-drop agent placement
- Connection creation between agents
- Handoff condition configuration
- Workflow testing and visualization

### Execution Console

- Real-time chat interface
- Tool call visualization
- Handoff visualization
- Conversation export
- Execution metrics display

### Trace Viewer

- Timeline visualization of trace events
- Detailed view of selected events
- Tool call inspector
- Handoff inspector
- Performance metrics display
- Trace comparison

## Contributing

We welcome contributions to the OpenAI Agents UI project! Please see our [Contributing Guide](./CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgements

- [OpenAI](https://openai.com/) for creating the OpenAI Agents SDK
- [React](https://reactjs.org/) and [Material-UI](https://mui.com/) for the frontend
- [FastAPI](https://fastapi.tiangolo.com/) for the backend
- All contributors who have helped shape this project