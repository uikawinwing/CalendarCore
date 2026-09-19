import type {
  CalendarDate,
  CalendarMonthSession,
  CalendarMonthViewModel,
} from '../../ui';
import {
  mountVueCalendarMonth,
  type MountedVueCalendarMonth,
} from '../../renderers/vue';

const REGISTRY_KEY =
  '__calendarCoreSillyTavernShellDestroy__';
const BUTTON_POSITION_KEY =
  'calendar-core:shell:button-position:v1';
const DESKTOP_BREAKPOINT = 980;
const VIEWPORT_MARGIN = 8;
const DRAG_THRESHOLD = 4;

type ShellRegistryWindow = Window & {
  [REGISTRY_KEY]?: () => void;
};

interface Position {
  left: number;
  top: number;
}

interface DragState extends Position {
  pointerId: number;
  startX: number;
  startY: number;
  moved: boolean;
}

export interface SillyTavernCalendarShellOptions {
  session: CalendarMonthSession;
  pageDocument?: Document;
  lifecycleWindow?: Window;
  buttonLabel?: string;
  buttonTitle?: string;
  weekdayLabels?: readonly string[];
  maxVisibleOccurrences?: number;
  initiallyOpen?: boolean;
  onSelectedDateChange?: (date: CalendarDate) => void;
}

export interface MountedSillyTavernCalendarShell {
  open(): void;
  close(): void;
  toggle(): void;
  isOpen(): boolean;
  refresh(): Promise<CalendarMonthViewModel>;
  destroy(): void;
}

function resolvePageDocument(): Document {
  try {
    if (
      window.parent &&
      window.parent !== window &&
      window.parent.document
    ) {
      return window.parent.document;
    }
  } catch {
    // Cross-origin parent: use the current document.
  }

  return document;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function readStoredPosition(
  targetWindow: Window,
): Position | null {
  try {
    const raw =
      targetWindow.localStorage?.getItem(BUTTON_POSITION_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<Position>;
    if (
      typeof parsed.left !== 'number' ||
      typeof parsed.top !== 'number' ||
      !Number.isFinite(parsed.left) ||
      !Number.isFinite(parsed.top)
    ) {
      return null;
    }

    return {
      left: parsed.left,
      top: parsed.top,
    };
  } catch {
    return null;
  }
}

function saveButtonPosition(
  targetWindow: Window,
  position: Position,
): void {
  try {
    targetWindow.localStorage?.setItem(
      BUTTON_POSITION_KEY,
      JSON.stringify(position),
    );
  } catch {
    // Storage may be unavailable in private/sandboxed contexts.
  }
}

function createHostStyle(document: Document): HTMLStyleElement {
  const style = document.createElement('style');
  style.dataset.calendarCoreShellStyle = 'month';
  style.textContent = [
    '[data-calendar-core-shell="button"] {',
    '  position: fixed;',
    '  left: calc(100vw - 88px);',
    '  top: 32vh;',
    '  z-index: 2147483001;',
    '  display: grid;',
    '  place-items: center;',
    '  width: 68px;',
    '  height: 68px;',
    '  padding: 0;',
    '  border: 1px solid rgba(147, 112, 51, 0.45);',
    '  border-radius: 20px;',
    '  background: rgba(233, 211, 171, 0.86);',
    '  color: #4c3820;',
    '  font: inherit;',
    '  font-size: 32px;',
    '  line-height: 1;',
    '  box-shadow: 0 14px 30px rgba(68, 44, 20, 0.18);',
    '  backdrop-filter: blur(10px);',
    '  -webkit-backdrop-filter: blur(10px);',
    '  cursor: grab;',
    '  touch-action: none;',
    '  user-select: none;',
    '  transition: box-shadow 140ms ease, transform 140ms ease;',
    '}',
    '',
    '[data-calendar-core-shell="button"]:hover {',
    '  transform: translateY(-1px);',
    '  box-shadow: 0 18px 36px rgba(68, 44, 20, 0.24);',
    '}',
    '',
    '[data-calendar-core-shell="button"][data-dragging="true"] {',
    '  cursor: grabbing;',
    '  transform: none;',
    '}',
    '',
    '[data-calendar-core-shell="panel"] {',
    '  position: fixed;',
    '  left: 2vw;',
    '  top: 2vh;',
    '  z-index: 2147483000;',
    '  width: min(1560px, calc(100vw - 40px));',
    '  height: min(960px, calc(100dvh - 40px));',
    '  padding: 16px;',
    '  overflow: hidden;',
    '  border: 1px solid rgba(155, 128, 84, 0.22);',
    '  border-radius: 28px;',
    '  background: rgba(242, 234, 220, 0.94);',
    '  color: #2c241b;',
    '  box-shadow: 0 28px 60px rgba(56, 38, 20, 0.24);',
    '  backdrop-filter: blur(10px);',
    '  -webkit-backdrop-filter: blur(10px);',
    '  box-sizing: border-box;',
    '}',
    '',
    '[data-calendar-core-shell="panel"][hidden] {',
    '  display: none;',
    '}',
    '',
    '[data-calendar-core-shell="chrome"] {',
    '  height: 48px;',
    '  display: flex;',
    '  align-items: center;',
    '  gap: 12px;',
    '  padding: 0 4px 12px 6px;',
    '  cursor: move;',
    '  user-select: none;',
    '  box-sizing: border-box;',
    '}',
    '',
    '[data-calendar-core-shell="chrome-title"] {',
    '  min-width: 0;',
    '  flex: 1;',
    '  color: #3b2d1f;',
    '  font-family: "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif;',
    '  font-size: 15px;',
    '  font-weight: 800;',
    '  letter-spacing: 0.02em;',
    '}',
    '',
    '[data-calendar-core-shell="close"] {',
    '  width: 34px;',
    '  height: 34px;',
    '  padding: 0;',
    '  border: 1px solid rgba(155, 128, 84, 0.2);',
    '  border-radius: 10px;',
    '  background: rgba(255, 252, 246, 0.72);',
    '  color: #6e4510;',
    '  font: inherit;',
    '  font-size: 20px;',
    '  line-height: 1;',
    '  cursor: pointer;',
    '}',
    '',
    '[data-calendar-core-shell="close"]:hover {',
    '  background: linear-gradient(180deg, #fff7ea, #f4dfad);',
    '}',
    '',
    '[data-calendar-core-shell="frame"] {',
    '  display: block;',
    '  width: 100%;',
    '  height: calc(100% - 48px);',
    '  border: 1px solid rgba(155, 128, 84, 0.14);',
    '  border-radius: 22px;',
    '  background: rgba(255, 252, 246, 0.96);',
    '  box-sizing: border-box;',
    '}',
    '',
    '@media (max-width: 980px) {',
    '  [data-calendar-core-shell="button"] {',
    '    width: 52px;',
    '    height: 52px;',
    '    border-radius: 16px;',
    '    font-size: 23px;',
    '  }',
    '',
    '  [data-calendar-core-shell="button"]:hover {',
    '    transform: none;',
    '  }',
    '',
    '  [data-calendar-core-shell="panel"] {',
    '    inset: 0;',
    '    width: 100vw;',
    '    height: 100dvh;',
    '    padding: 0;',
    '    border: 0;',
    '    border-radius: 0;',
    '    background: #f7f0e5;',
    '  }',
    '',
    '  [data-calendar-core-shell="chrome"] {',
    '    height: 52px;',
    '    padding: 8px 10px;',
    '    border-bottom: 1px solid rgba(155, 128, 84, 0.14);',
    '    background: rgba(255, 252, 246, 0.94);',
    '    cursor: default;',
    '  }',
    '',
    '  [data-calendar-core-shell="frame"] {',
    '    height: calc(100% - 52px);',
    '    border: 0;',
    '    border-radius: 0;',
    '  }',
    '}',
  ].join('\n');
  return style;
}

function createPanelSrcdoc(): string {
  return [
    '<!doctype html>',
    '<html>',
    '<head>',
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width,initial-scale=1">',
    '  <style>',
    '    :root { color-scheme: light; }',
    '    html, body { width: 100%; height: 100%; min-height: 100%; }',
    '    body {',
    '      margin: 0;',
    '      overflow: hidden;',
    '      background:',
    '        radial-gradient(circle at 10% 0%, rgba(239,209,137,0.12), transparent 34%),',
    '        linear-gradient(180deg, #fffdf8, #f8f0e5);',
    '      color: #2c241b;',
    '      font-family: "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif;',
    '    }',
    '  </style>',
    '</head>',
    '<body></body>',
    '</html>',
  ].join('\n');
}

function waitForIframeLoad(
  iframe: HTMLIFrameElement,
): Promise<void> {
  if (
    iframe.contentDocument?.readyState === 'complete'
  ) {
    return Promise.resolve();
  }

  return new Promise(resolve => {
    iframe.addEventListener(
      'load',
      () => resolve(),
      { once: true },
    );
  });
}

export async function mountSillyTavernCalendarShell(
  options: SillyTavernCalendarShellOptions,
): Promise<MountedSillyTavernCalendarShell> {
  const pageDocument =
    options.pageDocument ?? resolvePageDocument();
  const lifecycleWindow =
    options.lifecycleWindow ?? window;
  const registryWindow =
    pageDocument.defaultView as ShellRegistryWindow | null;
  const pageWindow =
    pageDocument.defaultView ?? lifecycleWindow;

  registryWindow?.[REGISTRY_KEY]?.();

  const style = createHostStyle(pageDocument);

  const button = pageDocument.createElement('button');
  button.type = 'button';
  button.dataset.calendarCoreShell = 'button';
  button.textContent = options.buttonLabel ?? '📅';
  button.title =
    options.buttonTitle ?? '打开月历';
  button.setAttribute('aria-label', button.title);

  const panel = pageDocument.createElement('section');
  panel.dataset.calendarCoreShell = 'panel';
  panel.setAttribute('aria-label', '月历悬浮面板');

  const chrome = pageDocument.createElement('div');
  chrome.dataset.calendarCoreShell = 'chrome';

  const chromeTitle = pageDocument.createElement('div');
  chromeTitle.dataset.calendarCoreShell = 'chrome-title';
  chromeTitle.textContent = '月历';

  const closeButton = pageDocument.createElement('button');
  closeButton.type = 'button';
  closeButton.dataset.calendarCoreShell = 'close';
  closeButton.textContent = '×';
  closeButton.title = '关闭';
  closeButton.setAttribute('aria-label', '关闭月历');

  const frame = pageDocument.createElement('iframe');
  frame.dataset.calendarCoreShell = 'frame';
  frame.title = 'Calendar';
  frame.setAttribute('frameborder', '0');
  frame.srcdoc = createPanelSrcdoc();

  chrome.append(chromeTitle, closeButton);
  panel.append(chrome, frame);

  let openState = options.initiallyOpen ?? false;
  let renderer: MountedVueCalendarMonth | null = null;
  let destroyed = false;
  let suppressNextButtonClick = false;
  let buttonDrag: DragState | null = null;
  let panelDrag: DragState | null = null;
  let panelPosition: Position | null = null;

  const viewportSize = () => ({
    width:
      pageWindow.innerWidth ||
      pageDocument.documentElement.clientWidth ||
      0,
    height:
      pageWindow.innerHeight ||
      pageDocument.documentElement.clientHeight ||
      0,
  });

  const isDesktop = () =>
    viewportSize().width > DESKTOP_BREAKPOINT;

  const clampElementPosition = (
    element: HTMLElement,
    left: number,
    top: number,
  ): Position => {
    const viewport = viewportSize();
    const rect = element.getBoundingClientRect();
    const width = rect.width || element.offsetWidth;
    const height = rect.height || element.offsetHeight;

    return {
      left: clamp(
        left,
        VIEWPORT_MARGIN,
        viewport.width - width - VIEWPORT_MARGIN,
      ),
      top: clamp(
        top,
        VIEWPORT_MARGIN,
        viewport.height - height - VIEWPORT_MARGIN,
      ),
    };
  };

  const applyButtonPosition = (
    position: Position | null,
  ) => {
    if (!position) {
      button.style.left = '';
      button.style.top = '';
      return;
    }

    const next = clampElementPosition(
      button,
      position.left,
      position.top,
    );
    button.style.left = `${next.left}px`;
    button.style.top = `${next.top}px`;
  };

  const centerPanel = () => {
    if (!isDesktop()) {
      panel.style.left = '';
      panel.style.top = '';
      panelPosition = null;
      return;
    }

    const viewport = viewportSize();
    const width = Math.min(
      1560,
      Math.max(0, viewport.width - 40),
    );
    const height = Math.min(
      960,
      Math.max(0, viewport.height - 40),
    );

    panelPosition = {
      left: Math.round((viewport.width - width) / 2),
      top: Math.round((viewport.height - height) / 2),
    };
    panel.style.left = `${panelPosition.left}px`;
    panel.style.top = `${panelPosition.top}px`;
  };

  const syncOpenState = () => {
    panel.hidden = !openState;
    button.hidden = openState;
    button.setAttribute(
      'aria-expanded',
      openState ? 'true' : 'false',
    );
    button.title = openState
      ? '关闭月历'
      : options.buttonTitle ?? '打开月历';
  };

  const open = () => {
    if (destroyed) return;
    openState = true;
    if (isDesktop() && !panelPosition) {
      centerPanel();
    }
    syncOpenState();
  };

  const close = () => {
    if (destroyed) return;
    openState = false;
    syncOpenState();
  };

  const toggle = () => {
    if (openState) close();
    else open();
  };

  const handleButtonClick = () => {
    if (suppressNextButtonClick) {
      suppressNextButtonClick = false;
      return;
    }
    toggle();
  };

  const handleButtonPointerDown = (
    event: PointerEvent,
  ) => {
    if (
      destroyed ||
      openState ||
      event.button !== 0
    ) {
      return;
    }

    const rect = button.getBoundingClientRect();
    buttonDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      left: rect.left,
      top: rect.top,
      moved: false,
    };
    button.dataset.dragging = 'true';
    button.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (
      buttonDrag &&
      event.pointerId === buttonDrag.pointerId
    ) {
      const deltaX = event.clientX - buttonDrag.startX;
      const deltaY = event.clientY - buttonDrag.startY;

      if (
        Math.hypot(deltaX, deltaY) >
        DRAG_THRESHOLD
      ) {
        buttonDrag.moved = true;
      }

      const next = clampElementPosition(
        button,
        buttonDrag.left + deltaX,
        buttonDrag.top + deltaY,
      );
      button.style.left = `${next.left}px`;
      button.style.top = `${next.top}px`;
      if (buttonDrag.moved) {
        event.preventDefault();
      }
      return;
    }

    if (
      panelDrag &&
      event.pointerId === panelDrag.pointerId &&
      isDesktop()
    ) {
      const deltaX = event.clientX - panelDrag.startX;
      const deltaY = event.clientY - panelDrag.startY;
      const next = clampElementPosition(
        panel,
        panelDrag.left + deltaX,
        panelDrag.top + deltaY,
      );

      panelPosition = next;
      panel.style.left = `${next.left}px`;
      panel.style.top = `${next.top}px`;
      event.preventDefault();
    }
  };

  const finishButtonDrag = (event: PointerEvent) => {
    if (
      !buttonDrag ||
      event.pointerId !== buttonDrag.pointerId
    ) {
      return;
    }

    if (buttonDrag.moved) {
      const rect = button.getBoundingClientRect();
      const position = {
        left: rect.left,
        top: rect.top,
      };
      saveButtonPosition(pageWindow, position);
      suppressNextButtonClick = true;
    }

    buttonDrag = null;
    delete button.dataset.dragging;
  };

  const handleChromePointerDown = (
    event: PointerEvent,
  ) => {
    if (
      destroyed ||
      !openState ||
      !isDesktop() ||
      event.button !== 0 ||
      (event.target as Element | null)?.closest('button')
    ) {
      return;
    }

    const rect = panel.getBoundingClientRect();
    panelDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      left: rect.left,
      top: rect.top,
      moved: false,
    };
    chrome.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  };

  const handlePointerUp = (event: PointerEvent) => {
    finishButtonDrag(event);

    if (
      panelDrag &&
      event.pointerId === panelDrag.pointerId
    ) {
      panelDrag = null;
    }
  };

  const handleResize = () => {
    const rect = button.getBoundingClientRect();
    if (
      button.style.left &&
      button.style.top
    ) {
      applyButtonPosition({
        left: rect.left,
        top: rect.top,
      });
    }

    if (!isDesktop()) {
      panelPosition = null;
      panel.style.left = '';
      panel.style.top = '';
      return;
    }

    if (panelPosition) {
      panelPosition = clampElementPosition(
        panel,
        panelPosition.left,
        panelPosition.top,
      );
      panel.style.left = `${panelPosition.left}px`;
      panel.style.top = `${panelPosition.top}px`;
    } else {
      centerPanel();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && openState) {
      close();
    }
  };

  button.addEventListener('click', handleButtonClick);
  button.addEventListener(
    'pointerdown',
    handleButtonPointerDown,
  );
  chrome.addEventListener(
    'pointerdown',
    handleChromePointerDown,
  );
  closeButton.addEventListener('click', close);
  pageDocument.addEventListener(
    'pointermove',
    handlePointerMove,
  );
  pageDocument.addEventListener(
    'pointerup',
    handlePointerUp,
  );
  pageDocument.addEventListener(
    'pointercancel',
    handlePointerUp,
  );
  pageDocument.addEventListener(
    'keydown',
    handleKeyDown,
  );
  pageWindow.addEventListener('resize', handleResize);

  pageDocument.head.append(style);
  pageDocument.body.append(panel, button);

  applyButtonPosition(
    readStoredPosition(pageWindow),
  );
  centerPanel();
  syncOpenState();

  const loadPromise = waitForIframeLoad(frame);

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;

    renderer?.destroy();
    renderer = null;

    button.removeEventListener(
      'click',
      handleButtonClick,
    );
    button.removeEventListener(
      'pointerdown',
      handleButtonPointerDown,
    );
    chrome.removeEventListener(
      'pointerdown',
      handleChromePointerDown,
    );
    closeButton.removeEventListener('click', close);
    pageDocument.removeEventListener(
      'pointermove',
      handlePointerMove,
    );
    pageDocument.removeEventListener(
      'pointerup',
      handlePointerUp,
    );
    pageDocument.removeEventListener(
      'pointercancel',
      handlePointerUp,
    );
    pageDocument.removeEventListener(
      'keydown',
      handleKeyDown,
    );
    pageWindow.removeEventListener(
      'resize',
      handleResize,
    );
    lifecycleWindow.removeEventListener(
      'pagehide',
      destroy,
    );

    button.remove();
    panel.remove();
    style.remove();

    if (
      registryWindow?.[REGISTRY_KEY] === destroy
    ) {
      delete registryWindow[REGISTRY_KEY];
    }
  };

  lifecycleWindow.addEventListener(
    'pagehide',
    destroy,
  );

  if (registryWindow) {
    registryWindow[REGISTRY_KEY] = destroy;
  }

  await loadPromise;

  if (destroyed) {
    throw new Error(
      'Calendar shell was destroyed before its iframe loaded',
    );
  }

  const panelDocument = frame.contentDocument;
  if (!panelDocument?.body) {
    destroy();
    throw new Error(
      'Calendar shell iframe document is unavailable',
    );
  }

  renderer = await mountVueCalendarMonth(
    panelDocument.body,
    {
      session: options.session,
      weekdayLabels: options.weekdayLabels,
      maxVisibleOccurrences:
        options.maxVisibleOccurrences,
      onSelectedDateChange:
        options.onSelectedDateChange,
    },
  );

  return {
    open,
    close,
    toggle,
    isOpen: () => openState,
    refresh: () => {
      if (!renderer) {
        throw new Error(
          'Calendar renderer is not mounted',
        );
      }
      return renderer.refresh();
    },
    destroy,
  };
}
