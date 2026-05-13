const vscode = require('vscode');
const http = require('http');
const url = require('url');
const path = require('path');

vscode.window.showInformationMessage('Workspace Integration Loaded!');

module.exports.activate = function(context) {
  vscode.window.showInformationMessage('Workspace Integration Activated!');
  
  // Track current decoration
  let currentDecoration = null;
  let currentEditor = null;
  
  const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    try {
      const parsedUrl = url.parse(req.url, true);
      const query = parsedUrl.query;
      
      let file, line, action;
      
      if (req.method === 'GET') {
        file = query.file;
        line = parseInt(query.line);
        action = query.action;
        
        if (!file || !line || !action) {
          res.writeHead(400);
          res.end('Missing params: action, file, line');
          return;
        }
        
        if (action === 'highlight') {
          await vscode.commands.executeCommand('workspace-integration.highlight', file, line);
        } else if (action === 'breakpoint') {
          await vscode.commands.executeCommand('workspace-integration.breakpoint', file, line);
        }
        
        res.writeHead(200);
        res.end('OK');
        
      } else if (req.method === 'POST') {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', async () => {
          const { file: postFile, line: postLine, action: postAction } = JSON.parse(data);
          
          if (postAction === 'highlight') {
            await vscode.commands.executeCommand('workspace-integration.highlight', postFile, postLine);
          } else if (postAction === 'breakpoint') {
            await vscode.commands.executeCommand('workspace-integration.breakpoint', postFile, postLine);
          }
          
          res.writeHead(200);
          res.end('OK');
        });
        
      } else {
        res.writeHead(405);
        res.end('Method not allowed');
      }
      
    } catch (err) {
      vscode.window.showErrorMessage('Error: ' + err.message);
      res.writeHead(400);
      res.end('Error: ' + err.message);
    }
  });

  server.listen(3333, () => {
    vscode.window.showInformationMessage('Server listening on 3333');
  });

  // Helper to resolve file path relative to workspace
  function resolveFilePath(filePath) {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      throw new Error('No workspace open');
    }
    
    return path.isAbsolute(filePath) 
      ? filePath 
      : path.join(workspaceFolder.uri.fsPath, filePath);
  }

  // Highlight command
  let highlight = vscode.commands.registerCommand('workspace-integration.highlight', async (filePath, lineNum) => {
    // Clear old decoration immediately
    if (currentEditor && currentDecoration) {
      currentEditor.setDecorations(currentDecoration, []);
    }
    
    const absolutePath = resolveFilePath(filePath);
    const uri = vscode.Uri.file(absolutePath);
    
    // Find editor with this file (don't open it)
    let editor = vscode.window.visibleTextEditors.find(ed => ed.document.uri.fsPath === absolutePath);
    
    /*if (!editor) {
      // File not visible, just open the document without showing it
      const doc = await vscode.workspace.openTextDocument(uri);
      vscode.window.showTextDocument(doc, { preview: true, preserveFocus: true });
      editor = vscode.window.visibleTextEditors.find(ed => ed.document.uri.fsPath === absolutePath);
    }*/
    
    if (!editor) return;
    
    const line = editor.document.lineAt(lineNum - 1);
    const decoration = vscode.window.createTextEditorDecorationType({
      backgroundColor: 'rgba(200, 255, 0, 0.2)',
      border: '1px solid green',
      isWholeLine: true
    });
    
    editor.setDecorations(decoration, [line.range]);
    
    // Track for next highlight
    currentDecoration = decoration;
    currentEditor = editor;
    
    // Auto-clear after 3 seconds
    setTimeout(() => {
      if (currentEditor === editor && currentDecoration === decoration) {
        currentEditor.setDecorations(decoration, []);
        currentDecoration = null;
        currentEditor = null;
      }
    }, 3000);
  });

  // Breakpoint command
  let breakpoint = vscode.commands.registerCommand('workspace-integration.breakpoint', async (filePath, lineNum) => {
    const absolutePath = resolveFilePath(filePath);
    const uri = vscode.Uri.file(absolutePath);
    const doc = await vscode.workspace.openTextDocument(uri);
    
    const session = vscode.debug.activeDebugSession;
    if (!session) {
      vscode.window.showErrorMessage('No active debug session. Start debugging first.');
      return;
    }
    
    await session.customRequest('setBreakpoints', {
      source: { path: absolutePath },
      breakpoints: [{ line: lineNum }]
    });
    
    vscode.window.showInformationMessage(`Breakpoint set at ${filePath}:${lineNum}`);
  });

  context.subscriptions.push(highlight, breakpoint);
};

module.exports.deactivate = function() {};