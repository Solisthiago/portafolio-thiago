# Portafolio de Santiago Solís (Thiago)

Landing page de portafolio hecha a medida, sin plantillas. Construida el 21 de octubre de 2026.

## Cómo verlo en tu computador

El sitio necesita abrirse desde un servidor local, no con doble clic (con doble clic no cargan letras, fotos ni animaciones). Desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

Y abre http://localhost:8000 en Chrome. Para verlo como celular: clic derecho → Inspeccionar → ícono de celular.

## Estructura de la carpeta

| Archivo o carpeta | Para qué sirve |
|---|---|
| `index.html` | La página en español |
| `en/index.html` | La página en inglés |
| `css/estilos.css` | Todos los estilos y los colores |
| `js/main.js` | Animaciones, filtros, barra fija y vista previa |
| `datos/proyectos.json` | **La lista de tus proyectos** (textos, créditos, imágenes) |
| `herramientas/generar-proyectos.py` | Convierte esa lista en las tarjetas y el archivo de las dos páginas |
| `herramientas/iconos.svg` | Los íconos de los programas (Illustrator, Photoshop…); el generador los pone en las dos páginas |
| `img/` | Tu foto, isotipo, patrón, íconos e imagen para compartir |
| `img/proyectos/` | Las imágenes de cada proyecto en dos tamaños (1200 y 640 px) |
| `fonts/` | Archivo y Mr Dafoe, servidas desde el propio sitio |
| `vendor/` | GSAP 3.13.0 (con ScrollTrigger y SplitText) y Lenis 1.3.11 |
| `direccion-de-arte.html` | La hoja de muestra con que aprobamos el diseño (no se publica) |
| `video/` | Los reels de la sección «Video y reels», con su portada |
| `materiales/` | Originales: fotos, recortes, el paquete de contexto, `brands2/` (marcas de PhoneDoctors, Macparts y Proteux) y `reels-originales/` (no se publica) |
| `revision/` | Capturas de revisión (no se publica) |

## Cómo agregar o cambiar un proyecto

1. Guarda sus imágenes en `img/proyectos/` con el nombre `<clave>-<número>-1200.webp` y `<clave>-<número>-640.webp` (WebP de calidad 75 a 80; squoosh.app sirve).
2. Abre `datos/proyectos.json` y copia un proyecto existente como modelo. Cambia nombre, tipo, año, disciplinas, textos, rol, equipo, herramientas e imágenes. Dentro de `"en"` va la versión en inglés: resumen, texto, rol, equipo y `alts` (una descripción por imagen, en el mismo orden). Si falta, la página en inglés usa el texto en español.
3. Para destacarlo en "Trabajo seleccionado", pon su `slug` en la lista `destacados`.
4. Desde la carpeta del proyecto corre:

```bash
python3 herramientas/generar-proyectos.py
```

Las disciplinas que existen para los filtros son: Branding, Redes sociales, UI/UX, Editorial, Infografía, Ilustración, Motion y Web (en inglés: Branding, Social media, UI/UX, Editorial, Infographics, Illustration, Motion y Web). Para esconder un proyecto sin borrarlo, ponle `"oculto": true`. En «herramientas» escribe los programas separados por coma; los que tienen ícono son: Illustrator, Photoshop, InDesign, Lightroom, After Effects, Premiere Pro, Procreate, Final Cut Pro, DaVinci Resolve, WordPress, HTML y CSS, herramientas de IA. El comando actualiza las dos páginas.

## Cambios fáciles

- **Titular en inglés:** en `en/index.html`, «Brands you / can read» con la cursiva «from afar».
- **Titular:** en `index.html`, busca `Marcas` y `que se leen`; la cursiva está en `<p class="script"...>de lejos</p>` y en el texto oculto `<span class="oculto">de lejos</span>` (cámbialos juntos).
- **WhatsApp:** el número es 573005198202. Cada botón trae su propio mensaje en el enlace (`?text=`), para que sepas desde dónde te escriben.
- **Colores:** al inicio de `css/estilos.css`, en `:root`.
- **Textos fijos de la página en inglés** (secciones, botones, Sobre mí): están escritos directamente en `en/index.html`. Si cambias uno en español, cámbialo también ahí.
- **Después de cambiar CSS o JS**, sube el número `?v=` en `index.html` y en `en/index.html` (por ejemplo `?v=20261023e`) para que el hosting no muestre la versión vieja.

## Videos

- **Videos cortos en la galería de un proyecto** (se repiten solos, sin sonido): guarda `img/proyectos/<clave>-v1.mp4` y su portada `img/proyectos/<clave>-v1.webp`, y agrega en `imagenes` una entrada así: `["v1", "Descripción", "video", ancho, alto]`. En `"en"` → `alts` va su descripción en inglés, en el mismo orden.
- **Reels de la sección "Video y reels"**: el video va en `video/` (MP4, unos 720 × 1280 y menos de 6 MB) con su portada en JPG. En `index.html` y `en/index.html`, copia un bloque `<figure class="reel">` dentro de `reels__videos` y cambia el archivo y el texto. Hoy hay 5 (todos de PhoneDoctors). En celular se deslizan de lado; en computador quedan en una fila de 5.
- Los videos pesados conviene comprimirlos antes de subirlos; pídemelo y lo hago.

## Dirección de arte aprobada: "Bloque y firma"

Un afiche: THIAGO gigante detrás de ti y SOLÍS acostado en el piso, letras de bloque condensadas y una cursiva que las cruza como una firma.

### Colores

| Color | HEX | Papel | Contraste |
|---|---|---|---|
| Evergreen | `#043222` | Textos, botones, afiche | 11.84 sobre crema |
| Evergreen noche | `#021A12` | Contacto y pie | — |
| Verde medio | `#1E5A40` | Apoyo | 6.78 sobre crema |
| Almond Cream | `#F6E9D9` | Fondo | — |
| Superficie | `#FBF4EA` | Tarjetas y archivo | — |
| Violeta eléctrico | `#6A2CF5` | Cursiva, rombos, hover, barra fija | 5.34 sobre crema · 6.38 con letra blanca |
| Violeta claro | `#A98BFF` | Acento sobre verde | 5.27 sobre Evergreen |
| Texto secundario | `#4F5E55` | Párrafos de apoyo | 5.73 sobre crema |

### Letras

- **Archivo** variable (pesos 100 a 900, ancho 62 a 125 %). Titulares en 900 al 62 % de ancho, en mayúsculas.
- **Mr Dafoe**, la cursiva de pincel, solo en la portada ("de lejos") y en el cierre ("juntos?").

### Elementos propios

Isotipo (tu cara) · rombo · nombre de afiche THIAGO / SOLÍS · microtexto justificado · píldoras · patrón de herramientas en "Sobre mí".

### Movimiento

Preciso, editorial y con calle. Valores técnicos:

```js
const M = { ease: 'power4.out', easeIO: 'power3.inOut', pop: 'back.out(1.4)', dur: 1.05, stagger: 0.075, dist: 48, lerp: 0.12 };
```

CSS: `--ease: cubic-bezier(.22,1,.36,1)`, `--ease-io: cubic-bezier(.76,0,.24,1)`, `--ease-pop: cubic-bezier(.34,1.4,.64,1)`, `--dur: 1.05s`, `--dist: 48px`.

**Firma de la portada (unos 2.6 s, un toque la adelanta):**

1. El afiche verde sube.
2. THIAGO sale del piso letra por letra.
3. Aparece SOLÍS en el piso y entras tú.
4. El titular sube línea por línea y la cursiva se escribe.
5. Se pega el isotipo y su rombo cae en el botón "Escríbeme".

| # | Sección | Gesto protagonista | Intensidad |
|---|---|---|---|
| 1 | Portada | La firma | 3 |
| 2 | Trabajo seleccionado | Las imágenes se abren de abajo hacia arriba | 3 |
| 3 | Todos los proyectos | Filas en cascada; vista previa que sigue al mouse | 2 |
| 4 | Cómo trabajo | La línea avanza con el scroll | 2 |
| 5 | Sobre mí | El isotipo se pega | 2 |
| 6 | Lab | Entrada discreta | 1 |
| 7 | Contacto | La cursiva se escribe y THIAGO vuelve a salir del piso | 3 |

Con "Reducir movimiento" activado, o si el JavaScript falla, todo se ve completo y quieto. Si una pieza en pantalla sigue escondida al detener el scroll, se muestra sola (rescate).

## Visitas

El contador es GoatCounter (gratis y sin cookies, así que no hace falta aviso de cookies). Las visitas se ven en https://solisthiago.goatcounter.com con tu usuario. El código está al final de `index.html` y `en/index.html`; las visitas desde tu computador en `localhost` no se cuentan.

También se cuentan los clics en WhatsApp, correo y LinkedIn. En el panel salen como eventos con nombres así: `clic-whatsapp-contacto` (botón del final), `clic-whatsapp-inicio` (portada), `clic-whatsapp-menu` (menú), `clic-whatsapp-p-macparts` (el «Quiero algo así» de un proyecto), `clic-correo-…`, `clic-linkedin-…`. Los de la versión en inglés terminan en `-en`.

## Google

El sitio está verificado en Google Search Console (https://search.google.com/search-console, con santiagomezsolis@gmail.com) con la etiqueta `google-site-verification` de `index.html` y `en/index.html`: **no la borres**. El `sitemap.xml` lista las dos versiones del sitio; si agregas páginas nuevas, súmalas ahí y cambia la fecha `lastmod`.

## Contacto en el sitio

- WhatsApp: +57 300 519 8202 (botones con mensaje según el lugar)
- Correo: santiagomezsolis@gmail.com
- LinkedIn: https://www.linkedin.com/in/santiago-solis-714525398/

## Por validar (lo decidí yo, confírmalo)

1. Titular "Marcas que se leen *de lejos*" (dijiste que no estabas seguro). Otras opciones: "Diseño con *carácter*", "Ideas que se quedan *con firma*".
2. Firma "Santiago Solís" en el menú y en el pie; "Thiago" en el afiche y en "Me dicen Thiago".
3. Tu foto sentado a color, recortada por ti; la sombra del piso la dibuja el sitio.
4. Casos destacados: PhoneDoctors, Proteux UI Kit, PhoneDoctors redes y Macparts.
5. Los textos de cada proyecto los escribí a partir de tu documento de contexto. Revisa en especial PhoneDoctors.
6. En los proyectos de equipo te sumé al final de los créditos. Los nombres de compañeros salen de un resumen automático del Wix: compáralos con el original.
7. Las imágenes de PhoneDoctors están asignadas a cada pieza según el orden del Wix (rebranding, motion, web, carrusel, cuadros, merch); el mapeo era "probable".
8. Los cuatro pasos de "Cómo trabajo" los escribí yo.
9. En Lab, Halftone Lab lo describí como "convierte imágenes en semitono". Corrígelo si hace algo más.
10. El botón fijo en celular es violeta para que se vea sobre las secciones verdes.
11. Verde medio y Evergreen noche son variaciones de tu paleta, no colores nuevos.
12. La versión en inglés la traduje yo. El botón principal es «Contact me». El cierre es «Let's work *together*», más corto que la traducción literal para que la cursiva no tape el título.
13. Macparts volvió al archivo con sus posts de Instagram (22-oct-2026).
14. La imagen para compartir es la misma en los dos idiomas y dice «diseñador gráfico».
15. Proteux aparece solo como **UI Kit** (lo único tuyo): interfaz, kit completo, fundamentos, colores y componentes, sacados del manual en `materiales/brands2/`.
16. La galería de PhoneDoctors suma láminas de marca (usos del logo, logo en bloque, versión horizontal) y la línea de merch (camisetas, gorra, vaso).

## Pendientes

Hay un proyecto guardado sin publicar en `materiales/proyectos-ocultos/` (sus datos e imágenes). Para volver a mostrarlo: copia su entrada al final de `datos/proyectos.json`, devuelve sus imágenes a `img/proyectos/` y corre el generador.


| Pendiente | Qué pasa mientras |
|---|---|
| Testimonio de cliente | Quitado por ahora; se agrega en "Cómo trabajo" cuando lo tengas |
| Material de calidad de PhoneDoctors (reel de motion, web real) | Se usan las imágenes del Wix |
| Burguer Native, invitación XV | No aparecen hasta que confirmes y haya permiso |
| Parqués Altamar | Escondido con `"oculto": true` en `datos/proyectos.json` (23-oct-2026); quítalo para mostrarlo de nuevo |
| Portátiles & Consolas | Escondido en `materiales/proyectos-ocultos/` hasta que tu papá dé el visto bueno |
| Dominio propio | Cuando lo compres, pon la URL completa en `og:image`, en los `hreflang` y agrega `<link rel="canonical">` en las dos páginas |
| Publicación | Netlify con tu cuenta (te guío). Antes, quitar o resolver los marcadores |
| Wix viejo | Decidir si se redirige o se despublica cuando el nuevo esté en línea |

## De dónde salió cada dato

- Perfil, proyectos, créditos y contacto: `CONTEXTO-PORTAFOLIO.md` (21-oct-2026) y conversación con Thiago.
- Imágenes de proyectos: Media Manager del Wix actual, convertidas a WebP.
- Foto sentado: archivo entregado por Thiago el 21-oct-2026 ("yo sin fondo sentado.png").
- Paleta Evergreen / Almond Cream: referencia entregada por Thiago.
