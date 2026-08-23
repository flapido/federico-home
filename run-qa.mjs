import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const home = 'C:\\Dev\\Projects\\federico-home'

console.log('Starting visual QA verification...\n')

// Start dev server
const dev = spawn('npm', ['run', 'dev'], {
  cwd: home,
  stdio: 'ignore',
  shell: true
})

// Wait for server
setTimeout(async () => {
  try {
    const { chromium } = await import('playwright')
    const browser = await chromium.launch({ headless: false })
    const viewports = [
      { name: '320x568', width: 320, height: 568 },
      { name: '390x844', width: 390, height: 844 },
      { name: '1024x768', width: 1024, height: 768 },
      { name: '1440x900', width: 1440, height: 900 }
    ]
    const paths = ['/', '/proyectos/subastas', '/lab', '/about', '/cv']

    for (const vp of viewports) {
      console.log(`\n=== Viewport: ${vp.name} ===`)
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
      const page = await context.newPage()

      for (const path of paths) {
        try {
          await page.goto(`http://localhost:5173${path}`)
          await page.waitForLoadState('networkidle')

          const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
          const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
          const hasHorizontalOverflow = scrollWidth > clientWidth

          await page.screenshot({ path: `screenshots/${vp.name}-${path.replace(/\//g, '-')}.png`, fullPage: true })

          const title = await page.title()
          const bodyText = await page.textContent('body') || ''

          console.log(`  [${vp.name}] ${path}: overflow=${hasHorizontalOverflow} title="${title}"`)
          console.log(`    body: "${bodyText.substring(0, 80)}..."`)

          if (hasHorizontalOverflow) {
            console.log(`  ⚠️ HORIZONTAL OVERFLOW`)
          } else {
            console.log(`  ✅ No overflow`)
          }
        } catch (e) {
          console.log(`  ❌ ${path}: ${e.message.substring(0, 60)}`)
        }
      }

      await context.close()
    }

    await browser.close()
    console.log('\n✅ Visual QA completed - check screenshots')
  } catch (e) {
    console.error('Error:', e)
  } finally {
    dev.kill()
  }
}, 3000)