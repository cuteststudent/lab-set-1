

export function highlight(file, line) {
  // Highlight
  fetch('http://localhost:3333', {
    method: 'POST',
    body: JSON.stringify({ 
      file: file, 
      line: line,
      action: 'highlight'
    })
  });
}

// Or for breakpoint on demand:
function setBreakpointInEditor(file, line) {
  fetch('http://localhost:3333', {
    method: 'POST',
    body: JSON.stringify({ 
      file, 
      line,
      action: 'breakpoint'
    })
  });
}