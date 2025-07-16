import { memo, useState } from 'react';
import { Dialog, DialogRoot, DialogTitle, DialogDescription } from '~/components/ui/Dialog';
import { IconButton } from '~/components/ui/IconButton';

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  framework: string;
  files: Record<string, string>;
  dependencies: string[];
}

const projectTemplates: ProjectTemplate[] = [
  {
    id: 'nextjs-starter',
    name: 'Next.js App',
    description: 'Modern React framework with SSR and routing',
    icon: 'i-logos:nextjs-icon',
    framework: 'nextjs',
    files: {
      'package.json': JSON.stringify({
        name: 'nextjs-app',
        version: '0.1.0',
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start'
        },
        dependencies: {
          next: '^14.0.0',
          react: '^18.0.0',
          'react-dom': '^18.0.0'
        }
      }, null, 2),
      'pages/index.js': `export default function Home() {
  return (
    <div>
      <h1>Welcome to Next.js!</h1>
      <p>Get started by editing pages/index.js</p>
    </div>
  );
}`,
      'pages/_app.js': `export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}`
    },
    dependencies: ['next', 'react', 'react-dom']
  },
  {
    id: 'nuxt-starter',
    name: 'Nuxt.js App',
    description: 'Vue.js framework with SSR and auto-routing',
    icon: 'i-logos:nuxt-icon',
    framework: 'nuxt',
    files: {
      'package.json': JSON.stringify({
        name: 'nuxt-app',
        version: '1.0.0',
        scripts: {
          dev: 'nuxt dev',
          build: 'nuxt build',
          preview: 'nuxt preview'
        },
        dependencies: {
          nuxt: '^3.8.0',
          vue: '^3.3.0'
        }
      }, null, 2),
      'app.vue': `<template>
  <div>
    <h1>Welcome to Nuxt!</h1>
    <NuxtPage />
  </div>
</template>`,
      'pages/index.vue': `<template>
  <div>
    <h2>Home Page</h2>
    <p>This is the home page of your Nuxt app.</p>
  </div>
</template>`
    },
    dependencies: ['nuxt', 'vue']
  },
  {
    id: 'sveltekit-starter',
    name: 'SvelteKit App',
    description: 'Svelte framework with file-based routing',
    icon: 'i-logos:svelte-icon',
    framework: 'sveltekit',
    files: {
      'package.json': JSON.stringify({
        name: 'sveltekit-app',
        version: '0.0.1',
        scripts: {
          dev: 'vite dev',
          build: 'vite build',
          preview: 'vite preview'
        },
        dependencies: {
          '@sveltejs/kit': '^1.20.4',
          svelte: '^4.0.5'
        },
        devDependencies: {
          '@sveltejs/adapter-auto': '^2.0.0',
          vite: '^4.4.2'
        }
      }, null, 2),
      'src/routes/+layout.svelte': `<main>
  <slot />
</main>

<style>
  main {
    padding: 1rem;
  }
</style>`,
      'src/routes/+page.svelte': `<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>`
    },
    dependencies: ['@sveltejs/kit', 'svelte', '@sveltejs/adapter-auto', 'vite']
  },
  {
    id: 'rust-cli',
    name: 'Rust CLI App',
    description: 'Command-line application in Rust',
    icon: 'i-logos:rust',
    framework: 'rust',
    files: {
      'Cargo.toml': `[package]
name = "rust-cli-app"
version = "0.1.0"
edition = "2021"

[dependencies]
clap = "4.0"
serde = { version = "1.0", features = ["derive"] }`,
      'src/main.rs': `use clap::{Arg, Command};

fn main() {
    let matches = Command::new("rust-cli-app")
        .version("0.1.0")
        .author("Your Name")
        .about("A simple CLI app in Rust")
        .arg(
            Arg::new("name")
                .short('n')
                .long("name")
                .value_name("NAME")
                .help("Sets a custom name")
        )
        .get_matches();

    let name = matches.get_one::<String>("name").unwrap_or(&"World".to_string());
    println!("Hello, {}!", name);
}`
    },
    dependencies: []
  },
  {
    id: 'go-api',
    name: 'Go REST API',
    description: 'RESTful API server in Go',
    icon: 'i-logos:go',
    framework: 'go',
    files: {
      'go.mod': `module go-api

go 1.21

require (
    github.com/gorilla/mux v1.8.0
)`,
      'main.go': `package main

import (
    "encoding/json"
    "log"
    "net/http"
    "github.com/gorilla/mux"
)

type User struct {
    ID   string \`json:"id"\`
    Name string \`json:"name"\`
}

var users []User

func getUsers(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(users)
}

func main() {
    users = append(users, User{ID: "1", Name: "John Doe"})
    
    r := mux.NewRouter()
    r.HandleFunc("/users", getUsers).Methods("GET")
    
    log.Println("Server starting on :8000")
    log.Fatal(http.ListenAndServe(":8000", r))
}`
    },
    dependencies: []
  }
];

interface ProjectTemplatesProps {
  onCreateProject: (template: ProjectTemplate) => void;
}

export const ProjectTemplates = memo(({ onCreateProject }: ProjectTemplatesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'fullstack', name: 'Full Stack' }
  ];

  const filteredTemplates = projectTemplates.filter(template => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'frontend') return ['nextjs', 'nuxt', 'sveltekit'].includes(template.framework);
    if (selectedCategory === 'backend') return ['rust', 'go'].includes(template.framework);
    return false;
  });

  const handleCreateProject = (template: ProjectTemplate) => {
    onCreateProject(template);
    setIsOpen(false);
  };

  return (
    <>
      <IconButton
        icon="i-ph:plus-circle"
        title="Create from Template"
        onClick={() => setIsOpen(true)}
      />

      <DialogRoot open={isOpen}>
        <Dialog onClose={() => setIsOpen(false)} className="max-w-4xl">
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Choose from our collection of project templates to get started quickly.
          </DialogDescription>

          <div className="p-5">
            {/* Category Filter */}
            <div className="flex gap-2 mb-6">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text'
                      : 'bg-bolt-elements-button-secondary-background text-bolt-elements-button-secondary-text hover:bg-bolt-elements-button-secondary-backgroundHover'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className="p-4 border border-bolt-elements-borderColor rounded-lg hover:border-bolt-elements-borderColorActive transition-colors cursor-pointer"
                  onClick={() => handleCreateProject(template)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`text-2xl ${template.icon}`} />
                    <div>
                      <h3 className="font-medium text-bolt-elements-textPrimary">{template.name}</h3>
                      <p className="text-xs text-bolt-elements-textSecondary capitalize">{template.framework}</p>
                    </div>
                  </div>
                  <p className="text-sm text-bolt-elements-textSecondary">{template.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Dialog>
      </DialogRoot>
    </>
  );
});