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
| `img/` | Tu foto, isotipo, patrón, íconos e imagen para compartir |
| `img/proyectos/` | Las imágenes de cada proyecto en dos tamaños (1200 y 640 px) |
| `fonts/` | Archivo y Mr Dafoe, servidas desde el propio sitio |
| `vendor/` | GSAP 3.13.0 (con ScrollTrigger y SplitText) y Lenis 1.3.11 |
| `direccion-de-arte.html` | La hoja de muestra con que aprobamos el diseño (no se publica) |
| `materiales/` | Originales: fotos, recortes, el paquete de contexto (no se publica) |
| `revision/` | Capturas de revisión (no se publica) |

## Cómo agregar o cambiar un proyecto

1. Guarda sus imágenes en `img/proyectos/` con el nombre `<clave>-<número>-1200.webp` y `<clave>-<número>-640.webp` (WebP de calidad 75 a 80; squoosh.app sirve).
2. Abre `datos/proyectos.json` y copia un proyecto existente como modelo. Cambia nombre, tipo, año, disciplinas, textos, rol, equipo, herramientas e imágenes. Dentro de `"en"` va la versión en inglés: resumen, texto, rol, equipo y `alts` (una descripción por imagen, en el mismo orden). Si falta, la página en inglés usa el texto en español.
3. Para destacarlo en "Trabajo seleccionado", pon su `slug` en la lista `destacados`.
4. Desde la carpeta del proyecto corre:

```bash
python3 herramientas/generar-proyectos.py
```

Las disciplinas que existen para los filtros son: Branding, Editorial, Infografía, Ilustración, Motion y Web (en inglés salen como Branding, Editorial, Infographics, Illustration, Motion y Web). El comando actualiza las dos páginas.

## Cambios fáciles

- **Titular en inglés:** en `en/index.html`, «Brands you / can read» con la cursiva «from afar».
- **Titular:** en `index.html`, busca `Marcas` y `que se leen`; la cursiva está en `<p class="script"...>de lejos</p>` y en el texto oculto `<span class="oculto">de lejos</span>` (cámbialos juntos).
- **WhatsApp:** el número es 573005198202. Cada botón trae su propio mensaje en el enlace (`?text=`), para que sepas desde dónde te escriben.
- **Colores:** al inicio de `css/estilos.css`, en `:root`.
- **Textos fijos de la página en inglés** (secciones, botones, Sobre mí): están escritos directamente en `en/index.html`. Si cambias uno en español, cámbialo también ahí.
- **Después de cambiar CSS o JS**, sube el número `?v=` en `index.html` y en `en/index.html` (por ejemplo `?v=20261021c`) para que el hosting no muestre la versión vieja.

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
const M = { ease: 'power4.out', easeIO: 'power3.inOut', pop: 'back.out(1.4)', dur: 1.05, stagger: 0.075, dist: 48, lerp: 0.085 };
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

## Contacto en el sitio

- WhatsApp: +57 300 519 8202 (botones con mensaje según el lugar)
- Correo: santiagomezsolis@gmail.com
- LinkedIn: https://www.linkedin.com/in/santiago-solis-714525398/

## Por validar (lo decidí yo, confírmalo)

1. Titular "Marcas que se leen *de lejos*" (dijiste que no estabas seguro). Otras opciones: "Diseño con *carácter*", "Ideas que se quedan *con firma*".
2. Firma "Santiago Solís" en el menú y en el pie; "Thiago" en el afiche y en "Me dicen Thiago".
3. Tu foto sentado a color, recortada por ti; la sombra del piso la dibuja el sitio.
4. Casos destacados: PhoneDoctors, Portátiles & Consolas, Revista R.A.P. y Parqués Altamar.
5. Los textos de cada proyecto los escribí a partir de tu documento de contexto. Revisa en especial PhoneDoctors y Portátiles & Consolas.
6. En los proyectos de equipo te sumé al final de los créditos. Los nombres de compañeros salen de un resumen automático del Wix: compáralos con el original.
7. Las imágenes de PhoneDoctors están asignadas a cada pieza según el orden del Wix (rebranding, motion, web, carrusel, cuadros, merch); el mapeo era "probable".
8. Los cuatro pasos de "Cómo trabajo" los escribí yo.
9. En Lab, Halftone Lab lo describí como "convierte imágenes en semitono". Corrígelo si hace algo más.
10. El botón fijo en celular es violeta para que se vea sobre las secciones verdes.
11. Verde medio y Evergreen noche son variaciones de tu paleta, no colores nuevos.
12. La versión en inglés la traduje yo. El botón principal es «Contact me». El cierre es «Let's work *together*», más corto que la traducción literal para que la cursiva no tape el título.
13. Quité Macparts del archivo y de la frase de «Sobre mí» (21-oct-2026).
14. La imagen para compartir es la misma en los dos idiomas y dice «diseñador gráfico».

## Pendientes

| Pendiente | Qué pasa mientras |
|---|---|
| Testimonio de cliente | Quitado por ahora; se agrega en "Cómo trabajo" cuando lo tengas |
| Material de calidad de PhoneDoctors (reel de motion, web real) | Se usan las imágenes del Wix |
| Burguer Native, invitación XV, Proteux | No aparecen hasta que confirmes y haya permiso |
| Dominio propio | Cuando lo compres, pon la URL completa en `og:image`, en los `hreflang` y agrega `<link rel="canonical">` en las dos páginas |
| Publicación | Netlify con tu cuenta (te guío). Antes, quitar o resolver los marcadores |
| Wix viejo | Decidir si se redirige o se despublica cuando el nuevo esté en línea |

## De dónde salió cada dato

- Perfil, proyectos, créditos y contacto: `CONTEXTO-PORTAFOLIO.md` (21-oct-2026) y conversación con Thiago.
- Imágenes de proyectos: Media Manager del Wix actual, convertidas a WebP.
- Capturas de Portátiles & Consolas: paquete de contexto.
- Foto sentado: archivo entregado por Thiago el 21-oct-2026 ("yo sin fondo sentado.png").
- Paleta Evergreen / Almond Cream: referencia entregada por Thiago.
