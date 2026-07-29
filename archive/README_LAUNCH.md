# Инструкция по запуску: 0xAiPOEHelper (Go Backend + React Frontend)

Приложение переведено на ультра-быстрый и стабильный бэкенд на **Golang (Go 1.26)** для исключения зависаний портов и конфликтов процессов Node.js.

---

## 🚀 Быстрый запуск в 1 клик (Windows)

1. **`run_app.bat`** — Запуск приложения (Go сервер на `http://localhost:3000` + React дашборд на `http://localhost:5173`).
   * Просто дважды кликните по файлу **`run_app.bat`**.

2. **`run_tests.bat`** — Запуск быстрой компиляции и проверки Go бинарника и React приложения.

---

## 💻 Ручная компиляция и запуск

### 1. Запуск Go Бэкенда:
```bash
cd go_server
go build -o server.exe main.go
.\server.exe
```

### 2. Запуск Веб-интерфейса:
```bash
cd web
npm run dev
```

---

## 🔌 Настройка MCP Сервера для AI

Настройка в `claude_desktop_config.json` или в настройках IDE:

```json
{
  "mcpServers": {
    "poe1-mcp-server": {
      "command": "node",
      "args": ["c:/Users/user/Documents/projects/0xAiPOEHelper/dist/mcp/index.js"]
    }
  }
}
```
