# calendar_float 2.0 配套世界书

导入 fate-poem-calendar-addon.json 到 SillyTavern World Info，再将它绑定为角色附加世界书 (Additional World Info)；不要覆盖命定之诗主世界书。

条目：[fixed_event_index] 禁用自动注入（但脚本仍可读）；[mvu_update][月历球][月历变量更新规则] 和 [月历球][当前月历内容展示] 已启用。
若主世界书已有同名规则，请禁用重复条目。
如果 InitVar 不包含 事件.月历，请将 optional_mvu_init_fragment.yaml 的两桶合并进去（不可替换现有 事件、世界、角色数据）。
必须有 stat_data.世界.时间；如果是空字符串，请先通过原 MVU 规则初始化世界时间。

注意：CC 2.0 尚未迁移 Scanner/Prompt 注入；固定索引中旧 silent_scan/injectprompt 配置不执行。隐藏解封默认关闭。LLM 展示 EJS 需要你的预设支持 EJS 模板。
