# Borrador 04 · Lecciones de integraciones fiscales multi-país

- **Estado:** DRAFT — publicación manual del owner.
- **Objetivo:** contar experiencia real de integraciones e-invoicing sin exponer internals ni clientes.
- **Audiencia:** equipos de producto/ingeniería de fintech, ERPs y SaaS multi-país.
- **Momento sugerido:** cuarto post; martes–jueves.
- **Límite revisado:** habla de países y patrones públicos ya declarados por el propio CV; cero detalles internos.

---

```
"Facturación electrónica para Latinoamérica". Suena a un requisito. Son cuatro mundos distintos.

Trabajé años integrando facturación electrónica en C#/.NET para Costa Rica, México, Chile y República Dominicana, y estas lecciones quedaron:

1. Cada país tiene su propia definición de "factura válida". El formato es solo la superficie; las reglas fiscales cambian por tipo de comprobante, moneda y hasta por momento del mes.

2. El mapeo XML es donde vive el detalle. Un campo mal ubicado no tira error: genera rechazos tres pasos después, cuando ya nadie espera el problema.

3. Los pipelines de mensajería valen más que cualquier lógica elegante. Procesar documentos entre sistemas exige reintentos, orden e idempotencia, no solo un endpoint bonito.

4. Las APIs tributarias no perdonan supuestos. Validar temprano y registrar todo: cuando una autoridad fiscal responde "rechazado", querés saber exactamente qué enviaste.

5. Los tests automatizados no son opcional aquí. NUnit y Moq bajo TDD fueron la diferencia entre refactorizar con confianza y rezar antes de cada release.

Integrar sistemas es fácil hasta que interviene dinero y regulaciones. Después, la disciplina gana.

¿Cuál fue su peor sorpresa integrando con una API gubernamental?

#SystemIntegration #EInvoicing #DotNet #Fintech #SoftwareEngineering
```

Longitud verificada: ~1320 caracteres (límite LinkedIn 3000).
