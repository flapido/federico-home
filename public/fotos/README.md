# Fotos — Federico Home

Coloca aquí las imágenes reales para reemplazar placeholders sin tocar código.

## Archivos esperados

- public/fotos/federico-profile.webp  — avatar / foto principal (Home hero + CV) — 800x800 cuadrado
- public/fotos/federico-about-01.webp — About, foto 01 — 1200x900
- public/fotos/federico-about-02.webp — About, foto 02 — 900x1200 vertical
- public/fotos/federico-about-03.webp — opcional, objetos/lugares

## Formato

- WebP o JPG, ~1200px ancho máximo, comprimido.
- Nombre exacto. El componente usa <img> con fallback a placeholder si no existe.

## Cómo reemplazar

1. Exporta la foto en el tamaño indicado.
2. Cópiala a public/fotos/ con el nombre exacto.
3. Recarga — el componente mostrará la foto automáticamente (sin rebuild si usas dev).

Si no existen, la web muestra placeholders gráficos elegantes con borde hairline y monograma FL, sin cuadrados grises feos.

