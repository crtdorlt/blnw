import { autocompletion, completionKeymap, type CompletionContext, type CompletionResult } from '@codemirror/autocomplete';
import { keymap } from '@codemirror/view';
import { detectFramework } from './languages';

// Enhanced completion for different frameworks
const frameworkCompletions = {
  nextjs: [
    { label: 'useState', type: 'function', info: 'React hook for state management' },
    { label: 'useEffect', type: 'function', info: 'React hook for side effects' },
    { label: 'useRouter', type: 'function', info: 'Next.js router hook' },
    { label: 'getServerSideProps', type: 'function', info: 'Next.js server-side rendering' },
    { label: 'getStaticProps', type: 'function', info: 'Next.js static generation' },
    { label: 'Image', type: 'class', info: 'Next.js optimized image component' },
    { label: 'Link', type: 'class', info: 'Next.js client-side navigation' },
  ],
  nuxt: [
    { label: 'useNuxtData', type: 'function', info: 'Access cached data' },
    { label: 'useFetch', type: 'function', info: 'Fetch data with SSR support' },
    { label: 'useAsyncData', type: 'function', info: 'Handle async data fetching' },
    { label: 'navigateTo', type: 'function', info: 'Programmatic navigation' },
    { label: 'definePageMeta', type: 'function', info: 'Define page metadata' },
  ],
  sveltekit: [
    { label: 'onMount', type: 'function', info: 'Svelte lifecycle function' },
    { label: 'beforeUpdate', type: 'function', info: 'Svelte lifecycle function' },
    { label: 'afterUpdate', type: 'function', info: 'Svelte lifecycle function' },
    { label: 'goto', type: 'function', info: 'SvelteKit navigation' },
    { label: 'page', type: 'variable', info: 'SvelteKit page store' },
  ],
};

// Language-specific completions
const languageCompletions = {
  rust: [
    { label: 'fn', type: 'keyword', info: 'Function declaration' },
    { label: 'let', type: 'keyword', info: 'Variable binding' },
    { label: 'mut', type: 'keyword', info: 'Mutable variable' },
    { label: 'impl', type: 'keyword', info: 'Implementation block' },
    { label: 'struct', type: 'keyword', info: 'Structure definition' },
    { label: 'enum', type: 'keyword', info: 'Enumeration definition' },
    { label: 'match', type: 'keyword', info: 'Pattern matching' },
    { label: 'Vec::new()', type: 'function', info: 'Create new vector' },
    { label: 'println!', type: 'macro', info: 'Print to stdout' },
  ],
  go: [
    { label: 'func', type: 'keyword', info: 'Function declaration' },
    { label: 'var', type: 'keyword', info: 'Variable declaration' },
    { label: 'const', type: 'keyword', info: 'Constant declaration' },
    { label: 'type', type: 'keyword', info: 'Type declaration' },
    { label: 'struct', type: 'keyword', info: 'Structure definition' },
    { label: 'interface', type: 'keyword', info: 'Interface definition' },
    { label: 'go', type: 'keyword', info: 'Goroutine' },
    { label: 'chan', type: 'keyword', info: 'Channel type' },
    { label: 'fmt.Println', type: 'function', info: 'Print to stdout' },
  ],
  java: [
    { label: 'public', type: 'keyword', info: 'Public access modifier' },
    { label: 'private', type: 'keyword', info: 'Private access modifier' },
    { label: 'protected', type: 'keyword', info: 'Protected access modifier' },
    { label: 'class', type: 'keyword', info: 'Class declaration' },
    { label: 'interface', type: 'keyword', info: 'Interface declaration' },
    { label: 'extends', type: 'keyword', info: 'Class inheritance' },
    { label: 'implements', type: 'keyword', info: 'Interface implementation' },
    { label: 'System.out.println', type: 'function', info: 'Print to stdout' },
  ],
  csharp: [
    { label: 'public', type: 'keyword', info: 'Public access modifier' },
    { label: 'private', type: 'keyword', info: 'Private access modifier' },
    { label: 'protected', type: 'keyword', info: 'Protected access modifier' },
    { label: 'class', type: 'keyword', info: 'Class declaration' },
    { label: 'interface', type: 'keyword', info: 'Interface declaration' },
    { label: 'namespace', type: 'keyword', info: 'Namespace declaration' },
    { label: 'using', type: 'keyword', info: 'Using directive' },
    { label: 'Console.WriteLine', type: 'function', info: 'Print to stdout' },
  ],
};

function getCompletions(context: CompletionContext, fileName: string, files: Record<string, any>): CompletionResult | null {
  const word = context.matchBefore(/\w*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  const framework = detectFramework(files);
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  
  let completions: any[] = [];

  // Add framework-specific completions
  if (framework && frameworkCompletions[framework as keyof typeof frameworkCompletions]) {
    completions.push(...frameworkCompletions[framework as keyof typeof frameworkCompletions]);
  }

  // Add language-specific completions
  if (fileExtension) {
    const langKey = fileExtension === 'rs' ? 'rust' : 
                   fileExtension === 'go' ? 'go' :
                   fileExtension === 'java' ? 'java' :
                   fileExtension === 'cs' ? 'csharp' : null;
    
    if (langKey && languageCompletions[langKey as keyof typeof languageCompletions]) {
      completions.push(...languageCompletions[langKey as keyof typeof languageCompletions]);
    }
  }

  return {
    from: word.from,
    options: completions
  };
}

export function createEnhancedCompletion(fileName: string, files: Record<string, any>) {
  return autocompletion({
    override: [
      (context) => getCompletions(context, fileName, files)
    ],
    closeOnBlur: false,
    activateOnTyping: true,
    maxRenderedOptions: 20,
  });
}

export const enhancedCompletionKeymap = keymap.of([
  ...completionKeymap,
  { key: 'Ctrl-Space', run: (view) => {
    const completion = view.state.languageDataAt('autocomplete', view.state.selection.main.head);
    return true;
  }},
]);