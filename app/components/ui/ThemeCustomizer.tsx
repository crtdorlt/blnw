import { useStore } from '@nanostores/react';
import { memo, useState } from 'react';
import { themeStore, toggleTheme } from '~/lib/stores/theme';
import { IconButton } from './IconButton';
import { Dialog, DialogRoot, DialogTitle, DialogDescription } from './Dialog';

interface ThemeCustomizerProps {
  className?: string;
}

interface CustomTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
}

const predefinedThemes: CustomTheme[] = [
  {
    name: 'Ocean Blue',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#38bdf8',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9'
    }
  },
  {
    name: 'Forest Green',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      background: '#064e3b',
      surface: '#065f46',
      text: '#ecfdf5'
    }
  },
  {
    name: 'Sunset Orange',
    colors: {
      primary: '#ea580c',
      secondary: '#c2410c',
      accent: '#fb923c',
      background: '#431407',
      surface: '#7c2d12',
      text: '#fed7aa'
    }
  },
  {
    name: 'Purple Haze',
    colors: {
      primary: '#7c3aed',
      secondary: '#6d28d9',
      accent: '#a855f7',
      background: '#2e1065',
      surface: '#4c1d95',
      text: '#e9d5ff'
    }
  }
];

export const ThemeCustomizer = memo(({ className }: ThemeCustomizerProps) => {
  const theme = useStore(themeStore);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<CustomTheme | null>(null);

  const applyCustomTheme = (customTheme: CustomTheme) => {
    const root = document.documentElement;
    
    // Apply custom CSS variables
    root.style.setProperty('--custom-primary', customTheme.colors.primary);
    root.style.setProperty('--custom-secondary', customTheme.colors.secondary);
    root.style.setProperty('--custom-accent', customTheme.colors.accent);
    root.style.setProperty('--custom-background', customTheme.colors.background);
    root.style.setProperty('--custom-surface', customTheme.colors.surface);
    root.style.setProperty('--custom-text', customTheme.colors.text);
    
    // Store in localStorage
    localStorage.setItem('customTheme', JSON.stringify(customTheme));
    setSelectedTheme(customTheme);
  };

  const resetToDefault = () => {
    const root = document.documentElement;
    
    // Remove custom CSS variables
    root.style.removeProperty('--custom-primary');
    root.style.removeProperty('--custom-secondary');
    root.style.removeProperty('--custom-accent');
    root.style.removeProperty('--custom-background');
    root.style.removeProperty('--custom-surface');
    root.style.removeProperty('--custom-text');
    
    localStorage.removeItem('customTheme');
    setSelectedTheme(null);
  };

  return (
    <>
      <IconButton
        className={className}
        icon="i-ph:palette-duotone"
        size="xl"
        title="Customize Theme"
        onClick={() => setIsOpen(true)}
      />
      
      <DialogRoot open={isOpen}>
        <Dialog onClose={() => setIsOpen(false)}>
          <DialogTitle>Theme Customizer</DialogTitle>
          <DialogDescription>
            Choose from predefined themes or create your own custom theme.
          </DialogDescription>
          
          <div className="p-5 space-y-4">
            {/* Current Theme Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Theme:</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1 rounded-md bg-bolt-elements-button-secondary-background hover:bg-bolt-elements-button-secondary-backgroundHover text-bolt-elements-button-secondary-text"
              >
                <div className={theme === 'dark' ? 'i-ph:moon-stars-duotone' : 'i-ph:sun-dim-duotone'} />
                {theme === 'dark' ? 'Dark' : 'Light'}
              </button>
            </div>
            
            {/* Predefined Themes */}
            <div>
              <h3 className="text-sm font-medium mb-3">Predefined Themes</h3>
              <div className="grid grid-cols-2 gap-3">
                {predefinedThemes.map((customTheme) => (
                  <button
                    key={customTheme.name}
                    onClick={() => applyCustomTheme(customTheme)}
                    className="p-3 rounded-lg border border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: customTheme.colors.primary }}
                      />
                      <span className="text-sm font-medium">{customTheme.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {Object.values(customTheme.colors).map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Reset Button */}
            <div className="flex justify-between pt-4 border-t border-bolt-elements-borderColor">
              <button
                onClick={resetToDefault}
                className="px-4 py-2 text-sm rounded-md bg-bolt-elements-button-secondary-background hover:bg-bolt-elements-button-secondary-backgroundHover text-bolt-elements-button-secondary-text"
              >
                Reset to Default
              </button>
              
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm rounded-md bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text"
              >
                Done
              </button>
            </div>
          </div>
        </Dialog>
      </DialogRoot>
    </>
  );
});