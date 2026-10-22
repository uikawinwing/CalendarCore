# CalendarCore Mobile V3 — SillyTavern 预览分支

本预览仅在 `feat/mobile-v3-st-preview` 分支，不修改 `main`。

## 安装与测试

在原本加载 CalendarCore JS bundle 的 SillyTavern 脚本入口中，将 URL 替换为：

```text
https://cdn.jsdelivr.net/gh/uikawinwing/CalendarCore@feat/mobile-v3-st-preview/dist/calendar-core-sillytavern.js
```

如果 CDN 无法处理含斜杠的分支名，改用 GitHub Raw：

```text
https://raw.githubusercontent.com/uikawinwing/CalendarCore/feat/mobile-v3-st-preview/dist/calendar-core-sillytavern.js
```

只加载一个 CalendarCore 版本，旧版（`@main`）先禁用；重新加载脚本后点开浮动的 📅。

开新游戏时，日历浮窗会先显示「日历尚未初始化」；缺少 `calendar.now`、`calendar.weekAnchor`、或首条消息还没产生时，脚本不会抛错退出。每 2 秒轻量检测一次，发现有效数据后自动加载日历并停止重试。此查看器**不会凭空生成世界日期或修改 MVU 变量**，所以真正的数据仍需要由游戏/预设/世界书提供；格式要求见 [runtime-contract.md](runtime-contract.md)。

## 测试项目

- 手机初始显示紧凑周视图；当天议程与底部导航同时可见，不再整屏覆盖日历。
- 点击日期、底部前一天/后一天、跨月导航、回今天。
- 展开与收起完整月历；查看事件详情后返回列表。
- 320 / 360 / 390px 视口、深浅系统主题。
- 自定义八日制可通过公共 MonthSession/Vue Renderer 验证；目前默认 ST entrypoint 仍是七日 Gregorian，不提供八日制配置入口。

本次未接入事件编辑、筛选、业务私有 payload 或新的 Host 协议。
