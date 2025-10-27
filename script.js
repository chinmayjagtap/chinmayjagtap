// script.js - terminal behavior and commands
const outputEl = document.getElementById("output");
const inputEl = document.getElementById("cmd");

const commands = {
  help: `Available commands:<br>
  help - Show this help message<br>
  web - Go to Web Profile (opens GUI page)<br>
  cv - Download CV (resume.pdf) from repo<br>
  echo - Display text<br>
  date - Show current date and time<br>
  whoami - Show current username<br>
  git - Open GitHub profile<br>
  linkedin - Open LinkedIn profile<br>
  ai - My Huggingface<br>
  mybook - Open my own published book page<br>
  history - Show command history<br>
  gui - Open graphical interface (About Me page)<br>
  exit - Exit shell (clears screen)<br>`,

  web: () => { openLink("about.html"); return "Opening GUI page..."; },
  gui: () => { openLink("about.html"); return "Opening GUI page..."; },
  cv: () => { openLink("resume.pdf"); return "Downloading resume.pdf ..."; },
  git: () => { openLink("https://github.com/chinmayjagtap"); return "Opening GitHub..."; },
  linkedin: () => { openLink("https://www.linkedin.com/in/chinmayjagtap/"); return "Opening LinkedIn..."; },
  ai: () => "AI profile not set yet. Add link to commands in script.js.",
  date: () => new Date().toString(),
  whoami: "User",
  echo: (args) => args.join(" "),
  mybook: () => { openLink("https://amzn.in/d/6lJCgCK"); return "Opening book link..."; },
  history: () => showHistory(),
  helptext: () => commands.help,
  exit: () => {
    // clear the terminal output
    outputEl.innerHTML = '';
    // re-show welcome + help automatically
    appendWelcome();
    appendHelp();
    return "Session terminated. (Terminal cleared)";
  }
};

let history = [];
let historyIndex = 0;

function openLink(url){
  try{
    window.open(url, "_blank");
  }catch(e){
    // fallback: change location
    window.location.href = url;
  }
}

function appendHtml(html){
  const div = document.createElement("div");
  div.className = "result";
  div.innerHTML = html;
  outputEl.appendChild(div);
  outputEl.scrollTop = outputEl.scrollHeight;
}

function appendCommandEcho(cmd){
  const d = document.createElement("div");
  d.className = "command";
  d.innerHTML = `<span class="prompt">user@localhost:~$</span> ${escapeHtml(cmd)}`;
  outputEl.appendChild(d);
}

function escapeHtml(text){
  if(!text) return "";
  return text.replace(/[&<>"'`]/g, (s) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"
  }[s]));
}

function processCommandLine(line){
  if(!line.trim()) return;
  const parts = line.trim().split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  appendCommandEcho(line);

  // found in commands?
  if(commands.hasOwnProperty(cmd)){
    const handler = commands[cmd];
    if(typeof handler === "function"){
      const res = handler(args);
      if(res) appendHtml(res);
    } else {
      appendHtml(handler);
    }
  } else {
    appendHtml(`Command not found: ${escapeHtml(cmd)}. Type 'help' for available commands.`);
  }
}

inputEl.addEventListener("keydown", (ev) => {
  if(ev.key === "Enter"){
    const value = inputEl.value;
    if(!value) return;
    history.push(value);
    historyIndex = history.length;
    processCommandLine(value);
    inputEl.value = "";
  } else if(ev.key === "ArrowUp"){
    if(historyIndex > 0) historyIndex--, inputEl.value = history[historyIndex];
  } else if(ev.key === "ArrowDown"){
    if(historyIndex < history.length - 1) historyIndex++, inputEl.value = history[historyIndex];
    else inputEl.value = "";
  }
});

// show history output
function showHistory(){
  if(history.length === 0) return "No history.";
  return history.map((h, i) => `${i+1}. ${escapeHtml(h)}`).join("<br>");
}

// Auto-show welcome and help on load
function appendWelcome(){
  const welcome = `<div class="welcome">
    <div>Welcome to Bash <strong>Chinmay Anil Jagtap</strong> Profile</div>
    <div>AI Engineer | Python Developer | Automations Enthusiast</div>
    <div class="muted">Linux terminal 5.4.0 #1 SMP Mon Aug 18 2025</div>
    <div class="muted">Type 'help' for available commands. Type 'gui' for web page (GUI mode).</div>
  </div>`;
  appendHtml(welcome);
}

function appendHelp(){
  appendHtml(commands.help);
}

// helper: on load, display help
window.addEventListener("load", () => {
  // Clear initial content (index.html has a minimal welcome block already)
  outputEl.innerHTML = "";
  appendWelcome();
  appendHelp();
  inputEl.focus();
});

