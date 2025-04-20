# UI Implementation Guide

This guide provides detailed instructions for implementing the frontend UI for the OpenAI Agents UI system using Vite, React, TypeScript, Shadcn/UI, and Tailwind CSS.

## Technology Stack

- **Vite**: Build tool and development server
- **React**: Frontend library
- **TypeScript**: Type-safe JavaScript
- **Shadcn/UI**: Component library based on Radix UI
- **Tailwind CSS**: Utility-first CSS framework
- **Redux Toolkit**: State management
- **React Router**: Routing
- **React Flow**: Workflow visualization
- **Axios**: API client
- **React Query**: Data fetching and caching
- **Vitest & React Testing Library**: Testing

## Project Structure

```
ui/
├── public/               # Static files
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # Shadcn/UI components
│   │   ├── agents/       # Agent-related components
│   │   ├── tools/        # Tool-related components
│   │   ├── workflows/    # Workflow-related components
│   │   ├── executions/   # Execution-related components
│   │   ├── traces/       # Trace-related components
│   │   └── common/       # Common UI components
│   ├── app/              # Page components using React Router
│   │   ├── dashboard/    # Dashboard page
│   │   ├── agents/       # Agents pages
│   │   ├── workflows/    # Workflows pages
│   │   ├── executions/   # Executions pages
│   │   ├── traces/       # Traces pages
│   │   └── settings/     # Settings pages
│   ├── layouts/          # Layout components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service functions
│   ├── store/            # Redux state management
│   ├── utils/            # Utility functions
│   ├── lib/              # Shared libraries and configurations
│   ├── types/            # TypeScript type definitions
│   ├── assets/           # Static assets
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Entry point
│   └── globals.css       # Global styles with Tailwind directives
├── tailwind.config.js    # Tailwind CSS configuration
├── components.json       # Shadcn/UI configuration
└── package.json          # Dependencies and scripts
```

## Implementation Steps

### 1. Set Up Project

Create a new Vite project with React and TypeScript:

```bash
npm create vite@latest ui -- --template react-ts
cd ui
```

Install dependencies:

```bash
# Core dependencies
npm install react-router-dom @reduxjs/toolkit react-redux
npm install axios @tanstack/react-query
npm install reactflow
npm install react-markdown
npm install @monaco-editor/react
npm install date-fns
npm install clsx tailwind-merge class-variance-authority
npm install lucide-react
npm install sonner # Toast notifications
npm install zustand # Optional lightweight state management

# Tailwind CSS and Shadcn/UI setup
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install -D @types/node

# Shadcn UI CLI for adding components
npm install -D shadcn-ui
npx shadcn-ui@latest init
```

Configure Tailwind CSS by updating `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

Create `globals.css` with Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 2. Set Up Shadcn/UI Components

Install and configure essential Shadcn/UI components:

```bash
# Add commonly used components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add form
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add pagination
```

Create a theme provider in `src/components/theme-provider.tsx`:

```typescript
"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
```

Create a theme toggle component in `src/components/theme-toggle.tsx`:

```typescript
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### 3. Set Up API Services

Create API service functions in `src/services/api.ts`:

```typescript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

Create agent service in `src/services/agentService.ts`:

```typescript
import api from './api';
import { Agent, AgentCreate, AgentUpdate } from '../types/agent';
import { PaginatedResponse } from '../types/common';

export const agentService = {
  getAgents: async (page = 1, limit = 20, filters = {}) => {
    const params = { page, limit, ...filters };
    const response = await api.get<PaginatedResponse<Agent>>('/api/v1/agents', { params });
    return response.data;
  },

  getAgent: async (id: string) => {
    const response = await api.get<Agent>(`/api/v1/agents/${id}`);
    return response.data;
  },

  createAgent: async (agent: AgentCreate) => {
    const response = await api.post<Agent>('/api/v1/agents', agent);
    return response.data;
  },

  updateAgent: async (id: string, agent: AgentUpdate) => {
    const response = await api.put<Agent>(`/api/v1/agents/${id}`, agent);
    return response.data;
  },

  deleteAgent: async (id: string) => {
    const response = await api.delete(`/api/v1/agents/${id}`);
    return response.data;
  },

  runAgent: async (id: string, input: string, maxTurns?: number) => {
    const response = await api.post(`/api/v1/agents/${id}/run`, {
      input,
      max_turns: maxTurns,
    });
    return response.data;
  },

  streamAgentRun: (id: string, input: string, maxTurns?: number) => {
    const url = new URL(`${api.defaults.baseURL}/api/v1/agents/${id}/run/stream`);
    
    // Create EventSource for SSE
    const eventSource = new EventSource(url.toString(), {
      withCredentials: true,
    });
    
    return eventSource;
  },
};
```

### 4. Set Up Redux Store

Create Redux store with Redux Toolkit in `src/store/index.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import agentsReducer from './slices/agentsSlice';
import workflowsReducer from './slices/workflowsSlice';
import executionsReducer from './slices/executionsSlice';
import tracesReducer from './slices/tracesSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    agents: agentsReducer,
    workflows: workflowsReducer,
    executions: executionsReducer,
    traces: tracesReducer,
    auth: authReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

Create agents slice in `src/store/slices/agentsSlice.ts`:

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { agentService } from '../../services/agentService';
import { Agent, AgentCreate, AgentUpdate } from '../../types/agent';
import { PaginatedResponse } from '../../types/common';

interface AgentsState {
  agents: Agent[];
  currentAgent: Agent | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

const initialState: AgentsState = {
  agents: [],
  currentAgent: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    pages: 0,
    page: 1,
    limit: 20,
  },
};

export const fetchAgents = createAsyncThunk(
  'agents/fetchAgents',
  async ({ page, limit, filters }: { page: number; limit: number; filters?: any }, { rejectWithValue }) => {
    try {
      return await agentService.getAgents(page, limit, filters);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch agents');
    }
  }
);

export const fetchAgent = createAsyncThunk(
  'agents/fetchAgent',
  async (id: string, { rejectWithValue }) => {
    try {
      return await agentService.getAgent(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch agent');
    }
  }
);

export const createAgent = createAsyncThunk(
  'agents/createAgent',
  async (agent: AgentCreate, { rejectWithValue }) => {
    try {
      return await agentService.createAgent(agent);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create agent');
    }
  }
);

export const updateAgent = createAsyncThunk(
  'agents/updateAgent',
  async ({ id, agent }: { id: string; agent: AgentUpdate }, { rejectWithValue }) => {
    try {
      return await agentService.updateAgent(id, agent);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update agent');
    }
  }
);

export const deleteAgent = createAsyncThunk(
  'agents/deleteAgent',
  async (id: string, { rejectWithValue }) => {
    try {
      return await agentService.deleteAgent(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete agent');
    }
  }
);

const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    clearCurrentAgent: (state) => {
      state.currentAgent = null;
    },
    setCurrentAgent: (state, action: PayloadAction<Agent>) => {
      state.currentAgent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action: PayloadAction<PaginatedResponse<Agent>>) => {
        state.loading = false;
        state.agents = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgent.fulfilled, (state, action: PayloadAction<Agent>) => {
        state.loading = false;
        state.currentAgent = action.payload;
      })
      .addCase(fetchAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAgent.fulfilled, (state, action: PayloadAction<Agent>) => {
        state.loading = false;
        state.agents.push(action.payload);
        state.currentAgent = action.payload;
      })
      .addCase(createAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAgent.fulfilled, (state, action: PayloadAction<Agent>) => {
        state.loading = false;
        const index = state.agents.findIndex((agent) => agent.id === action.payload.id);
        if (index !== -1) {
          state.agents[index] = action.payload;
        }
        state.currentAgent = action.payload;
      })
      .addCase(updateAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAgent.fulfilled, (state, action: PayloadAction<{ id: string; status: string }>) => {
        state.loading = false;
        state.agents = state.agents.filter((agent) => agent.id !== action.payload.id);
        if (state.currentAgent?.id === action.payload.id) {
          state.currentAgent = null;
        }
      })
      .addCase(deleteAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentAgent, setCurrentAgent } = agentsSlice.actions;

export default agentsSlice.reducer;
```

### 5. Create Common Components

Create a custom button component in `src/components/common/custom-button.tsx` that extends Shadcn/UI button:

```typescript
import React from 'react';
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CustomButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  className,
  variant,
  size,
  isLoading = false,
  loadingText,
  icon,
  ...props
}) => {
  return (
    <Button
      className={cn(className)}
      variant={variant}
      size={size}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </Button>
  );
};

export default CustomButton;
```

Create a custom card component in `src/components/common/custom-card.tsx`:

```typescript
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  isHoverable?: boolean;
}

const CustomCard: React.FC<CustomCardProps> = ({
  title,
  description,
  footer,
  children,
  className,
  isHoverable = false,
  ...props
}) => {
  return (
    <Card 
      className={cn(
        className,
        isHoverable && "transition-all hover:shadow-md hover:-translate-y-1"
      )}
      {...props}
    >
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export default CustomCard;
```

### 6. Create Agent Components

Create an agent card component in `src/components/agents/agent-card.tsx`:

```typescript
import React from 'react';
import { Agent } from '@/types/agent';
import CustomCard from '@/components/common/custom-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentCardProps {
  agent: Agent;
  onEdit: (agent: Agent) => void;
  onDelete: (agent: Agent) => void;
  onRun: (agent: Agent) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onEdit, onDelete, onRun }) => {
  return (
    <CustomCard 
      isHoverable
      title={agent.name}
      description={agent.description}
      footer={
        <div className="flex justify-between w-full">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onRun(agent)}
            className="flex items-center gap-1"
          >
            <Play className="h-4 w-4" />
            Run
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(agent)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(agent)}
              className="flex items-center gap-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge variant="secondary">{agent.model}</Badge>
        <Badge 
          variant={agent.status === 'active' ? 'default' : 'outline'}
          className={cn(
            agent.status === 'active' && "bg-green-100 text-green-800 hover:bg-green-100",
            agent.status !== 'active' && "text-muted-foreground"
          )}
        >
          {agent.status}
        </Badge>
        {agent.tags?.map((tag) => (
          <Badge key={tag} variant="outline">{tag}</Badge>
        ))}
      </div>
    </CustomCard>
  );
};

export default AgentCard;
```

Create an agent form component in `src/components/agents/AgentForm.tsx`:

```typescript
import React, { useState } from 'react';
import { TextField, Grid, Box, Tabs, Tab, Slider, Typography, Chip, InputAdornment, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Agent, AgentCreate, AgentUpdate } from '../../types/agent';
import Button from '../common/Button';

interface AgentFormProps {
  agent?: Agent;
  onSubmit: (agent: AgentCreate | AgentUpdate) => void;
  onCancel: () => void;
}

const AgentForm: React.FC<AgentFormProps> = ({ agent, onSubmit, onCancel }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<AgentCreate | AgentUpdate>(
    agent || {
      name: '',
      description: '',
      instructions: '',
      model: 'gpt-4o',
      model_settings: {
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1.0,
        tool_choice: 'auto',
      },
      tools: [],
      handoffs: [],
      tags: [],
    }
  );
  const [newTag, setNewTag] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModelSettingsChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      model_settings: {
        ...prev.model_settings,
        [name]: value,
      },
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Basics" />
          <Tab label="Model" />
          <Tab label="Tools" />
          <Tab label="Handoffs" />
          <Tab label="Guardrails" />
        </Tabs>
      </Box>

      {/* Basic Info Tab */}
      {activeTab === 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              multiline
              rows={6}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Add Tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleAddTag}>
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.tags?.map((tag) => (
                <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} />
              ))}
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Model Settings Tab */}
      {activeTab === 1 && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              select
              SelectProps={{ native: true }}
            >
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>Temperature: {formData.model_settings?.temperature}</Typography>
            <Slider
              value={formData.model_settings?.temperature || 0.7}
              onChange={(_, value) => handleModelSettingsChange('temperature', value)}
              min={0}
              max={2}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Max Tokens"
              type="number"
              value={formData.model_settings?.max_tokens || 1000}
              onChange={(e) => handleModelSettingsChange('max_tokens', parseInt(e.target.value))}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>Top P: {formData.model_settings?.top_p}</Typography>
            <Slider
              value={formData.model_settings?.top_p || 1.0}
              onChange={(_, value) => handleModelSettingsChange('top_p', value)}
              min={0}
              max={1}
              step={0.01}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tool Choice"
              value={formData.model_settings?.tool_choice || 'auto'}
              onChange={(e) => handleModelSettingsChange('tool_choice', e.target.value)}
              select
              SelectProps={{ native: true }}
            >
              <option value="auto">Auto</option>
              <option value="required">Required</option>
              <option value="none">None</option>
            </TextField>
          </Grid>
        </Grid>
      )}

      {/* Tools Tab */}
      {activeTab === 2 && (
        <Typography>Tools configuration will be implemented here</Typography>
      )}

      {/* Handoffs Tab */}
      {activeTab === 3 && (
        <Typography>Handoffs configuration will be implemented here</Typography>
      )}

      {/* Guardrails Tab */}
      {activeTab === 4 && (
        <Typography>Guardrails configuration will be implemented here</Typography>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" type="submit">
          {agent ? 'Update Agent' : 'Create Agent'}
        </Button>
      </Box>
    </form>
  );
};

export default AgentForm;
```

### 7. Create Agent Pages

Create an agents list page in `src/pages/Agents/AgentsListPage.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, Box, TextField, InputAdornment, Pagination, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { AppDispatch, RootState } from '../../store';
import { fetchAgents, deleteAgent } from '../../store/slices/agentsSlice';
import AgentCard from '../../components/agents/AgentCard';
import Button from '../../components/common/Button';
import { Agent } from '../../types/agent';

const AgentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { agents, loading, pagination } = useSelector((state: RootState) => state.agents);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);

  useEffect(() => {
    dispatch(fetchAgents({ page, limit: 12, filters: { search: searchTerm } }));
  }, [dispatch, page, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleCreateAgent = () => {
    navigate('/agents/create');
  };

  const handleEditAgent = (agent: Agent) => {
    navigate(`/agents/${agent.id}/edit`);
  };

  const handleRunAgent = (agent: Agent) => {
    navigate(`/agents/${agent.id}/run`);
  };

  const handleDeleteClick = (agent: Agent) => {
    setAgentToDelete(agent);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (agentToDelete) {
      await dispatch(deleteAgent(agentToDelete.id));
      setDeleteDialogOpen(false);
      setAgentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setAgentToDelete(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Agents</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateAgent}>
          Create Agent
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search agents..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading && <Typography>Loading...</Typography>}

      {!loading && agents.length === 0 && (
        <Typography>No agents found. Create your first agent to get started.</Typography>
      )}

      <Grid container spacing={3}>
        {agents.map((agent) => (
          <Grid item xs={12} sm={6} md={4} key={agent.id}>
            <AgentCard
              agent={agent}
              onEdit={handleEditAgent}
              onDelete={handleDeleteClick}
              onRun={handleRunAgent}
            />
          </Grid>
        ))}
      </Grid>

      {pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.pages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Agent</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the agent "{agentToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentsListPage;
```

Create an agent create page in `src/pages/Agents/AgentCreatePage.tsx`:

```typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Typography, Box, Paper } from '@mui/material';
import { AppDispatch } from '../../store';
import { createAgent } from '../../store/slices/agentsSlice';
import AgentForm from '../../components/agents/AgentForm';
import { AgentCreate } from '../../types/agent';

const AgentCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (agent: AgentCreate) => {
    try {
      await dispatch(createAgent(agent)).unwrap();
      navigate('/agents');
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  const handleCancel = () => {
    navigate('/agents');
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Create Agent
      </Typography>
      <Paper sx={{ p: 3 }}>
        <AgentForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </Paper>
    </Box>
  );
};

export default AgentCreatePage;
```

### 8. Create Execution Console

Create an execution console component in `src/components/executions/ExecutionConsole.tsx`:

```typescript
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, Paper, CircularProgress, Divider } from '@mui/material';
import { Agent } from '../../types/agent';
import { agentService } from '../../services/agentService';
import ReactMarkdown from 'react-markdown';

interface ExecutionConsoleProps {
  agent: Agent;
}

interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  toolCall?: {
    name: string;
    input: any;
    output?: any;
  };
}

const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({ agent }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Clean up event source on unmount
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Create event source for streaming
    const newEventSource = agentService.streamAgentRun(agent.id, input);
    setEventSource(newEventSource);

    // Handle different event types
    newEventSource.addEventListener('start', (e) => {
      console.log('Execution started:', JSON.parse(e.data));
    });

    newEventSource.addEventListener('thinking', (e) => {
      console.log('Agent thinking:', JSON.parse(e.data));
    });

    newEventSource.addEventListener('tool_call', (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [
        ...prev,
        {
          role: 'tool',
          content: `Calling tool: ${data.tool_name}`,
          toolCall: {
            name: data.tool_name,
            input: data.tool_input,
          },
        },
      ]);
    });

    newEventSource.addEventListener('tool_result', (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => {
        const lastIndex = prev.length - 1;
        if (prev[lastIndex].role === 'tool' && prev[lastIndex].toolCall?.name === data.tool_name) {
          const updatedMessages = [...prev];
          updatedMessages[lastIndex] = {
            ...updatedMessages[lastIndex],
            content: `${updatedMessages[lastIndex].content}\nResult: ${JSON.stringify(data.tool_output)}`,
            toolCall: {
              ...updatedMessages[lastIndex].toolCall!,
              output: data.tool_output,
            },
          };
          return updatedMessages;
        }
        return prev;
      });
    });

    newEventSource.addEventListener('content', (e) => {
      const data = JSON.parse(e.data);
      // Check if we already have an assistant message
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        // Append to existing message
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + data.content,
          };
          return updated;
        });
      } else {
        // Create new assistant message
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.content,
          },
        ]);
      }
    });

    newEventSource.addEventListener('handoff', (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [
        ...prev,
        {
          role: 'system',
          content: `Handing off from ${data.from_agent} to ${data.to_agent}`,
        },
      ]);
    });

    newEventSource.addEventListener('error', (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [
        ...prev,
        {
          role: 'system',
          content: `Error: ${data.message}`,
        },
      ]);
      setIsProcessing(false);
      newEventSource.close();
    });

    newEventSource.addEventListener('end', (e) => {
      const data = JSON.parse(e.data);
      setIsProcessing(false);
      newEventSource.close();
    });

    newEventSource.onerror = () => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'system',
          content: 'Connection error. Please try again.',
        },
      ]);
      setIsProcessing(false);
      newEventSource.close();
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Chat with {agent.name}
      </Typography>

      <Paper
        sx={{
          flex: 1,
          mb: 2,
          p: 2,
          overflowY: 'auto',
          bgcolor: '#f5f5f5',
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 2,
              maxWidth: '80%',
              bgcolor: message.role === 'user' ? '#e3f2fd' : message.role === 'tool' ? '#fff8e1' : '#ffffff',
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              ml: message.role === 'user' ? 'auto' : 0,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
              {message.role === 'user' ? 'You' : message.role === 'assistant' ? agent.name : message.role}
            </Typography>
            {message.role === 'tool' ? (
              <Box>
                <Typography variant="body2">{message.content}</Typography>
                {message.toolCall && (
                  <Box sx={{ mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      Input:
                    </Typography>
                    <pre style={{ margin: 0, overflow: 'auto' }}>
                      {JSON.stringify(message.toolCall.input, null, 2)}
                    </pre>
                    {message.toolCall.output && (
                      <>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                          Output:
                        </Typography>
                        <pre style={{ margin: 0, overflow: 'auto' }}>
                          {JSON.stringify(message.toolCall.output, null, 2)}
                        </pre>
                      </>
                    )}
                  </Box>
                )}
              </Box>
            ) : (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            )}
          </Box>
        ))}
        {isProcessing && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} />
            <Typography variant="body2">Processing...</Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isProcessing}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!input.trim() || isProcessing}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ExecutionConsole;
```

### 9. Set Up Routing

Create the main app component with routing in `src/App.tsx`:

```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { store } from './store';
import theme from './theme';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import DashboardPage from './pages/Dashboard/DashboardPage';
import AgentsListPage from './pages/Agents/AgentsListPage';
import AgentCreatePage from './pages/Agents/AgentCreatePage';
import AgentEditPage from './pages/Agents/AgentEditPage';
import AgentRunPage from './pages/Agents/AgentRunPage';
import WorkflowsListPage from './pages/Workflows/WorkflowsListPage';
import WorkflowCreatePage from './pages/Workflows/WorkflowCreatePage';
import WorkflowEditPage from './pages/Workflows/WorkflowEditPage';
import WorkflowRunPage from './pages/Workflows/WorkflowRunPage';
import TracesListPage from './pages/Traces/TracesListPage';
import TraceViewPage from './pages/Traces/TraceViewPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                
                <Route path="agents">
                  <Route index element={<AgentsListPage />} />
                  <Route path="create" element={<AgentCreatePage />} />
                  <Route path=":id/edit" element={<AgentEditPage />} />
                  <Route path=":id/run" element={<AgentRunPage />} />
                </Route>
                
                <Route path="workflows">
                  <Route index element={<WorkflowsListPage />} />
                  <Route path="create" element={<WorkflowCreatePage />} />
                  <Route path=":id/edit" element={<WorkflowEditPage />} />
                  <Route path=":id/run" element={<WorkflowRunPage />} />
                </Route>
                
                <Route path="traces">
                  <Route index element={<TracesListPage />} />
                  <Route path=":id" element={<TraceViewPage />} />
                </Route>
              </Route>
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
```

### 10. Create Main Layout

Create the main layout component in `src/layouts/MainLayout.tsx`:

```typescript
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Container,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import TimelineIcon from '@mui/icons-material/Timeline';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { RootState } from '../store';

const drawerWidth = 240;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Implement logout logic
    handleProfileMenuClose();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Agents', icon: <SmartToyIcon />, path: '/agents' },
    { text: 'Workflows', icon: <AccountTreeIcon />, path: '/workflows' },
    { text: 'Traces', icon: <TimelineIcon />, path: '/traces' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          OpenAI Agents UI
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname.startsWith(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find((item) => location.pathname.startsWith(item.path))?.text || 'OpenAI Agents UI'}
          </Typography>
          <IconButton color="inherit" onClick={handleProfileMenuOpen}>
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
```

## Testing

Create tests for components using Jest and React Testing Library. Example for `AgentCard.test.tsx`:

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AgentCard from '../components/agents/AgentCard';
import { Agent } from '../types/agent';

const mockAgent: Agent = {
  id: 'agent_123',
  name: 'Test Agent',
  description: 'A test agent',
  instructions: 'You are a test agent',
  model: 'gpt-4o',
  model_settings: {
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1.0,
    tool_choice: 'auto',
  },
  status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  tags: ['test', 'example'],
};

describe('AgentCard', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnRun = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders agent information correctly', () => {
    render(
      <AgentCard
        agent={mockAgent}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onRun={mockOnRun}
      />
    );

    expect(screen.getByText('Test Agent')).toBeInTheDocument();
    expect(screen.getByText('A test agent')).toBeInTheDocument();
    expect(screen.getByText('gpt-4o')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('example')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <AgentCard
        agent={mockAgent}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onRun={mockOnRun}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockAgent);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <AgentCard
        agent={mockAgent}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onRun={mockOnRun}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockAgent);
  });

  it('calls onRun when run button is clicked', () => {
    render(
      <AgentCard
        agent={mockAgent}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onRun={mockOnRun}
      />
    );

    fireEvent.click(screen.getByText('Run'));
    expect(mockOnRun).toHaveBeenCalledWith(mockAgent);
  });
});
```

## Deployment

### Podman Setup

Create a `Containerfile` for the UI:

```
FROM node:16-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create an `nginx.conf` file:

```
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://api:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Security Considerations

- Implement proper authentication and authorization
- Use HTTPS in production
- Validate all inputs
- Sanitize outputs
- Implement proper error handling
- Use secure storage for tokens
- Regularly update dependencies
- Implement CSP (Content Security Policy)

## Performance Considerations

- Use code splitting for better load times
- Implement lazy loading for components
- Optimize images and assets
- Use memoization for expensive calculations
- Implement virtualization for long lists
- Use efficient state management
- Implement caching strategies
- Optimize bundle size