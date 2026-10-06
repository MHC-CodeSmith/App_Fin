# Belu Bank

App web para controlar préstamos y cobros: cuotas con capital e interés, atrasos, pagos de "solo interés", refinanciamientos, ganancia por mes y recordatorios por WhatsApp. Moneda: soles (S/).

Funciona en el celular como app instalada y también sin internet. Con un botón descarga todo en Excel (`.xlsx`) para verlo, imprimirlo o guardarlo en Excel o Google Sheets.

## Privacidad

Este repositorio es público y **solo contiene la app y datos de ejemplo ficticios**.
Los préstamos reales se guardan únicamente en el navegador de quien usa la app (`localStorage`) y nunca se suben a GitHub.
No hagas commit de los archivos de respaldo (`belu-bank-respaldo-*.json`); el `.gitignore` ya los excluye.

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
Descarga un respaldo cada semana: **Respaldo → Descargar respaldo (.json)** y guárdalo en Drive o envíalo a tu WhatsApp.
Para pasar los datos a otro equipo: descarga el respaldo en uno y usa **Restaurar respaldo** en el otro.
Cada equipo guarda su propia copia; no se sincronizan solos.

## Excel

**Respaldo → Descargar Excel (.xlsx)** (o el botón **⬇ Excel** en Préstamos) genera un archivo con 3 hojas:

- **Resumen**: capital en la calle, por cobrar del mes, cobrado, ganancia, atrasos y totales mes a mes.
- **Préstamos**: un préstamo por fila, con lo pendiente y lo cobrado.
- **Cuotas**: cada cuota con su fecha, estado, días de atraso y enlace de WhatsApp. En el Excel se puede cambiar el Estado a *Pagado* y el Resumen se recalcula.

El Excel es para ver y guardar. Para restaurar la app se usa siempre el respaldo `.json`.

## Reglas de cálculo

- **Interés en %**: sobre el capital total, repartido entre los meses. `1000*16%/2mes → 500cap+80int=580`.
- **Redondeo**: el capital por cuota se redondea hacia arriba y el interés hacia abajo; la última cuota ajusta la diferencia (`2000*20%/3mes → 667+133=800`, última `666+134=800`).
- **Solo interés**: el cliente paga solo el interés del mes; ese pago queda registrado y toda la deuda pendiente se corre un mes (`3/3 +1 → 4/4`).
- **Refinanciar**: capital pendiente + interés no pagado − abono, repartido en nuevos meses con un nuevo interés (por ejemplo, simbólico por mes).

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La app completa (HTML + CSS + JS, sin dependencias; el Excel se genera ahí mismo) |
| `manifest.webmanifest`, `icons/` | Para instalarla como app en el celular |
| `sw.js` | Guarda la app para que abra sin internet |
