# Belu Bank

App web para controlar préstamos y cobros. Moneda: soles (S/).

- Cuotas con capital e interés (automáticas o con fecha y monto elegidos a mano para cada mes).
- Ficha del cliente: apodo, teléfono, cuánto gana al mes (y qué % de su ingreso es la cuota), nota y archivos adjuntos (contratos, fotos, videos).
- Atrasos, pagos de "solo interés", refinanciamientos y **Corregir** para arreglar errores.
- **% cumplido** de cada cliente: cuotas pagadas completas y a tiempo sobre las que ya vencieron.
- **Ganancias**: cuánto se gana por mes (cobrado y por cobrar), promedio mensual y total del año.
- **Enviar estado**: enlace por WhatsApp para que el cliente vea solo su préstamo.
- Recordatorios por WhatsApp, Excel y respaldo en Google Drive.

Funciona en el celular como app instalada y también sin internet. Con un botón descarga todo en Excel (`.xlsx`) para verlo, imprimirlo o guardarlo en Excel o Google Sheets.

## Privacidad

Este repositorio es público y **solo contiene la app y datos de ejemplo ficticios**.
Los préstamos reales se guardan únicamente en el navegador de quien usa la app (`localStorage`) y nunca se suben a GitHub.
No hagas commit de los archivos de respaldo (`belu-bank-respaldo-*.json` / `.zip`); el `.gitignore` ya los excluye.

## Publicar (GitHub Pages), una sola vez

1. En GitHub: **Settings → Pages**.
2. En *Build and deployment*: Source = **Deploy from a branch**, Branch = **main**, carpeta **/ (root)** → **Save**.
3. En 1–2 minutos la app queda en: **https://mhc-codesmith.github.io/App_Fin/**

## Instalar en el celular (Android)

1. Abre el enlace de arriba en **Chrome**.
2. Menú **⋮ → Agregar a pantalla principal** (o **Instalar app**).
3. Aparece el ícono **Belu Bank**; ábrela desde ahí.
4. Pestaña **Respaldo → Empezar vacío**, o **Restaurar respaldo** para cargar un `.json` traído de otro equipo.

En iPhone: Safari → botón Compartir → **Agregar a inicio**.

## Respaldos

Los datos viven solo en ese celular. Si se borran los datos de Chrome o se cambia de celular, se pierden.
Descarga un respaldo cada semana (**Respaldo → Descargar respaldo**; si hay adjuntos sale como `.zip` con todo) o actívalo en Google Drive.
Para pasar los datos a otro equipo: descarga el respaldo en uno y usa **Restaurar respaldo** en el otro.
Cada equipo guarda su propia copia; no se sincronizan solos.

## Excel

**Respaldo → Descargar Excel (.xlsx)** (o el botón **⬇ Excel** en Préstamos) genera un archivo con 3 hojas:

- **Resumen**: capital en la calle, por cobrar del mes, cobrado, ganancia, atrasos y totales mes a mes.
- **Préstamos**: un préstamo por fila, con lo pendiente y lo cobrado.
- **Cuotas**: cada cuota con su fecha, estado, días de atraso y enlace de WhatsApp. En el Excel se puede cambiar el Estado a *Pagado* y el Resumen se recalcula.

El Excel es para ver y guardar. Para restaurar la app se usa siempre el respaldo `.json`.

## Enlace de estado para el cliente

En cada préstamo, **📤 Enviar estado** abre WhatsApp con un enlace como `https://mhc-codesmith.github.io/App_Fin/#estado=…`.
El cliente ve solo su préstamo: lo pagado, lo que falta, la próxima cuota y la lista de cuotas. No ve el resto de la app.

- Los datos van **dentro del enlace** (después de `#`, que el navegador no envía a ningún servidor). No hay base de datos en internet.
- Es una **foto del día en que se envía**: después de cada pago hay que enviar un enlace nuevo.
- Quien tenga el enlace puede verlo, igual que una captura enviada por WhatsApp.

## Google Drive

La pestaña **Respaldo → Google Drive** guarda en la carpeta *Belu Bank* del Drive el respaldo (`belu-bank-respaldo.json`), el Excel (`Belu Bank.xlsx`) y los adjuntos (carpeta *Adjuntos*), manualmente o automáticamente después de cada cambio.

Para activarlo hay que crear una vez un ID de cliente de Google (gratis, unos 10 minutos):

1. Entra a <https://console.cloud.google.com/> y crea un proyecto, por ejemplo *Belu Bank*.
2. **APIs y servicios → Biblioteca**: busca **Google Drive API** y pulsa **Habilitar**.
3. **Google Auth Platform → Branding** (pantalla de consentimiento): nombre *Belu Bank*, tu correo de soporte. Tipo de usuarios: **Externo**.
4. **Público (Audience)**: agrega como *usuario de prueba* el Gmail que va a usar la app (o pulsa *Publicar app*; el permiso `drive.file` no necesita verificación de Google).
5. **Clientes → Crear cliente → Aplicación web**. En *Orígenes autorizados de JavaScript* agrega `https://mhc-codesmith.github.io`. Crea y copia el **ID de cliente** (termina en `.apps.googleusercontent.com`).
6. En `index.html`, pega el ID en `const GOOGLE_CLIENT_ID = '';` y haz commit.

La app solo pide el permiso `drive.file`: puede ver y modificar únicamente los archivos que ella misma crea, no el resto del Drive.
El ID de cliente no es secreto (Google lo diseña para ir en el código de la página).

## Reglas de cálculo

- **Interés en %**: sobre el capital total, repartido entre los meses. `1000*16%/2mes → 500cap+80int=580`.
- **Redondeo**: el capital por cuota se redondea hacia arriba y el interés hacia abajo; la última cuota ajusta la diferencia (`2000*20%/3mes → 667+133=800`, última `666+134=800`).
- **Solo interés**: el cliente paga solo el interés del mes; ese pago queda registrado y toda la deuda pendiente se corre un mes (`3/3 +1 → 4/4`).
- **Refinanciar**: capital pendiente + interés no pagado − abono, repartido en nuevos meses con un nuevo interés (por ejemplo, simbólico por mes).
- **% cumplido**: de las cuotas ya vencidas (o pagadas), cuántas se pagaron completas en o antes de su fecha límite. Un mes de *solo interés* cuenta como no cumplido.
- **Ganancia del mes**: interés de las cuotas cobradas ese mes (por fecha de pago). *Por cobrar*: interés de las cuotas que vencen ese mes y aún no se pagan.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La app completa (HTML + CSS + JS, sin dependencias; el Excel se genera ahí mismo) |
| `manifest.webmanifest`, `icons/` | Para instalarla como app en el celular |
| `sw.js` | Guarda la app para que abra sin internet |

Los adjuntos se guardan en el navegador (IndexedDB), no en el repositorio.
