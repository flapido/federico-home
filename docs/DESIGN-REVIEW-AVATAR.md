# Senior Design Review — Avatar animado en `/about`

**Reviewer:** Senior Product Designer / UX-UI
**Fecha:** 2026-08-25
**Método:** inspección directa de capturas renderizadas a zoom 100% (matriz mobile, tablet y desktop). Se revisó también el contrato visual implementado para el estado normal, fallback y `prefers-reduced-motion`; no se modificó producción.

## Evidencia revisada

- Mobile: `test-results/about-avatar-320x568.png`, `about-avatar-390x844.png`, `about-avatar-430x932.png`.
- Tablet/desktop: `about-avatar-1024x768.png`, `about-avatar-1366x768.png`, `about-avatar-1920x1080.png`.
- Estado adicional: `about-video-390x844.png`.

La matriz muestra la tarjeta de `/about` con la misma geometría editorial, sin desbordamiento horizontal ni alteración del texto existente. Las capturas son imágenes estáticas del momento de captura; por tanto, el comportamiento temporal del MP4 (autoplay, `ended` y permanencia del último frame) requiere confirmación funcional separada.

## Hallazgos priorizados

### DR-AV-01 — Composición del retrato vertical dentro de la tarjeta

- **Severidad:** Low (observación, no bloqueante)
- **Evidencia:** 320×568, 390×844, 430×932, 1024×768, 1366×768 y 1920×1080. El retrato ocupa el área de medios sin deformarse y conserva cara/torso; el `object-contain` evita un crop agresivo de manos/cara. Se mantienen bordes redondeados y la leyenda inferior. En mobile el bloque no crece de forma excesiva.
- **Recomendación:** conservar el encuadre `contain` para el asset 9:16. Si el archivo final cambia de composición, validar que el sujeto permanezca centrado en cara/torso y que no aparezca crop lateral involuntario.
- **Criterio de aceptación:** en todos los viewports de la matriz, la tarjeta mantiene proporción y radio actuales; cara y manos permanecen legibles, sin deformación, overflow ni salto visible de layout.
- **Resultado:** PASS.

### DR-AV-02 — Fallback y reduced motion mantienen la jerarquía visual

- **Severidad:** Low
- **Evidencia:** el fallback usa la fotografía profesional existente y conserva exactamente el área 4:3 de la tarjeta; las capturas muestran un retrato estable y una leyenda alineada. La rama `prefers-reduced-motion` renderiza la misma imagen, sin controles ni overlay.
- **Recomendación:** conservar el fallback como estado visual de error, autoplay bloqueado o movimiento reducido. Añadir/ejecutar una captura explícita con emulación de `prefers-reduced-motion` en la verificación funcional final.
- **Criterio de aceptación:** reduced motion, error de carga y rechazo de `play()` muestran la foto sin cambio de dimensiones; no aparece video parcialmente cargado, control nativo ni contenido esencial perdido.
- **Resultado:** PASS visual; comportamiento de eventos pendiente de QA funcional.

### DR-AV-03 — Home no incorpora el avatar

- **Severidad:** Critical si falla; verificado PASS
- **Evidencia:** el cambio está encapsulado en `AboutAvatar` dentro de `/about`; no se observan elementos de video/avatar en las capturas de Home disponibles (`production-*`).
- **Recomendación:** mantener el asset referenciado únicamente por el componente de About y repetir un smoke de Home tras el build.
- **Criterio de aceptación:** navegar/renderizar Home no solicita ni muestra `/videos/federico-avatar.mp4`; sólo `/about` presenta el medio animado.
- **Resultado:** PASS visual/source-scope.

## Revisión por viewport

- **320×568:** PASS. Header y CTA son proporcionales; avatar no invade el contenido y no hay overflow.
- **390×844:** PASS. Tarjeta, caption y separación con “Quién soy” se leen con ritmo cómodo.
- **430×932:** PASS. El retrato respira dentro de la tarjeta y no genera sección excesivamente alta.
- **1024×768:** PASS. Hero de dos columnas equilibrado; medio no domina el headline.
- **1366×768:** PASS. Proporción editorial estable; tarjeta y cards inferiores alineadas.
- **1920×1080:** PASS. Contenedor centrado y avatar contenido, sin estiramiento de layout desktop.

## Accesibilidad y confianza visual

No se agregan controles inaccesibles, sonido, overlay, CTA ni interacción obligatoria. El texto de About permanece intacto. El video está marcado como decorativo (`aria-hidden`) y la foto fallback conserva el tratamiento visual aprobado. No se observan defectos de tipografía, alineación, contraste de superficies, clipping o navegación móvil en el alcance revisado.

## Recheck posterior — 2026-08-26

Se revisaron las capturas actuales `screenshots/v2/*-about.png` a zoom 100%. La matriz disponible contiene 10 tamaños (320×568, 360×800, 375×812, 390×844, 412×915, 430×932, 1024×768, 1366×768, 1440×900 y 1920×1080), cubriendo y ampliando los 8 viewports solicitados.

- **Mobile (320/360/375/390/412/430): PASS.** El poster/fallback 16:9 llena el ancho útil de la tarjeta con radio consistente; rostro, torso y manos quedan visibles sin crop agresivo. La altura del bloque se reduce frente al anterior retrato pillarboxed, y no hay overflow ni salto apreciable. El texto de About, CTAs, cards y footer conservan jerarquía y legibilidad.
- **Tablet (1024): PASS.** La imagen 16:9 equilibra la columna derecha con el headline, sin dominar el hero ni alterar la grilla de contenido.
- **Desktop (1366/1440/1920): PASS.** El encuadre horizontal se mantiene natural y centrado; el contenedor sigue respirando, con alineación estable de hero, cards y contacto. No se observa estiramiento, clipping ni desbalance visual.

No se detectaron nuevos hallazgos visuales. La revisión continúa sin poder inferir desde una captura estática el ciclo temporal autoplay/once; ese punto permanece bajo QA funcional de navegador.

**Recheck visual: PASS.**

## Gate

**Senior Design Review: PASS**
**PRODUCT_QUALITY_GATE (visual): PASS**

## Functional QA addendum

Playwright local confirmed the temporal cycle, media-error fallback, reduced-motion fallback and route isolation: 7/7 scenarios PASS. The earlier note about functional confirmation is superseded by this evidence.

## Recheck 2026-08-26

Re-rendered the current 16:9 poster/video implementation at 320, 360, 390, 430, 1024, 1366, 1440 and 1920 widths. The horizontal poster fills the `aspect-video` media region without letterboxing, face/torso remain centered, labels remain aligned, and no overflow or material layout shift is visible. **PASS.**

La integración renderizada es profesional, contenida y responsive. El único pendiente no visual es ejecutar/reconfirmar con navegador el ciclo temporal de reproducción, error de media y emulación de reduced motion dentro del QA funcional final.
