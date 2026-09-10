import { test, expect, type Page } from '@playwright/test';
import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const RESULTS_DIR = join('C:', 'Users', 'Usuario', 'AppData', 'Local', 'Temp', 'kilo', 'federico-home-playwright');
if (!existsSync(RESULTS_DIR)) mkdirSync(RESULTS_DIR, { recursive: true });

const MOCK_WS_SCRIPT = `
window.__mockSockets = [];
window.__mockSocketHandlers = new Map();

class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  constructor(url) {
    this.url = url;
    this.readyState = 1;
    this.bufferedAmount = 0;
    this.protocol = '';
    this.extensions = '';
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    this._sent = [];
    const socket = this;
    window.__mockSockets.push(this);
    setTimeout(() => {
      socket.onopen?.({ type: 'open' });
    }, 0);
  }
  send(data) {
    this._sent.push(data);
    this.bufferedAmount += data.length;
    try {
      const msg = JSON.parse(data);
      if (msg.type === 'monitor.list') {
        setTimeout(() => {
          this.onmessage?.({ data: JSON.stringify({ type: 'monitor.list', tasks: [{ task_id: '11111111-1111-1111-1111-111111111111', project: 'demo', agent: 'codex', monitor_state: 'WORKING', read_only: true, process_alive: true, session_alive: true, pid: 1234, duration_ms: 1000, last_output: 'hello world' }], request_id: msg.request_id }), type: 'message' });
        }, 50);
      } else if (msg.type === 'monitor.get') {
        setTimeout(() => {
          this.onmessage?.({ data: JSON.stringify({ type: 'monitor.get', task: { task_id: msg.task_id, monitor_state: 'WORKING', read_only: true }, request_id: msg.request_id }), type: 'message' });
        }, 50);
      } else if (msg.type === 'monitor.read') {
        setTimeout(() => {
          this.onmessage?.({ data: JSON.stringify({ type: 'monitor.read', result: { session_id: msg.session_id, cursor: 0, next_cursor: 5, output: 'hello world', truncated: false, running: true }, request_id: msg.request_id }), type: 'message' });
        }, 50);
      } else if (msg.type === 'hello') {
        setTimeout(() => {
          this.onmessage?.({ data: JSON.stringify({ type: 'pong', at: Date.now() }), type: 'message' });
        }, 10);
      }
    } catch {}
  }
  close(code, reason) {
    this.readyState = 3;
    this.onclose?.({ code, reason, type: 'close', wasClean: true });
  }
  terminate() { this.close(1006, ''); }
}

window.WebSocket = MockWebSocket;
`;

async function mockApi(page: Page) {
  await page.route('**/api/consola/session', async (route) => {
    await route.fulfill({ status: 200, body: '' });
  });

  await page.route('**/api/consola/status', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        pc_online: true,
        agent_console_online: true,
        last_seen: new Date().toISOString(),
        pc_id: 'test-pc',
        platform: 'windows',
      }),
    });
  });

  await page.route('**/api/consola/relay-ticket', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        url: 'ws://localhost:9999/relay?session=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        ticket: 'test-ticket',
      }),
    });
  });
}

test.describe('Consola Remota Playwright', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await mockApi(page);
    await page.addInitScript(MOCK_WS_SCRIPT);
  });

  test('desktop: terminal and monitor tabs, READ ONLY, no overflow', async ({ page }) => {
    await page.goto('/consola');
    await page.waitForLoadState('networkidle');

    // Should auto-authorize via session check
    await expect(page.getByLabel('Vista de consola').getByText('PC ONLINE')).toBeVisible();
    await expect(page.getByLabel('Vista de consola').getByText('Agent Console ONLINE')).toBeVisible();

    // Terminal tab should be active by default
    await expect(page.getByRole('tab', { name: /Terminal/i })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: /Monitor/i })).toHaveAttribute('aria-selected', 'false');

    // No horizontal overflow
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);

    await page.screenshot({ path: join(RESULTS_DIR, 'desktop-terminal.png'), fullPage: true });

    await page.getByRole('tab', { name: /Monitor/i }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(RESULTS_DIR, 'desktop-monitor-initial.png'), fullPage: true });

    await expect(page.getByRole('tab', { name: /Monitor/i })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: /Terminal/i })).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByText(/READ ONLY/i).first()).toBeVisible();

    await expect(page.getByText('demo')).toBeVisible();
    await expect(page.locator('.remote-monitor-grid .font-medium.text-white.capitalize').filter({ hasText: 'codex' })).toBeVisible();

    // Expand output
    const viewOutputButton = page.getByRole('button', { name: /Ver salida/i });
    if (await viewOutputButton.count() > 0) {
      await viewOutputButton.click();
      await page.waitForTimeout(200);
      await expect(page.getByText('hello world')).toBeVisible();
    }

    const overflowMonitor = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflowMonitor).toBe(false);

    await page.screenshot({ path: join(RESULTS_DIR, 'desktop-monitor.png'), fullPage: true });

    // Switch back to Terminal
    await page.getByRole('tab', { name: /Terminal/i }).click();
    await page.waitForTimeout(200);

    await expect(page.getByRole('tab', { name: /Terminal/i })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: /Monitor/i })).toHaveAttribute('aria-selected', 'false');

    await page.screenshot({ path: join(RESULTS_DIR, 'desktop-terminal-after-monitor.png'), fullPage: true });
  });

  test('mobile: monitor tab visible, READ ONLY, no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/consola');
    await page.waitForLoadState('networkidle');

    await page.getByRole('tab', { name: /Monitor/i }).click();
    await page.waitForTimeout(500);

    await expect(page.getByText(/READ ONLY/i).first()).toBeVisible();

    // Wait for auto-populated monitor list
    await expect(page.getByText('demo')).toBeVisible();
    await expect(page.locator('.remote-monitor-grid .font-medium.text-white.capitalize').filter({ hasText: 'codex' })).toBeVisible();

    const overflowMobile = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflowMobile).toBe(false);

    await page.screenshot({ path: join(RESULTS_DIR, 'mobile-monitor.png'), fullPage: true });
  });
});
