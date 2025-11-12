[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22.20.0-green.svg)](https://nodejs.org/)

> 🤖 **Note:** This translation was created automatically and may contain inaccuracies.

# 🌎 **Choose your language:**

## [English](#-table-of-contents) 🇺🇸 • [Русский](../README.md) 🇷🇺

## 📋 Table of Contents

- [What is this project about?](#-stormworks-telemetry-collector)
- [How does it work?](#-how-does-it-work)
- [Installation instructions](#-installation)
- [How to use](#️-how-to-use)

# 🚀 StormWorks Telemetry Collector

A flexible and powerful system for collecting numerical values in StormWorks and saving them to your PC in a convenient format.

Created to make life easier for creators by providing simple and reliable access to data from your creations for subsequent analysis in your favorite tools.

## 💡 How does it work?

**Lua** in StormWorks allows sending *http get requests to localhost*, which the program will receive, parse, and save to a text file.

Very flexible configuration of data collection frequency allows you to tune the controller for a specific task. In rare cases, reduced data transmission speed is possible, but this is solved by a data buffer in the microcontroller.

| Collection Frequency | Informativeness | Recommendations |
|:---:|:---|:---|
| **60 Hz** | 🟢 Maximum informativeness. Every tick is saved | For data that changes very sharply. Ideal for tuning missiles/radar filters |
| **30 Hz** | 🟡 Decent informativeness. Every second data tick is saved | Suitable for tuning inertial systems |
| **20 Hz** | 🟠 Below average informativeness. Every third data tick is saved | For highly inertial data, such as fuel consumption or engine heating graph |
| **< 20 Hz** | 🔴 Poor informativeness. | I don't know what it's for myself, let it be |
| **0.5 - 0.1 Hz** | 🟤 Terrible informativeness. Just forget about it | Specially created for logging background data |

**I recommend selecting the frequency based on the task and performance in your specific case*

# 🔧 Installation

1. Open [Releases](https://github.com/SavelievGleb/StormWorks_HTTP_Telemetry/releases)
1. Download:
    - Program installer - **Telemetry.Reciever.X.X.X.Setup.exe**
    - Microcontroller file - **HTTP.Telemetry.xml**
1. Run the installer and install the program<br>
❗ The antivirus will pause the installation because there is no digital signature for the program ❗<br>
You can either click **More info**, then **Run anyway** or disable the antivirus before installation.
1. Copy **HTTP.Telemetry.xml** to the folder *C:\Users\%USERNAME%\AppData\Roaming\Stormworks\data\microprocessors*

After completing all these steps, everything is ready to work

# ▶ How to use

1. Launch the **Telemetry Receiver** program via the desktop shortcut
1. In the game:
    1. Place the controller on the build
    1. Connect a composite signal to *Data*, a button to *Send*
    1. Open the controller settings and write names for the required channels for collection. Channels with empty names will be ignored!

Supply a **true** signal to *Send* (for example, an enabled button) - data collection and transmission begins.

### The program window will display statistics on received data:
1. Request
    - count - Number of received requests
    - frequency - Request reception frequency
1. Frames
    - count - Number of received telemetry frames
    - frequency - Telemetry frame reception frequency
1. Processed - Number of telemetry frames written to file

### The program saves received data to a *txt* file in the **HTTP Telemetry data** folder on the desktop

In the file, data is stored in **TSV (tab-separated values)** format
- **Line 1**: Signal headers (names from controller settings)
- **Line 2+**: Telemetry frames
