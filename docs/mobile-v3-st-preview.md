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

开新游戏时，浮窗先显示「日历尚未初始化」，每 2 秒检查一次；加载成功后停止检查。优先读取完整的 `calendar.now` + `calendar.weekAnchor`，否则兼容 `stat_data.世界.时间`（例如 `复兴纪元488年-04月-12日-星期三-11:45`）。使用世界字符串里的星期，不按现实公历重新计算；不修改 MVU、不编造时间。

面板使用 Shadow DOM，避免内部 iframe 加载事件丢失导致全白。**ST 测试时请使用锁定 Commit SHA 的 JS URL**，分支 URL 可能被 CDN 缓存。现有 `stat_data.事件` 的「开启/结束/标题/阶段」字段不是日期型事件列表，暂未自动映射为日历事件。

## 测试项目

- 手机初始显示紧凑周视图；当天议程与底部导航同时可见，不再整屏覆盖日历。
- 点击日期、底部前一天/后一天、跨月导航、回今天。
- 展开与收起完整月历；查看事件详情后返回列表。
- 320 / 360 / 390px 视口、深浅系统主题。
- 自定义八日制可通过公共 MonthSession/Vue Renderer 验证；目前默认 ST entrypoint 仍是七日 Gregorian，不提供八日制配置入口。

本次未接入事件编辑、筛选、业务私有 payload 或新的 Host 协议。

