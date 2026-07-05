// Simulated terminal — this is a fake command shell, not a real one.
// It parses input against a fixed command table and prints canned/generated
// output. Nothing here executes on your machine or any server.

(function () {
    const screen = document.getElementById("terminalScreen");
    const output = document.getElementById("terminalOutput");
    const input = document.getElementById("terminalInput");

    const PROMPT = "C:\\VISHAL>";

    const history = [];
    let historyIndex = -1;

    const files = {
        "about.txt":
            "Vishal — Backend Developer.\n" +
            "Learning DSA, Java, Spring Boot, Full Stack Development.\n" +
            "Mechanical Engineering background, pivoted into software.",
        "experience.txt":
            "Design Consultant — WIKA Instruments Pvt. Ltd.\n" +
            "Intern — Railway Coach Care Center\n" +
            "Certifications: NSIC AutoCAD, Google Cloud Generative AI",
        "projects.txt":
            "Windows 95 Portfolio — HTML / CSS / JavaScript\n" +
            "Library Management System — Java / MySQL\n" +
            "Weather App — JavaScript / public API\n" +
            "Roadscapes-VLM-Comparison — benchmarking Phi-3, Qwen2-VL, LLaVA, PaliGemma\n" +
            "  on road scene QA under day/night conditions",
        "contact.txt":
            "Email:    vishal05.official@gmail.com\n" +
            "GitHub:   github.com/Vishalofficail5\n" +
            "LinkedIn: linkedin.com/in/vishal05official\n" +
            "Location: New Delhi, India",
        "resume.pdf": "[binary file — run 'resume' to open it]"
    };

    function print(text, cls) {
        const line = document.createElement("div");
        line.className = "term-line" + (cls ? " " + cls : "");
        line.textContent = text;
        output.appendChild(line);
    }

    function printEcho(promptText, userText) {
        const line = document.createElement("div");
        line.className = "term-line";

        const p = document.createElement("span");
        p.textContent = promptText + " ";

        const e = document.createElement("span");
        e.className = "term-echo";
        e.textContent = userText;

        line.appendChild(p);
        line.appendChild(e);
        output.appendChild(line);
    }

    function scrollToBottom() {
        screen.scrollTop = screen.scrollHeight;
    }

    const commands = {
        help() {
            print("Available commands:");
            print("  help          show this list");
            print("  about         who is Vishal");
            print("  projects      list projects");
            print("  experience    work history & certifications");
            print("  contact       email / github / linkedin");
            print("  resume        open the resume PDF");
            print("  ls            list files");
            print("  cat <file>    print a file");
            print("  whoami        current user");
            print("  date          current date/time");
            print("  echo <text>   print text back");
            print("  clear         clear the screen");
            print("  exit          close this window");
        },
        about() { print(files["about.txt"]); },
        experience() { print(files["experience.txt"]); },
        projects() { print(files["projects.txt"]); },
        contact() { print(files["contact.txt"]); },
        resume() {
            print("Opening resume...", "term-ok");
            window.open("assets/Resume/Resume.pdf", "_blank");
        },
        ls() {
            Object.keys(files).forEach(f => print(f));
        },
        cat(args) {
            const name = args[0];
            if (!name) {
                print("usage: cat <file>", "term-error");
                return;
            }
            if (files[name]) {
                print(files[name]);
            } else {
                print(`The system cannot find the file specified: ${name}`, "term-error");
            }
        },
        whoami() { print("VISHAL\\guest"); },
        date() { print(new Date().toString()); },
        echo(args) { print(args.join(" ")); },
        clear() { output.innerHTML = ""; },
        exit() {
            const win = document.getElementById("terminalWindow");
            const closeBtn = win.querySelector(".closeBtn");
            if (closeBtn) closeBtn.click();
        },
        sudo() {
            print("guest is not in the sudoers file. This incident will be reported.", "term-error");
        }
    };

    function runCommand(raw) {
        const trimmed = raw.trim();
        printEcho(PROMPT, trimmed);

        if (!trimmed) return;

        history.push(trimmed);
        historyIndex = history.length;

        const [cmd, ...args] = trimmed.split(/\s+/);
        const key = cmd.toLowerCase();

        if (commands[key]) {
            commands[key](args);
        } else {
            print(
                `'${cmd}' is not recognized as an internal or external command, operable program or batch file.`,
                "term-error"
            );
        }
    }

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            runCommand(input.value);
            input.value = "";
            scrollToBottom();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = history[historyIndex];
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex < history.length - 1) {
                historyIndex++;
                input.value = history[historyIndex];
            } else {
                historyIndex = history.length;
                input.value = "";
            }
        }
    });

    screen.addEventListener("click", () => input.focus());

    // Boot banner, printed once on page load
    print("Microsoft(R) MS-DOS(R) Version 7.10 — Portfolio Shell");
    print("(C) Copyright Vishal 2026. All rights reserved.");
    print("");
    print("Type 'help' to see available commands.");
    print("");

    // Called by desktop.js when the terminal window is opened, so the
    // cursor is focused and typing works immediately.
    window.focusTerminal = function () {
        setTimeout(() => input.focus(), 50);
    };
})();