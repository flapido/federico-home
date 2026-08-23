# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: quick-check.spec.ts >> Quick visual QA check >> CV
- Location: src\test\quick-check.spec.ts:67:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5174/cv
Call log:
  - navigating to "http://localhost:5174/cv", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e6]:
    - heading "No se puede acceder a este sitio web" [level=1] [ref=e7]
    - paragraph [ref=e8]:
      - text: La página
      - strong [ref=e9]: localhost
      - text: ha rechazado la conexión.
    - generic [ref=e10]:
      - paragraph [ref=e11]: "Prueba a:"
      - list [ref=e12]:
        - listitem [ref=e13]: Comprobar la conexión
        - listitem [ref=e14]:
          - link "Comprobar el proxy y el cortafuegos" [ref=e15] [cursor=pointer]:
            - /url: "#buttons"
    - generic [ref=e16]: ERR_CONNECTION_REFUSED
  - generic [ref=e17]:
    - button "Volver a cargar" [ref=e19] [cursor=pointer]
    - button "Detalles" [ref=e20] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('Quick visual QA check', () => {
  4  |   test('Home - nav and identity', async ({ page }) => {
  5  |     await page.goto('/')
  6  |     await page.waitForLoadState('networkidle')
  7  |     
  8  |     // Check header identity
  9  |     await expect(page.locator('text=Federico Lapido')).toBeVisible()
  10 |     await expect(page.locator('text=Buenos Aires')).toBeVisible()
  11 |     
  12 |     // Check nav links
  13 |     await expect(page.locator('text=Proyectos')).toBeVisible()
  14 |     await expect(page.locator('text=Lab')).toBeVisible()
  15 |     await expect(page.locator('text=Sobre mí')).toBeVisible()
  16 |     await expect(page.locator('text=CV')).toBeVisible()
  17 |     
  18 |     // Check no horizontal overflow
  19 |     const { scrollWidth, clientWidth } = await page.evaluate(() => {
  20 |       return { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }
  21 |     })
  22 |     expect(scrollWidth).toBeLessThanOrEqual(clientWidth * 1.01) // allow 1% tolerance
  23 |   })
  24 | 
  25 |   test('Proyectos/Subastas - LOCAL_DEMO', async ({ page }) => {
  26 |     await page.goto('/proyectos/subastas')
  27 |     await page.waitForLoadState('networkidle')
  28 |     
  29 |     // Check Subastas badge
  30 |     await expect(page.locator('text=LOCAL_DEMO')).toBeVisible()
  31 |     await expect(page.locator('text=Demo lista · publicación pendiente')).toBeVisible()
  32 |     
  33 |     // Check preview functionality
  34 |     await expect(page.locator('text=Ver preview')).toBeVisible()
  35 |     
  36 |     // No horizontal overflow
  37 |     const { scrollWidth, clientWidth } = await page.evaluate(() => {
  38 |       return { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }
  39 |     })
  40 |     expect(scrollWidth).toBeLessThanOrEqual(clientWidth * 1.01)
  41 |   })
  42 | 
  43 |   test('Lab', async ({ page }) => {
  44 |     await page.goto('/lab')
  45 |     await page.waitForLoadState('networkidle')
  46 |     
  47 |     await expect(page.locator('text=Lab — cosas que estoy explorando')).toBeVisible()
  48 |     
  49 |     const { scrollWidth, clientWidth } = await page.evaluate(() => {
  50 |       return { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }
  51 |     })
  52 |     expect(scrollWidth).toBeLessThanOrEqual(clientWidth * 1.01)
  53 |   })
  54 | 
  55 |   test('About', async ({ page }) => {
  56 |     await page.goto('/about')
  57 |     await page.waitForLoadState('networkidle')
  58 |     
  59 |     await expect(page.locator('text=Sobre mí')).toBeVisible()
  60 |     
  61 |     const { scrollWidth, clientWidth } = await page.evaluate(() => {
  62 |       return { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }
  63 |     })
  64 |     expect(scrollWidth).toBeLessThanOrEqual(clientWidth * 1.01)
  65 |   })
  66 | 
  67 |   test('CV', async ({ page }) => {
> 68 |     await page.goto('/cv')
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5174/cv
  69 |     await page.waitForLoadState('networkidle')
  70 |     
  71 |     await expect(page.locator('text=Federico Lapido')).toBeVisible()
  72 |     await expect(page.locator('text=Software Engineer')).toBeVisible()
  73 |     
  74 |     const { scrollWidth, clientWidth } = await page.evaluate(() => {
  75 |       return { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }
  76 |     })
  77 |     expect(scrollWidth).toBeLessThanOrEqual(clientWidth * 1.01)
  78 |   })
  79 | 
  80 |   test('404 page', async ({ page }) => {
  81 |     await page.goto('/ruta-inexistente-404')
  82 |     await page.waitForLoadState('networkidle')
  83 |     
  84 |     // Should show 404 page, not crash
  85 |     const title = await page.title()
  86 |     expect(title).not.toBe('500')
  87 |     
  88 |     const { scrollWidth, clientWidth } = await page.evaluate(() => {
  89 |       return { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }
  90 |     })
  91 |     expect(scrollWidth).toBeLessThanOrEqual(clientWidth * 1.01)
  92 |   })
  93 | })
```