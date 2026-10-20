# SafeData IA

Prototipo académico desarrollado para la materia **Programación IV – Ejercitación 3.1**, basado en el diseño UX elaborado en la Ejercitación 1.1.

**Integrantes:** Valentín Ortega, Joshua Narvaez y Horacio Miron.

## Objetivo

Demostrar un flujo de revisión de posibles datos personales en documentos de texto mediante reglas sencillas ejecutadas en el navegador (del lado del cliente).

**Advertencia:** Este es un prototipo académico y no garantiza la anonimización total. No debe utilizarse con información confidencial o datos personales reales.

## Pantallas del proyecto

- `index.html`: presentación del problema, objetivo y acceso a la herramienta.
- `pages/anonimizar.html`: formulario principal, selección de categorías de datos a ocultar, validación y revisión del texto procesado.
- `pages/resultados.html`: pantalla independiente de ejemplo para comparar textos, editar el resultado y descargar un archivo TXT.

## Tecnologías utilizadas

- **HTML5:** etiquetas semánticas y estructura de las páginas.
- **CSS3:** variables, Flexbox, Grid, diseño responsive y transiciones.
- **JavaScript nativo:** manipulación del DOM, eventos, validaciones, expresiones regulares (Regex) y generación de archivos mediante Blob.
- **Sin frameworks ni librerías externas de CSS o JavaScript**, de acuerdo con la consigna.

## Funcionalidades implementadas

- **Validación de formularios:** longitud mínima de 3 caracteres para el título y 20 caracteres para el texto, con mensajes de error visibles.
- **Selección de categorías:** casillas para elegir los tipos de datos que se desean ocultar.
- **Anonimización aproximada:** reglas mediante expresiones regulares para identificar correos electrónicos, DNI, teléfonos, nombres con etiquetas explícitas y edades.
- **Revisión manual:** comparación entre el texto original y el procesado, con posibilidad de editar el resultado.
- **Descarga:** generación de un archivo de texto en formato `.txt`.

## Cómo probar el proyecto localmente

1. Descargar o clonar el repositorio.
2. Abrir `index.html` en un navegador moderno.
3. Seleccionar **«Comenzar a anonimizar»**.
4. Ingresar un título y pegar un texto ficticio de al menos 20 caracteres.
5. Seleccionar las categorías de datos que se desean ocultar.
6. Presionar **«Procesar»**.
7. Revisar el resultado, realizar las correcciones necesarias y descargar el archivo TXT.

**Ejemplo de texto ficticio:**

> Paciente de prueba: Juan Pérez. DNI: 12.345.678. Correo: juan@test.com. Teléfono: 2615551234.

### Ejecución mediante servidor local

Durante el desarrollo, el proyecto se probó mediante un servidor HTTP local, utilizando el puerto `5500`.

Dirección utilizada en la computadora:

`http://localhost:5500`

Para comprobar el diseño responsive desde un teléfono Android conectado a la misma red Wi-Fi, se utilizó la dirección IP local de la computadora:

`http://192.168.0.106:5500`

Esta última dirección correspondía a la red utilizada durante las pruebas y puede cambiar al conectarse a otra red.

El servidor se ejecutó desde PowerShell mediante las herramientas HTTP de .NET.

## Pruebas en servidor local e inconvenientes encontrados

Durante la etapa de verificación se presentaron algunas dificultades técnicas que permitieron comprobar y ajustar el entorno de pruebas.

### 1. Acceso desde otros dispositivos

**Situación:** inicialmente, el proyecto se visualizaba desde la computadora mediante `localhost`, pero era necesario comprobar su funcionamiento desde un teléfono.

**Solución:** se utilizó un servidor HTTP accesible desde la red local y se ingresó desde el teléfono mediante la dirección IP de la computadora y el puerto `5500`.

**Resultado:** fue posible revisar la adaptación del diseño y la navegación desde un dispositivo Android.

### 2. Ejecución de Lighthouse desde Firefox

**Situación:** se intentó utilizar Lighthouse desde Firefox, pero la alternativa basada en PageSpeed Insights no permitía auditar correctamente un sitio alojado en `localhost`.

**Solución:** se instaló Google Chrome y se utilizó Lighthouse desde sus herramientas de desarrollo.

**Resultado:** se pudieron ejecutar auditorías locales de rendimiento, accesibilidad, buenas prácticas y SEO.

### 3. Configuración de Node.js y PowerShell

**Situación:** durante las pruebas se instaló Node.js para intentar ejecutar Lighthouse desde la terminal. PowerShell presentó restricciones para ejecutar archivos de comandos con extensión `.ps1`.

**Solución:** se utilizaron los ejecutables `npm.cmd` y `npx.cmd` para evitar esa restricción. Posteriormente, las auditorías se realizaron desde Chrome, ya que la ejecución por terminal también requería una instalación de Chrome disponible.

### 4. Error temporal durante una auditoría

**Situación:** una primera auditoría de la página `resultados.html` devolvió el error `NO_FCP`, que indicaba que Lighthouse no había detectado contenido renderizado durante esa ejecución.

**Solución:** se verificó que la página cargara correctamente en Chrome y se repitió la auditoría.

**Resultado:** se obtuvieron informes válidos para la página de resultados.

### 5. Advertencias relacionadas con HTTP y Kaspersky

**Situación:** Lighthouse señaló solicitudes HTTP no seguras y detectó recursos adicionales asociados al software de seguridad Kaspersky.

**Observación:** estas solicitudes externas y el uso de un servidor local HTTP influyeron en el diagnóstico de buenas prácticas. No representan necesariamente errores del código HTML, CSS o JavaScript del proyecto.

**Próximo paso:** publicar el sitio mediante GitHub Pages, utilizando HTTPS, y repetir las auditorías para comparar los resultados.

## Resultados de Lighthouse

Se realizaron auditorías desde Google Chrome, incluyendo pruebas en modalidad móvil.

| Página evaluada | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---:|---:|---:|---:|
| Inicio | 94 | 100 | 81 | 100 |
| Sección Solución | 93 | 100 | 81 | 100 |
| Sección Proceso | 93 | 100 | 81 | 100 |
| Anonimizar | 94 | 100 | 81 | 100 |
| Resultados (primera prueba válida) | 91 | 100 | 81 | 100 |
| Resultados (segunda prueba válida) | 94 | 100 | 81 | 100 |

Estos resultados corresponden al entorno de pruebas local y pueden variar según el dispositivo, el navegador y las condiciones de ejecución.

## Limitaciones conocidas

- **Formatos:** el procesamiento principal se realiza sobre texto pegado en el formulario. No se implementó lectura de documentos PDF o DOCX.
- **Precisión:** las expresiones regulares pueden omitir datos personales o detectar información incorrectamente.
- **Revisión:** el usuario debe comprobar manualmente el texto procesado.
- **Perfiles:** la elección del perfil profesional es informativa; las reglas aplicadas dependen de las casillas seleccionadas.
- **Resultados:** `pages/resultados.html` presenta un ejemplo independiente y no recibe automáticamente el texto procesado desde el formulario.
- **Inteligencia artificial:** no se utiliza un modelo de IA ni un servicio externo de procesamiento.
- **Almacenamiento:** no se implementó una base de datos ni almacenamiento permanente de documentos.
