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

type ShellRegistryWindow = Window & {
  [REGISTRY_KEY]?: () => void;
};

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

function createHostStyle(document: Document): HTMLStyleElement {
  const style = document.createElement('style');
  style.dataset.calendarCoreShellStyle = 'month';
  style.textContent = [
    '[data-calendar-core-shell="button"] {',
    '  position: fixed;',
    '  right: 1rem;',
    '  bottom: 1rem;',
    '  z-index: 2147483001;',
    '  display: grid;',
    '  place-items: center;',
    '  width: 3rem;',
    '  height: 3rem;',
    '  padding: 0;',
    '  border: 1px solid currentColor;',
    '  border-radius: 999px;',
    '  background: Canvas;',
    '  color: CanvasText;',
    '  font: inherit;',
    '  font-size: 1.25rem;',
    '  line-height: 1;',
    '  box-shadow: 0 0.4rem 1.5rem rgb(0 0 0 / 0.2);',
    '  cursor: pointer;',
    '}',
    '',
    '[data-calendar-core-shell="panel"] {',
    '  position: fixed;',
    '  right: 1rem;',
    '  bottom: 4.75rem;',
    '  z-index: 2147483000;',
    '  width: min(48rem, calc(100vw - 2rem));',
    '  height: min(78dvh, 48rem);',
    '  border: 1px solid color-mix(in srgb, CanvasText 28%, transparent);',
    '  border-radius: 1rem;',
    '  background: Canvas;',
    '  box-shadow: 0 0.75rem 2.5rem rgb(0 0 0 / 0.28);',
    '}',
    '',
    '[data-calendar-core-shell="panel"][hidden] {',
    '  display: none;',
    '}',
    '',
    '@media (max-width: 640px) {',
    '  [data-calendar-core-shell="button"] {',
    '    right: 0.75rem;',
    '    bottom: 0.75rem;',
    '  }',
    '',
    '  [data-calendar-core-shell="panel"] {',
    '    inset: 0;',
    '    width: 100vw;',
    '    height: 100dvh;',
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
    '    :root { color-scheme: light dark; }',
    '    html, body { min-height: 100%; }',
    '    body {',
    '      margin: 0;',
    '      padding: 0.75rem;',
    '      background: Canvas;',
    '      color: CanvasText;',
    '      font-family: system-ui, sans-serif;',
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

  registryWindow?.[REGISTRY_KEY]?.();

  const style = createHostStyle(pageDocument);

  const button = pageDocument.createElement('button');
  button.type = 'button';
  button.dataset.calendarCoreShell = 'button';
  button.textContent = options.buttonLabel ?? '📅';
  button.title =
    options.buttonTitle ?? 'Open calendar';
  button.setAttribute('aria-label', button.title);

  const panel = pageDocument.createElement('iframe');
  panel.dataset.calendarCoreShell = 'panel';
  panel.title = 'Calendar';
  panel.setAttribute('frameborder', '0');
  panel.srcdoc = createPanelSrcdoc();

  let openState = options.initiallyOpen ?? false;
  let renderer: MountedVueCalendarMonth | null = null;
  let destroyed = false;

  const syncOpenState = () => {
    panel.hidden = !openState;
    button.setAttribute(
      'aria-expanded',
      openState ? 'true' : 'false',
    );
    button.title = openState
      ? 'Close calendar'
      : options.buttonTitle ?? 'Open calendar';
  };

  const open = () => {
    if (destroyed) return;
    openState = true;
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

  const handleButtonClick = () => toggle();
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && openState) {
      close();
    }
  };

  button.addEventListener('click', handleButtonClick);
  pageDocument.addEventListener(
    'keydown',
    handleKeyDown,
  );

  pageDocument.head.append(style);
  pageDocument.body.append(panel, button);
  syncOpenState();

  const loadPromise = waitForIframeLoad(panel);

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;

    renderer?.destroy();
    renderer = null;

    button.removeEventListener(
      'click',
      handleButtonClick,
    );
    pageDocument.removeEventListener(
      'keydown',
      handleKeyDown,
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

  const panelDocument = panel.contentDocument;
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
