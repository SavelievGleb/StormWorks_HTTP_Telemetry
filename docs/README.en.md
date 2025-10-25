[![Version](https://img.shields.io/badge/version-1.0-blue.svg)](https://github.com/SavelievGleb/StormWorks_HTTP_Telemetry)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22.20.0-green.svg)](https://nodejs.org/)

> ⚠️ *This English translation was generated automatically and may contain inaccuracies. For the most accurate information, please refer to the [original Russian version](docs/README.ru.md).*

# 🌎 **Choose your language:**

## [English](#-table-of-contents) 🇺🇸 • [Русский](README.md) 🇷🇺

## 📋 Table of Contents

- [What is this project about?](#-stormworks-telemetry-collector)
- [How does it work?](#-how-does-it-work)
- [Installation Guide](#-installation)
- [How to Use](#-how-to-use)

# 🚀 StormWorks Telemetry Collector

A flexible and powerful system for collecting numerical values in StormWorks and saving them to your PC in a convenient format.

Created to make life easier for creators by providing simple and reliable access to data from your creations for subsequent analysis in your favorite tools.

## 💡 How does it work?

**Lua** in StormWorks allows sending *http get requests to localhost*, which the program will accept, parse, and save to a text file.

Naturally, there are some limitations - the data transfer speed depends on the game and your hardware. This problem is partially solvable - the controller saves data to an internal buffer and sends it when possible. Also, the highly flexible data collection frequency settings allow you to tailor the controller to a specific task.

| Collection Frequency | Informativeness | Collection/Sending | Recommended Use Case |
|:---:|:---|:---|:---|
| **60 Hz** | 🟢 Maximum informativeness. Every tick is saved | 🔴 Collection is much faster than sending. After stopping collection, you will have to wait a long time for sending to finish | Short data collection sessions. For data that changes very abruptly. Ideal for tuning missiles/radar filters |
| **30 - 10 Hz** | 🟡 Decent informativeness. Data loss is insignificant | 🟡 Collection is slightly faster than sending. Short wait after stopping collection | Short to medium data collection sessions. Great for tuning 90% of vehicles |
| **6 - 1 Hz** | 🟠 Low informativeness. More data missed than collected | 🟢 Collection is slightly slower than sending. Data doesn't accumulate | For inert data, such as fuel consumption or engine heating graphs |
| **0.5 - 0.1 Hz** | 🔴 Poor informativeness. Don't even bother | 🟢 Collection is much slower than sending | Minimal load. Specifically created for logging background data |

**I recommend selecting the frequency based on your specific task and performance*

## 🔧 Installation

1. You need to install [Node JS](https://nodejs.org/) from the official website. *Chocolatey is not needed.*
1. Download the project files from [Releases](https://github.com/SavelievGleb/StormWorks_HTTP_Telemetry/releases)
1. Extract the project files to a folder convenient for you
1. Open the *Server* folder, run `install.bat`. After the installation is complete (message **Install complete!**), close the console. The receiving server is ready to work.
1. Next, you need to copy the controller to the game files. Open the *microprocessors* folder, run **copy to game.bat** or you can copy the *xml* and *png* files manually.

## ▶️ How to Use

1. In the project folder, run **Start server.bat**. A console window will appear with the message *Server started on 127.0.0.1:8080* - the server is running.
1. In the game:
    1. Place the controller on your build
    1. Connect a composite signal to *Data*, and a button to *Send*
    1. Open the controller settings and enter names for the channels you want to collect. Channels with empty names will be ignored!

Apply a **true** signal to *Send* (for example, a pressed button) - data collection and sending begins. The server console will display the data transfer rate *(frequency)* and the number of received telemetry frames. Frames are written to a *txt* file, each frame on a new line. The recorded *txt* files are stored in *Server/data*, with the filename format "*day-month-year hours-minutes-seconds (server port)*"