const output = document.getElementById("output");
const input = document.getElementById("cmd");

const commands = {
  help: `Available commands:<br>
  help - Show this help message<br>
  web - Go to Web Profile<br>
  cv - Download CV (Resume)<br>
  echo - Display text<br>
  date - Show current date and time<br>
  whoami - Show current username<br>
  git - Show GitHub profile<br>
  linkedin - Show LinkedIn profile<br>
  stack - Show StackOverflow profile<br>
  ai - Show AI related profile<br>
  history - Show command history<br>
  gui - Open graphical interface (Web Profile)<br>
  exit - Exit shell<br>`,

  web: () => openLink("https://yourwebsite.github.io"),
  cv: () => openLink("https://yourwebsite.github.io/resume.pdf"),
  git: () => openLink("https://github.com/yourusername"),
  linkedin: () => openLink("https://linkedin.com/in/yourusername"),
  stack: () => openLink("https://stackoverflow.com/users/yourid"),
  ai: () => openLink("https://huggingface.co/yourprofile"),
  date: () => new Date().toString(),
  whoami: "user",
  echo: (args) => args.join(" "),
  gui: () => openLink("https://yourwebsite.github.io/gui"),
  exit: () => "Session terminated. Bye 👋"
};

let history = [];
let historyIndex = 0;

function openLink(url) {
  window.open(url, "_blank");
  return `Opening ${url} ...`;
}

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const commandLine = input.value.trim();
    if (!commandLine) return;

    history.push(commandLine);
    historyIndex = history.length;

    output.innerHTML += `<div><span class="prompt">user@localhost:~$</span> ${commandLine}</div>`;
    processCommand(commandLine);
    input.value = "";
    window.scrollTo(0, document.body.scrollHeight);
  }

  if (event.key === "ArrowUp") {
    if (historyIndex > 0) input.value = history[--historyIndex];
  } else if (event.key === "ArrowDown") {
    if (historyIndex < history.length - 1) input.value = history[++historyIndex];
    else input.value = "";
  }
});

function processCommand(inputText) {
  const [cmd, ...args] = inputText.split(" ");
  const command = commands[cmd];

  let result = "";
  if (typeof command === "function") result = command(args);
  else if (typeof command === "string") result = command;
  else result = `Command not found: ${cmd}. Type 'help' for available commands.`;

  output.innerHTML += `<div>${result}</div><br>`;
}
showHelpOnLoad();
