#!/usr/bin/env python3
"""Genera las tarjetas destacadas, los filtros y el índice de proyectos
en index.html (español) y en/index.html (inglés) a partir de
datos/proyectos.json. Uso (desde la carpeta del sitio):

    python3 herramientas/generar-proyectos.py

Reemplaza lo que hay entre los comentarios
<!-- PROYECTOS:DESTACADOS --> ... <!-- /PROYECTOS:DESTACADOS -->,
<!-- PROYECTOS:FILTROS --> ... <!-- /PROYECTOS:FILTROS --> y
<!-- PROYECTOS:LISTA --> ... <!-- /PROYECTOS:LISTA -->.
"""
import html
import json
import os
import re
import struct
import sys
from urllib.parse import quote

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WHATSAPP = "573005198202"
ORDEN_DISCIPLINAS = ["Branding", "Redes sociales", "Editorial", "Infografía", "Ilustración", "Motion", "Web"]

IDIOMAS = {
    "es": {
        "archivo": "index.html",
        "raiz": "",
        "disciplinas": {d: d for d in ORDEN_DISCIPLINAS},
        "tipos": {},
        "todo": "Todo",
        "ver_caso": "Ver caso",
        "rol": "Rol", "equipo": "Equipo", "herramientas": "Herramientas",
        "quiero": "Quiero algo así",
        "mensaje": "Hola Thiago, vi el proyecto {p} en tu portafolio y quiero hablar de algo parecido.",
        "galeria": "Imágenes de {p}",
        "sin_imagenes": "[IMÁGENES DE {P}]", "pronto": "Pronto aquí.",
    },
    "en": {
        "archivo": os.path.join("en", "index.html"),
        "raiz": "../",
        "disciplinas": {"Branding": "Branding", "Redes sociales": "Social media", "Editorial": "Editorial", "Infografía": "Infographics",
                        "Ilustración": "Illustration", "Motion": "Motion", "Web": "Web"},
        "tipos": {"Profesional": "Professional", "Freelance": "Freelance", "Académico": "Academic", "Personal": "Personal"},
        "todo": "All",
        "ver_caso": "View case",
        "rol": "Role", "equipo": "Team", "herramientas": "Tools",
        "quiero": "I want something like this",
        "mensaje": "Hi Thiago, I saw the {p} project in your portfolio and I'd like to talk about something similar.",
        "galeria": "Images of {p}",
        "sin_imagenes": "[{P} IMAGES]", "pronto": "Coming soon.",
    },
}


def medidas_webp(ruta):
    """Ancho y alto de un .webp leyendo su cabecera."""
    with open(ruta, "rb") as f:
        d = f.read(40)
    chunk = d[12:16]
    if chunk == b"VP8X":
        w = 1 + int.from_bytes(d[24:27], "little")
        h = 1 + int.from_bytes(d[27:30], "little")
    elif chunk == b"VP8 ":
        w, h = struct.unpack("<HH", d[26:30])
        w, h = w & 0x3FFF, h & 0x3FFF
    elif chunk == b"VP8L":
        b = int.from_bytes(d[21:25], "little")
        w, h = (b & 0x3FFF) + 1, ((b >> 14) & 0x3FFF) + 1
    else:
        raise ValueError("WebP no reconocido: " + ruta)
    return w, h


def esc(t):
    return html.escape(t, quote=True)


def wa(texto):
    return f"https://wa.me/{WHATSAPP}?text={quote(texto)}"


class Pagina:
    def __init__(self, lang):
        self.lang = lang
        self.t = IDIOMAS[lang]

    def campo(self, p, nombre):
        """Texto del proyecto en el idioma de la página (en inglés, si existe)."""
        if self.lang != "es" and nombre in p.get(self.lang, {}):
            return p[self.lang][nombre]
        return p[nombre]

    def alt(self, p, i):
        if self.lang != "es" and "alts" in p.get(self.lang, {}):
            return p[self.lang]["alts"][i]
        return p["imagenes"][i][1]

    def disciplinas(self, p):
        return [self.t["disciplinas"].get(d, d) for d in p["disciplinas"]]

    def tipo(self, p):
        return self.t["tipos"].get(p["tipo"], p["tipo"])

    def imagen(self, p, n, ancho_movil=None):
        base = f"img/proyectos/{p['clave']}-{n}"
        r = self.t["raiz"]
        if ancho_movil:  # capturas de celular: un solo tamaño
            src = f"{base}-{ancho_movil}.webp"
            w, h = medidas_webp(os.path.join(RAIZ, src))
            return r + src, r + src, w, h
        grande = f"{base}-1200.webp"
        w, h = medidas_webp(os.path.join(RAIZ, grande))
        return r + f"{base}-640.webp", r + grande, w, h

    def video(self, p, a, alt):
        """Video corto sin sonido que se repite: entradas ["v1", "texto", "video", ancho, alto]."""
        base = f'{self.t["raiz"]}img/proyectos/{p["clave"]}-{a[0]}'
        w, h = a[3], a[4]
        return (f'            <figure class="video"><video src="{base}.mp4" poster="{base}.jpg" width="{w}" height="{h}" '
                f'muted loop playsinline preload="none" controls data-auto aria-label="{esc(alt)}"></video>'
                f'<figcaption>{esc(alt)}</figcaption></figure>')

    @staticmethod
    def picture(src_m, src_g, w, h, alt):
        fuente = "" if src_m == src_g else f'<source media="(min-width:700px)" srcset="{src_g}">'
        return (f'<picture>{fuente}<img src="{src_m}" width="{w}" height="{h}" alt="{esc(alt)}" '
                f'loading="lazy" decoding="async"></picture>')

    def tarjeta(self, p, i):
        a = p["imagenes"][0]
        src_m, src_g, w, h = self.imagen(p, a[0], a[2] if len(a) > 2 else None)
        etiqueta = " · ".join(self.disciplinas(p)[:2]) + " · " + p["anio"]
        return f'''      <a class="caso" href="#p-{p["slug"]}" data-caso>
        <div class="caso__img" data-caso-img>{self.picture(src_m, src_g, w, h, self.alt(p, 0))}<span class="pildora caso__tag">{esc(etiqueta)}</span></div>
        <div class="caso__cuerpo">
          <span class="caso__n">{i:02d}</span>
          <h3>{esc(p["nombre"])}</h3>
          <span class="caso__meta">{esc(self.campo(p, "resumen"))}</span>
          <span class="caso__ver">{esc(self.t["ver_caso"])} <span class="caso__ir" aria-hidden="true"><i></i></span></span>
        </div>
      </a>'''

    def fila(self, p, i):
        t = self.t
        portada = ""
        if p["imagenes"]:
            a = p["imagenes"][0]
            portada = self.imagen(p, a[0], a[2] if len(a) > 2 else None)[0]
        figuras = []
        for k, a in enumerate(p["imagenes"]):
            if len(a) > 2 and a[2] == "video":
                figuras.append(self.video(p, a, self.alt(p, k)))
                continue
            src_m, src_g, w, h = self.imagen(p, a[0], a[2] if len(a) > 2 else None)
            clase = ' class="vertical"' if h > w * 1.15 else ""
            alt = self.alt(p, k)
            figuras.append(f'            <figure{clase}>{self.picture(src_m, src_g, w, h, alt)}<figcaption>{esc(alt)}</figcaption></figure>')
        if figuras:
            galeria = (f'          <div class="galeria" data-lenis-prevent tabindex="0" aria-label="{esc(t["galeria"].format(p=p["nombre"]))}">\n'
                       + "\n".join(figuras) + "\n          </div>")
        else:
            galeria = (f'          <p class="sin-imagenes"><span class="marcador">{esc(t["sin_imagenes"].format(P=p["nombre"].upper()))}</span>'
                       f'<br>{esc(t["pronto"])}</p>')
        texto = "\n".join(f"            <p>{esc(x)}</p>" for x in self.campo(p, "texto"))
        disc = self.disciplinas(p)
        return f'''      <details class="proy" id="p-{p["slug"]}" data-tags="{esc(" ".join(disc))}" data-cover="{portada}" data-fila>
        <summary>
          <span class="proy__n">{i:02d}</span>
          <span class="proy__nombre">{esc(p["nombre"])}</span>
          <span class="proy__meta"><span class="proy__tipo">{esc(self.tipo(p))}</span><span>{esc(p["anio"])}</span><span>{esc(", ".join(disc))}</span></span>
          <span class="proy__abrir" aria-hidden="true"></span>
        </summary>
        <div class="proy__cuerpo">
          <div class="proy__texto">
{texto}
            <dl class="ficha">
              <dt>{t["rol"]}</dt><dd>{esc(self.campo(p, "rol"))}</dd>
              <dt>{t["equipo"]}</dt><dd>{esc(self.campo(p, "equipo"))}</dd>
              <dt>{t["herramientas"]}</dt><dd>{esc(p["herramientas"])}</dd>
            </dl>
            <a class="btn btn--acento" href="{esc(wa(t["mensaje"].format(p=p["nombre"])))}" target="_blank" rel="noopener">{esc(t["quiero"])} <span class="btn__rombo"></span></a>
          </div>
{galeria}
        </div>
      </details>'''

    def filtros(self, proyectos):
        usadas = {d for p in proyectos for d in p["disciplinas"]}
        botones = [f'        <li><button type="button" class="filtro" data-filtro="todo" aria-pressed="true">{self.t["todo"]}</button></li>']
        for d in ORDEN_DISCIPLINAS:
            if d in usadas:
                n = self.t["disciplinas"][d]
                botones.append(f'        <li><button type="button" class="filtro" data-filtro="{esc(n)}" aria-pressed="false">{esc(n)}</button></li>')
        return "\n".join(botones)


def reemplazar(doc, marca, contenido, archivo):
    patron = re.compile(rf"(<!-- {marca} -->)(.*?)(\s*<!-- /{marca} -->)", re.S)
    if not patron.search(doc):
        sys.exit(f"No encontré la marca {marca} en {archivo}")
    return patron.sub(lambda m: m.group(1) + "\n" + contenido + m.group(3), doc)


def main():
    datos = json.load(open(os.path.join(RAIZ, "datos", "proyectos.json"), encoding="utf-8"))
    # Los proyectos con "oculto": true se guardan en los datos pero no se publican
    proyectos = [p for p in datos["proyectos"] if not p.get("oculto")]
    por_slug = {p["slug"]: p for p in proyectos}
    destacados = [por_slug[s] for s in datos["destacados"]]
    for lang in IDIOMAS:
        pag = Pagina(lang)
        ruta = os.path.join(RAIZ, IDIOMAS[lang]["archivo"])
        if not os.path.exists(ruta):
            print(f"(Salto {IDIOMAS[lang]['archivo']}: no existe)")
            continue
        doc = open(ruta, encoding="utf-8").read()
        doc = reemplazar(doc, "PROYECTOS:DESTACADOS", "\n".join(pag.tarjeta(p, i + 1) for i, p in enumerate(destacados)), ruta)
        doc = reemplazar(doc, "PROYECTOS:FILTROS", pag.filtros(proyectos), ruta)
        doc = reemplazar(doc, "PROYECTOS:LISTA", "\n".join(pag.fila(p, i + 1) for i, p in enumerate(proyectos)), ruta)
        open(ruta, "w", encoding="utf-8").write(doc)
        print(f"Listo {IDIOMAS[lang]['archivo']}: {len(destacados)} destacados y {len(proyectos)} proyectos.")


if __name__ == "__main__":
    main()
