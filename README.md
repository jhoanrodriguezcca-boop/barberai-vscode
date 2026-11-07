# BarberAI - Sistema Autónomo de Agendamiento por WhatsApp (VS Code Project)

Este proyecto corresponde a la implementación interactiva y demostrativa para la asignatura **Requerimientos de Software** (Docente: Juan Carlos Pérez Castillo).

---

## 📁 Estructura del Proyecto

```
barberai-vscode/
├── index.html       # Estructura principal (Dual panel: WhatsApp Simulator + Barber Dashboard)
├── styles.css       # Estilos personalizados (Burbujas WhatsApp, animaciones de IA, scrollbars)
├── app.js           # Lógica del motor de PLN, procesamiento de intenciones, dashboard y métricas
└── README.md        # Guía de ejecución en Visual Studio Code
```

---

## 🚀 Cómo Ejecutarlo desde Visual Studio Code

1. **Abrir la carpeta en VS Code:**
   - Descarga y descomprime este archivo `.zip`.
   - Abre **Visual Studio Code**.
   - Haz clic en `Archivo` > `Abrir carpeta...` (o `Open Folder...`) y selecciona la carpeta `barberai-vscode`.

2. **Opción Recomendada - Con Extensión Live Server:**
   - Ve a la pestaña de Extensiones en VS Code (`Ctrl + Shift + X` o `Cmd + Shift + X`).
   - Busca **"Live Server"** (creada por *Ritwick Dey*) y haz clic en **Instalar**.
   - Abre el archivo `index.html`.
   - Haz clic derecho sobre el editor del archivo y selecciona **"Open with Live Server"**.
   - Se abrirá automáticamente tu navegador web con la aplicación en vivo.

3. **Opción Directa (Sin extensiones):**
   - Simplemente haz doble clic sobre el archivo `index.html` en el Explorador de archivos para abrirlo en tu navegador favorito (Chrome, Edge, Firefox).

---

## 🛠️ Requerimientos ACA Mapeados en la Aplicación

- **RF01 (Procesamiento de Lenguaje Natural):** Interpreta intenciones de usuario en la interfaz del chat simulado.
- **RF02 (Consulta en Tiempo Real):** Mantiene sincronizado el calendario de los 3 barberos principales sin solapamientos.
- **RF03 (Agendamiento Autónomo):** Al confirmar en el chat, la cita se registra dinámicamente en el tablero de control.
- **RNF01 (Usabilidad):** Flujo conversacional guiado en menos de 4 intercambios.
- **RNF02 (Rendimiento):** Simulación de tiempo de respuesta de IA en 1.2 segundos.

---
*Año 2026 - Proyecto Académico ACA Requerimientos de Software*
