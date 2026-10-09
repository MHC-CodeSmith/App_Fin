# BeluBank

App web para controlar préstamos y cobros. Moneda: soles (S/).

- Cuotas con capital e interés (automáticas o con fecha y monto elegidos a mano para cada mes).
- Ficha del cliente: apodo, teléfono, cuánto gana al mes (y qué % de su ingreso es la cuota), nota y archivos adjuntos (contratos, fotos, videos).
- Atrasos, pagos de "solo interés", refinanciamientos y **Corregir** para arreglar errores.
- **Semáforo de cumplimiento** de cada cliente (Cumple / Regular / Riesgoso) con tolerancia de 3 días; pagar solo el interés a tiempo no cuenta como incumplir.
- **Monto fijo**: una cuota puede ser un monto acordado sin cálculo (por ejemplo, en un refinanciamiento).
- **Meses**: cada mes como en la nota (cliente, %, capital − interés, fecha y si pagó), con lo cobrado, lo que falta, la ganancia del mes y un gráfico para saltar entre meses.
- **Clientes**: buscador con lo recaudado de cada cliente (capital + interés), lo que debe, su % cumplido y hasta cuánto se le puede prestar sin riesgo; al tocar uno se ve todo su historial.
- **Año en foco**: arriba se elige el año (al abrir la app siempre es el año actual). La pantalla principal muestra el resumen del año y Clientes, Préstamos y Meses muestran lo de ese año.
- **Orden en el mes**: si un cliente tiene varios préstamos que empiezan el mismo mes, se marcan como *julio 1º*, *julio 2º*…
- **Mora**: S/ 5 por día de atraso (configurable), se suma sola al registrar el pago; cada cuota tiene un botón **Exonerar** para perdonarla.
- **Enviar estado**: enlace por WhatsApp para que el cliente vea solo su préstamo (en vivo si la nube está activa).
- **Nube (Firebase)**: con sesión de Google, todo se sincroniza entre celular y computadora.
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
3. Aparece el ícono **BeluBank**; ábrela desde ahí.
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

## Nube (Firebase)

Con **Respaldo → Nube → Entrar con Google**, los préstamos se guardan en Firestore (proyecto `belu-bank`) y se sincronizan entre todos los equipos donde se entre con la misma cuenta. Sin internet, la app sigue funcionando y sube los cambios al volver la conexión.

- Datos: `usuarios/{uid}` (datos generales) y `usuarios/{uid}/prestamos/{id}` (un documento por préstamo).
- Estado de cada cliente: `estados/{token}`, con un token aleatorio de 24 caracteres.
- Reglas de seguridad: [`firestore.rules`](firestore.rules). Cada cuenta solo ve sus propios datos. Un estado de cliente solo se puede leer conociendo su token; la colección no se puede listar.
- Los archivos adjuntos no van a Firestore: quedan en el equipo y se copian a Google Drive.

Configuración (ya hecha en el proyecto `belu-bank`):

- **Authentication**: inicio de sesión con Google activado; dominio autorizado `mhc-codesmith.github.io`.
- **Firestore**: base de datos `(default)` en `southamerica-west1` (Santiago).
- **Reglas**: [`firestore.rules`](firestore.rules). Para publicar cambios en las reglas:

  ```bash
  npx firebase-tools@latest login
  npx firebase-tools@latest deploy --only firestore:rules
  ```

## Enlace de estado para el cliente

En cada préstamo, **📤 Enviar estado** abre WhatsApp con un enlace como `https://mhc-codesmith.github.io/App_Fin/#estado=…`.
El cliente ve **solo lo que debe hoy**: el total, cuánto es capital, interés y mora, y su próximo pago (fecha y monto). No ve su historial, ni otros clientes, ni el resto de la app. El enlace y el documento en la nube solo llevan las cuotas pendientes.

- **Con la nube activa**, el enlace es fijo (`#c=<token>`) y muestra siempre el estado actual: se actualiza solo cuando se registra un pago.
- **Sin nube**, los datos van dentro del enlace (`#estado=…`, después de `#`, que el navegador no envía a ningún servidor) y es una foto del día en que se envía: después de cada pago hay que enviar un enlace nuevo.
- Quien tenga el enlace puede verlo, igual que una captura enviada por WhatsApp.

## Google Drive

La pestaña **Respaldo → Google Drive** guarda en la carpeta *BeluBank* del Drive el respaldo (`belu-bank-respaldo.json`), el Excel (`BeluBank.xlsx`) y los adjuntos (carpeta *Adjuntos*), manualmente o automáticamente después de cada cambio.

Configuración (ya hecha en el proyecto `belu-bank`):

- **Google Drive API** habilitada en el proyecto.
- `GOOGLE_CLIENT_ID` en `index.html` es el cliente web que Firebase creó al activar el inicio de sesión con Google
  (Google Cloud → APIs y servicios → Credenciales → *Web client (auto created by Google Service)*).
  En ese cliente, *Orígenes autorizados de JavaScript* debe incluir `https://mhc-codesmith.github.io`.

La app solo pide el permiso `drive.file`: puede ver y modificar únicamente los archivos que ella misma crea, no el resto del Drive.
El ID de cliente no es secreto (Google lo diseña para ir en el código de la página).

## Reglas de cálculo

- **Interés en %**: sobre el capital total, repartido entre los meses. `1000*16%/2mes → 500cap+80int=580`.
- **Redondeo**: el capital por cuota se redondea hacia arriba y el interés hacia abajo; la última cuota ajusta la diferencia (`2000*20%/3mes → 667+133=800`, última `666+134=800`).
- **Solo interés**: el cliente paga solo el interés del mes; ese pago queda registrado y toda la deuda pendiente se corre un mes (`3/3 +1 → 4/4`).
- **Refinanciamiento / juntar deudas** (en *Nuevo* o con el botón *Refinanciar* de un préstamo): se eligen una o varias deudas pendientes, de una o varias personas. Nuevo capital = capital pendiente de las elegidas + interés no pagado (por defecto, interés y mora de las cuotas ya vencidas) − abono. Las cuotas pendientes de las deudas viejas se cierran y quedan marcadas como *Renovado*, enlazadas al préstamo nuevo.
- **Mora**: `días de atraso × mora por día` (por defecto 5). Al registrar el pago se suma al interés de esa cuota y queda como ganancia. *Exonerar* la quita antes o después del pago.
- **Sin riesgo hasta**: interés ya cobrado al cliente − capital que todavía debe. Un préstamo nuevo menor o igual a ese monto queda cubierto por lo ya ganado con esa persona (en *Nuevo* aparece el aviso).
- **Abono**: si el cliente paga de más, el monto se descuenta de las próximas cuotas (primero capital, luego interés). Queda registrado como *abono* (cuenta como cobrado ese día) y las cuotas que llegan a 0 quedan *cubiertas*. Se puede anular.
- **Cumplimiento (semáforo)**, por cuota según su fecha límite y los días de tolerancia (3 por defecto, configurable en *Respaldo*):
  - *A tiempo* (pagó completo hasta la fecha límite) y *Tolerancia* (pagó completo hasta 3 días después): cuentan 100 %.
  - *Pagó interés* (solo el interés, dentro de la tolerancia): 75 %. Cumplió con lo importante.
  - *Tarde* (pagó después de la tolerancia): 25 %. *No pagó* (venció hace más de 3 días sin pago): 0 %.
  - Cliente: **Cumple** ≥ 85 %, **Regular** ≥ 60 %, **Riesgoso** < 60 %. Abonos, refinanciamientos y cuotas cubiertas no se evalúan.
- **Mes y año de cada cuota**: siempre por su **fecha límite**, aunque el cliente pague antes (adelanto) o después. Ganancia del mes = interés de las cuotas pagadas que vencen ese mes; *por cobrar* = interés de las que vencen ese mes y aún no se pagan.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La app completa (HTML + CSS + JS, sin dependencias; el Excel se genera ahí mismo) |
| `manifest.webmanifest`, `icons/` | Para instalarla como app en el celular |
| `sw.js` | Guarda la app (y las librerías de Firebase) para que abra sin internet |
| `firestore.rules` | Reglas de seguridad de Firestore (se pegan en la consola de Firebase) |

Los adjuntos se guardan en el navegador (IndexedDB), no en el repositorio.
