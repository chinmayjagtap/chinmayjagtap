const navigateToWebsite = (path) => {
    window.location.href = path;
}
function showSpinner() {
    const spinner = document.getElementById('loading-spinner');
    console.log(spinner);
    
    spinner.classList.remove('spinner-hidden');
}

// Function to hide the spinner
function hideSpinner() {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.add('spinner-hidden');
}

class BashShell {
    constructor() {

        this.currentPath = '/home/user';
        this.defaultHelp = 0;
        this.homeDir = '/home/user';
        this.commandHistory = [];
        this.historyIndex = -1;
        this.username = 'user';
        this.hostname = 'localhost';
        this.environment = {
            'HOME': '/home/user',
            'PATH': '/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin',
            'USER': 'user',
            'SHELL': '/bin/bash',
            'PWD': '/home/user'
        };

        this.fileSystem = {
            '/': {
                type: 'directory',
                permissions: 'drwxr-xr-x',
                owner: 'root',
                group: 'root',
                contents: {
                    'home': {
                        type: 'directory',
                        permissions: 'drwxr-xr-x',
                        owner: 'user',
                        group: 'user',
                        contents: {
                            'user': {
                                type: 'directory',
                                permissions: 'drwxr-xr-x',
                                owner: 'user',
                                group: 'user',
                                contents: {
                                    'file.txt': {
                                        type: 'file',
                                        permissions: '-rw-r--r--',
                                        owner: 'user',
                                        group: 'user',
                                        content: 'Hello, world!'
                                    },
                                    '.hidden': {
                                        type: 'file',
                                        permissions: '-rw-------',
                                        owner: 'user',
                                        group: 'user',
                                        content: 'This is a hidden file.'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        
        this.commands = {
            'help': this.showHelp.bind(this),
            'web': this.openGui.bind(this),
            'cv': this.downloadCV.bind(this),
            'echo': this.echo.bind(this),
            'date': this.showDate.bind(this),
            'whoami': this.whoami.bind(this),
            'git': console.log("https://github.com/chinmayjagtap"),
            'linkedin': console.log("https://www.linkedin.com/in/chinmayjagtap/"),
            'stack': console.log("https://stackoverflow.com/users/2226901/chinmayjagtap"),
            'ai': console.log("https://huggingface.co/chinmayjagtap"),
            'history': this.showHistory.bind(this),
            'gui': this.openGui.bind(this),
            'exit': this.openGui.bind(this)
        };

        this.init();
        setTimeout(() => {
            this.showHelp();    
        }, 700); 
        
    }

    init() {
        this.outputEl = document.getElementById('output');
        this.inputEl = document.getElementById('command-input');
        this.promptEl = document.getElementById('prompt');
        this.cursorEl = document.getElementById('cursor');

        this.inputEl.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.inputEl.focus();
        
        this.inputEl.addEventListener('focus', () => {
            this.cursorEl.style.display = 'none';
        });
        
        this.inputEl.addEventListener('blur', () => {
            this.cursorEl.style.display = 'inline-block';
        });

        // this.updatePrompt();
        
    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            const command = this.inputEl.value.trim();
            this.executeCommand(command);
            this.inputEl.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory(1);
        } 
        
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex += direction;
        if (this.historyIndex < 0) this.historyIndex = 0;
        if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.inputEl.value = '';
            return;
        }
        
        this.inputEl.value = this.commandHistory[this.historyIndex];
    }

    executeCommand(commandLine) {
        commandLine = commandLine.toLowerCase();
        if (!commandLine || commandLine.trim() === '') {
            return; // Ignore empty commands
            
        }
        console.log(`Executing command: ${commandLine}`);
        
        if (commandLine) {
            this.commandHistory.unshift(commandLine);
            this.historyIndex = -1;
        }

        switch (commandLine) {
            case "git":
                showSpinner();
                return navigateToWebsite("https://github.com/chinmayjagtap")
                break;
            case "linkedin":
                showSpinner();
                return navigateToWebsite("https://www.linkedin.com/in/chinmayjagtap/")
                break;
            case "stack":
                showSpinner();
                return navigateToWebsite("https://stackoverflow.com/users/2226901/chinmayjagtap")
                break;
            case "ai":
                showSpinner();
                return navigateToWebsite("https://huggingface.co/chinmayjagtap/")
                break;
        
            default:
                break;
        }

        this.addOutput(`${this.promptEl.textContent} ${commandLine}`);
        
        if (!commandLine) return;

        // Handle pipes and redirections (basic support)
        const parts = commandLine.split(/\s+/);
        const command = parts[0];
        const args = parts.slice(1);

        if (this.commands[command]) {
            this.commands[command](args);
        } else {
            this.addOutput(`bash: ${command}: command not found`, 'error');
        }
    }

    addOutput(text, className = '') {
        console.log("className", className);
        
        const div = document.createElement('div');
        div.textContent = text;
        if (className) div.className = className;
        this.outputEl.appendChild(div);
        this.outputEl.scrollTop = this.outputEl.scrollHeight;
    }

    showHelp() {
        const helpText = `Available commands:\n
help     - Show this help message
web      - Go to Web Profile
cv       - Download CV (Resume)
echo     - Display text
date     - Show current date and time
whoami   - Show current username\n
git      - Show github profile
linkedin - Show Linkedin profile
stack    - Show StackOverflow profile
ai       - Show AI related profile\n
history  - Show command history
gui      - Open graphical interface (Web Profile)
exit     - Exit shell`;
        this.addOutput(helpText, 'help-text');

        // setTimeout(() => {
        //     this.openGui();    
        // }, 7000);
    }

    downloadCV() {
        // download file - Anshuman_CV_Profile_cleaned.doc
        this.addOutput('Downloading CV (Resume)...', 'system-info');

        const url = 'resumes/chinmayresume.doc';

        // Use fetch to get the file as a blob and force a download. This works
        // when the site is served over HTTP and avoids popup blockers.
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.blob();
            })
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'chinmayresume.doc';
                // Some browsers require the link to be in the DOM
                document.body.appendChild(a);
                a.click();
                a.remove();
                // Revoke the object URL after a short delay to ensure download starts
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                this.addOutput('Download started.', 'success');
            })
            .catch(err => {
                // Fallback: try opening the file in a new tab/window
                this.addOutput(`Download failed: ${err.message}. Opening file in a new tab...`, 'error');
                try {
                    window.open(url, '_blank');
                } catch (e) {
                    this.addOutput('Unable to open file automatically. Please download manually: ' + url, 'error');
                }
            });
    }

    clearScreen() {
        this.outputEl.innerHTML = '';
    }

    echo(args) {
        let text = args.join(' ');
        
        // Simple environment variable substitution
        text = text.replace(/\$(\w+)/g, (match, varName) => {
            return this.environment[varName] || '';
        });
        
        this.addOutput(text);
    }

    showDate() {
        const now = new Date();
        this.addOutput(now.toString(), 'system-info');
    }

    whoami() {
        this.addOutput(this.username);
    }

    uname(args) {
        if (args.includes('-a')) {
            this.addOutput('Linux localhost 5.4.0-74-generic #83-Ubuntu SMP Sat May 8 02:35:39 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux', 'system-info');
        } else {
            this.addOutput('Linux', 'system-info');
        }
    }

    showHistory() {
        this.commandHistory.slice().reverse().forEach((cmd, index) => {
            this.addOutput(`${(index + 1).toString().padStart(4)} ${cmd}`);
        });
    }

    

    openGui({this: any, profile}) {
        console.log("from", profile);
        
        this.addOutput('Launching graphical interface...', 'system-info');
        this.addOutput('Opening Claude.ai in new window...', 'success');
        
        // Create a clickable link
        const linkDiv = document.createElement('div');
        linkDiv.innerHTML = `<span class="link">→ https://claude.ai</span>`;
        linkDiv.className = 'link';
        linkDiv.style.cursor = 'pointer';
        linkDiv.style.textDecoration = 'underline';
        
        linkDiv.addEventListener('click', () => {
            window.location.href = 'about.html';
        });
        
        this.outputEl.appendChild(linkDiv);
        this.outputEl.scrollTop = this.outputEl.scrollHeight;
        
        // Also automatically open in new tab
        setTimeout(() => {
            window.location.href = 'about.html';
        }, 500);
    }

    exit() {
        this.addOutput('logout', 'success');
        this.inputEl.disabled = true;
    }

    // Helper methods
    getDirectoryByPath(path) {
        if (!path) return null;
        
        const normalizedPath = this.normalizePath(path);
        const parts = normalizedPath.split('/').filter(p => p);
        
        let current = this.fileSystem['/'];
        for (const part of parts) {
            if (part === '..') {
                // Handle parent directory
                continue;
            }
            if (current.contents && current.contents[part]) {
                current = current.contents[part];
            } else {
                return null;
            }
        }
        return current;
    }

    getCurrentDirectory() {
        return this.getDirectoryByPath(this.currentPath);
    }

    resolvePath(basePath, relativePath) {
        if (relativePath.startsWith('/')) return relativePath;
        
        const parts = basePath.split('/').filter(p => p);
        const relativeParts = relativePath.split('/').filter(p => p);
        
        for (const part of relativeParts) {
            if (part === '..') {
                parts.pop();
            } else if (part !== '.') {
                parts.push(part);
            }
        }
        
        return '/' + parts.join('/');
    }

    normalizePath(path) {
        if (!path.startsWith('/')) {
            path = this.resolvePath(this.currentPath, path);
        }
        
        const parts = path.split('/').filter(p => p);
        const normalizedParts = [];
        
        for (const part of parts) {
            if (part === '..') {
                normalizedParts.pop();
            } else if (part !== '.') {
                normalizedParts.push(part);
            }
        }
        
        return '/' + normalizedParts.join('/');
    }

    deleteFromPath(path) {
        const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
        const itemName = path.substring(path.lastIndexOf('/') + 1);
        const parentDir = this.getDirectoryByPath(parentPath);
        
        if (parentDir && parentDir.contents) {
            delete parentDir.contents[itemName];
        }
    }

    updatePrompt() {
        const shortPath = this.currentPath === this.homeDir ? '~' : 
                         this.currentPath.startsWith(this.homeDir) ? 
                         '~' + this.currentPath.substring(this.homeDir.length) : 
                         this.currentPath;
        this.promptEl.textContent = `${this.username}@${this.hostname}:${shortPath}$`;
    }
}

// window.addEventListener('load', () => {
//     console.log('BashShell loaded');
    
//     new BashShell();
// });
