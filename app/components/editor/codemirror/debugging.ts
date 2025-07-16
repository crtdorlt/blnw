import { EditorView, Decoration, type DecorationSet } from '@codemirror/view';
import { StateField, StateEffect, type Extension } from '@codemirror/state';
import { gutter, GutterMarker } from '@codemirror/view';

// Breakpoint marker
class BreakpointMarker extends GutterMarker {
  toDOM() {
    const marker = document.createElement('div');
    marker.className = 'cm-breakpoint';
    marker.innerHTML = '●';
    marker.style.color = '#ff4444';
    marker.style.cursor = 'pointer';
    marker.style.fontSize = '16px';
    marker.style.lineHeight = '1';
    return marker;
  }
}

// Current execution line marker
class ExecutionMarker extends GutterMarker {
  toDOM() {
    const marker = document.createElement('div');
    marker.className = 'cm-execution-line';
    marker.innerHTML = '▶';
    marker.style.color = '#44ff44';
    marker.style.cursor = 'pointer';
    marker.style.fontSize = '12px';
    marker.style.lineHeight = '1';
    return marker;
  }
}

// Effects for managing breakpoints
const addBreakpoint = StateEffect.define<number>();
const removeBreakpoint = StateEffect.define<number>();
const setExecutionLine = StateEffect.define<number | null>();

// State field for breakpoints
const breakpointState = StateField.define<Set<number>>({
  create() {
    return new Set();
  },
  update(breakpoints, tr) {
    const newBreakpoints = new Set(breakpoints);
    
    for (const effect of tr.effects) {
      if (effect.is(addBreakpoint)) {
        newBreakpoints.add(effect.value);
      } else if (effect.is(removeBreakpoint)) {
        newBreakpoints.delete(effect.value);
      }
    }
    
    return newBreakpoints;
  }
});

// State field for execution line
const executionLineState = StateField.define<number | null>({
  create() {
    return null;
  },
  update(executionLine, tr) {
    for (const effect of tr.effects) {
      if (effect.is(setExecutionLine)) {
        return effect.value;
      }
    }
    return executionLine;
  }
});

// Gutter extension for debugging
const debugGutter = gutter({
  class: 'cm-debug-gutter',
  markers: (view) => {
    const breakpoints = view.state.field(breakpointState);
    const executionLine = view.state.field(executionLineState);
    const markers = [];
    
    // Add breakpoint markers
    for (const line of breakpoints) {
      markers.push(new BreakpointMarker().range(view.state.doc.line(line + 1).from));
    }
    
    // Add execution line marker
    if (executionLine !== null) {
      markers.push(new ExecutionMarker().range(view.state.doc.line(executionLine + 1).from));
    }
    
    return markers;
  },
  initialSpacer: () => new BreakpointMarker(),
  domEventHandlers: {
    click: (view, line) => {
      const lineNumber = view.state.doc.lineAt(line.from).number - 1;
      const breakpoints = view.state.field(breakpointState);
      
      if (breakpoints.has(lineNumber)) {
        view.dispatch({ effects: removeBreakpoint.of(lineNumber) });
      } else {
        view.dispatch({ effects: addBreakpoint.of(lineNumber) });
      }
      
      return true;
    }
  }
});

// Debug interface
export interface DebugSession {
  addBreakpoint: (line: number) => void;
  removeBreakpoint: (line: number) => void;
  setExecutionLine: (line: number | null) => void;
  getBreakpoints: () => Set<number>;
  step: () => void;
  continue: () => void;
  pause: () => void;
  stop: () => void;
}

export function createDebugSession(view: EditorView): DebugSession {
  return {
    addBreakpoint: (line: number) => {
      view.dispatch({ effects: addBreakpoint.of(line) });
    },
    removeBreakpoint: (line: number) => {
      view.dispatch({ effects: removeBreakpoint.of(line) });
    },
    setExecutionLine: (line: number | null) => {
      view.dispatch({ effects: setExecutionLine.of(line) });
    },
    getBreakpoints: () => {
      return view.state.field(breakpointState);
    },
    step: () => {
      // Implement step debugging logic
      console.log('Step debugging');
    },
    continue: () => {
      // Implement continue debugging logic
      console.log('Continue debugging');
    },
    pause: () => {
      // Implement pause debugging logic
      console.log('Pause debugging');
    },
    stop: () => {
      // Implement stop debugging logic
      view.dispatch({ effects: setExecutionLine.of(null) });
      console.log('Stop debugging');
    }
  };
}

export const debugExtension: Extension = [
  breakpointState,
  executionLineState,
  debugGutter,
  EditorView.theme({
    '.cm-debug-gutter': {
      width: '20px',
      backgroundColor: 'var(--cm-gutter-backgroundColor)',
    },
    '.cm-breakpoint': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    },
    '.cm-execution-line': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    }
  })
];