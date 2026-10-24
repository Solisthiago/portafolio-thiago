#!/usr/bin/env python3
"""Arma el portafolio en PDF (A4 horizontal) a partir de datos/proyectos.json.

Uso:  python3 herramientas/generar-pdf.py
Sale: materiales/pdf/portafolio-santiago-solis.html y .pdf (privado, no se publica)
"""
import html, json, subprocess
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
IMG = RAIZ / 'img'
SALIDA = RAIZ / 'materiales' / 'pdf'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

# Página A4 horizontal en px CSS (96 ppp) y caja de contenido
PW, PH = 1123, 794
MX, MY = 56, 52
GAP = 12

# Medidas de las imágenes (ancho / alto), para armar filas justificadas
def proporcion(ruta):
    out = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(ruta)], capture_output=True, text=True).stdout
    w = int(out.split('pixelWidth:')[1].split()[0]); h = int(out.split('pixelHeight:')[1].split()[0])
    return w / h

def jpg(ruta):
    """Chrome mete los WebP en el PDF sin comprimir; en JPEG los deja tal cual y el PDF pesa mucho menos."""
    destino = SALIDA / 'cache' / (ruta.stem + '.jpg')
    if not destino.exists() or destino.stat().st_mtime < ruta.stat().st_mtime:
        destino.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '62', str(ruta), '--out', str(destino)], check=True, capture_output=True)
    return destino

def src(clave, n):
    return jpg(IMG / 'proyectos' / (f'{clave}-{n}.webp' if str(n).startswith('v') else f'{clave}-{n}-1200.webp'))

def filas(clave, grupos, ancho, alto):
    """Filas justificadas: cada fila llena el ancho; si no caben en el alto, se reduce todo parejo."""
    medidas = [[(src(clave, n), proporcion(src(clave, n))) for n in g] for g in grupos]
    altos = [(ancho - GAP * (len(f) - 1)) / sum(a for _, a in f) for f in medidas]
    total = sum(altos) + GAP * (len(altos) - 1)
    k = min(1, alto / total)
    out = []
    for f, h in zip(medidas, altos):
        h *= k
        imgs = ''.join(f'<img src="{r.as_uri()}" style="width:{h * a:.1f}px;height:{h:.1f}px">' for r, a in f)
        out.append(f'<div class="fila">{imgs}</div>')
    return f'<div class="galeria" style="height:{alto}px">{"".join(out)}</div>'

# Qué imágenes van en cada página de cada proyecto: [portada, galería 1, galería 2…]
PLAN = {
    'phonedoctors': [[['11']], [['1', '2'], ['12', '3', '14']], [['4', '5', '7'], ['6', '15'], ['13', '16']]],
    'phonedoctors-redes': [[['1', '3']], [['2', '4', '5', '6', '8', '9'], ['10', '11', '7', '12', '13', '14']]],
    'proteux': [[['5']], [['1'], ['2', '3', '4']]],
    'macparts': [[['1', '2']], [['3', '4', '5'], ['6', '7', '8']]],
    'revista-rap': [[['v1']], [['1', '2'], ['3', '4']]],
    'revista-arquey': [[['m1']], [['m2', 'm3'], ['m4', 'm5']], [['m6', 'm7'], ['m8', 'm9']]],
    'afiches-serigrafia': [[['1', '2', '3']]],
    'mapa-cervus': [[['1', '2']]],
    'infografia-n64': [[['1'], ['2']]],
    'infografia-acer': [[['1']]],
    'dinova': [[['1'], ['2', '3']]],
    'emuna': [[['1'], ['2', '3']]],
}

e = html.escape
pagina_n = 0

def pagina(cuerpo, clase='', pie=True):
    global pagina_n
    pagina_n += 1
    p = f'<footer class="pie"><span>Santiago Solís · Portafolio 2026</span><span>{pagina_n:02d}</span></footer>' if pie else ''
    return f'<section class="pagina {clase}">{cuerpo}{p}</section>'

def portada():
    return pagina(f'''
      <img class="portada__iso" src="{(IMG / 'isotipo.webp').as_uri()}" alt="">
      <div class="portada__arriba"><span>Portafolio 2026</span><span>Diseñador gráfico · Medellín, Colombia</span></div>
      <h1 class="portada__nombre"><span class="espaciado">THIAGO</span><b>SOLÍS</b></h1>
      <p class="portada__lema">Marcas que se leen <em>de lejos</em></p>
      <p class="portada__pie">Identidad · Editorial · Motion · Web</p>''', 'portada', pie=False)

def sobre_mi():
    herr = 'Illustrator · Photoshop · InDesign · Lightroom · Procreate · After Effects · Premiere Pro · Final Cut Pro · DaVinci Resolve · WordPress · HTML y CSS · Herramientas de IA'
    return pagina(f'''
      <img class="sobre__foto" src="{jpg(IMG / 'thiago-1100.webp').as_uri()}" alt="">
      <div class="sobre__texto">
        <p class="etiqueta">Sobre mí</p>
        <h2 class="titulo">Me dicen <span class="firma">Thiago</span></h2>
        <p class="grande">Soy diseñador gráfico de Medellín. Me mueven la tipografía y la música, y me gusta llevar una idea completa: de la marca al motion y a la web.</p>
        <p>Hoy soy el diseñador gráfico y creativo de PhoneDoctors, donde lideré el rebranding de sus 10 años, y trabajo como freelance con marcas que quieren verse con carácter.</p>
        <dl class="datos">
          <dt>Formación</dt><dd>Diseño Gráfico, Universidad Pontificia Bolivariana (2022–2026)<br>Técnica en Diseño e Integración de Multimedia, SENA (2019–2021)</dd>
          <dt>Idiomas</dt><dd>Español nativo · Inglés B1</dd>
          <dt>Servicios</dt><dd>Identidad de marca · Editorial e infografía · Motion graphics · Redes sociales · Web</dd>
          <dt>Herramientas</dt><dd>{herr}</dd>
        </dl>
      </div>''', 'sobre')

def indice(proyectos, paginas):
    items = ''.join(
        f'<li><span class="n">{i:02d}</span><span class="nom">{e(p["nombre"])}</span>'
        f'<span class="dis">{e(" · ".join(p["disciplinas"]))}</span><span class="pag">{paginas[p["slug"]]:02d}</span></li>'
        for i, p in enumerate(proyectos, 1))
    return pagina(f'<p class="etiqueta">Contenido</p><h2 class="titulo">Proyectos</h2><ol class="indice">{items}</ol>', 'indice-pag')

def proyecto(i, p):
    plan = PLAN[p['slug']]
    textos = ''.join(f'<p>{e(t)}</p>' for t in p['texto'])
    ficha = f'''
      <div class="ficha">
        <p class="etiqueta">{i:02d} · {e(p["tipo"])} · {e(p["anio"])}</p>
        <h2 class="titulo">{e(p["nombre"])}</h2>
        <p class="resumen">{e(p["resumen"])}</p>
        {textos}
        <dl class="datos">
          <dt>Rol</dt><dd>{e(p["rol"])}</dd>
          <dt>Herramientas</dt><dd>{e(p["herramientas"])}</dd>
          <dt>Equipo</dt><dd>{e(p["equipo"])}</dd>
        </dl>
      </div>'''
    ancho_galeria = PW - 2 * MX - 330 - 40
    out = [pagina(ficha + filas(p['clave'], plan[0], ancho_galeria, PH - 2 * MY - 40), 'proyecto')]
    for grupo in plan[1:]:
        cab = f'<p class="etiqueta cab">{i:02d} · {e(p["nombre"])}</p>'
        out.append(pagina(cab + filas(p['clave'], grupo, PW - 2 * MX, PH - 2 * MY - 80), 'galeria-pag'))
    return out

def contacto():
    return pagina(f'''
      <p class="etiqueta">Contacto</p>
      <h2 class="contacto__titulo">¿Hacemos algo <span class="firma">juntos?</span></h2>
      <ul class="vias">
        <li><b>Web</b>solisthiago.github.io/portafolio-thiago</li>
        <li><b>Correo</b>santiagomezsolis@gmail.com</li>
        <li><b>WhatsApp</b>+57 300 519 8202</li>
        <li><b>LinkedIn</b>linkedin.com/in/santiago-solis-714525398</li>
      </ul>
      <img class="contacto__iso" src="{(IMG / 'isotipo.webp').as_uri()}" alt="">''', 'contacto', pie=False)

def main():
    datos = json.loads((RAIZ / 'datos' / 'proyectos.json').read_text())
    proyectos = [p for p in datos['proyectos'] if not p.get('oculto')]
    # Números de página: portada 1, sobre mí 2, índice 3, y luego los proyectos en orden
    paginas, n = {}, 4
    for p in proyectos:
        paginas[p['slug']] = n
        n += len(PLAN[p['slug']])
    cuerpo = [portada(), sobre_mi(), indice(proyectos, paginas)]
    for i, p in enumerate(proyectos, 1):
        cuerpo += proyecto(i, p)
    cuerpo.append(contacto())

    css = (RAIZ / 'herramientas' / 'pdf.css').read_text().replace('{{FUENTES}}', (RAIZ / 'fonts').as_uri())
    doc = f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Santiago Solís · Portafolio 2026</title><style>{css}</style></head><body>{"".join(cuerpo)}</body></html>'
    SALIDA.mkdir(parents=True, exist_ok=True)
    h = SALIDA / 'portafolio-santiago-solis.html'
    h.write_text(doc)
    pdf = SALIDA / 'portafolio-santiago-solis.pdf'
    subprocess.run([CHROME, '--headless', '--disable-gpu', '--allow-file-access-from-files', '--no-pdf-header-footer',
                    '--virtual-time-budget=8000', f'--print-to-pdf={pdf}', h.as_uri()], check=True, capture_output=True)
    print(pdf, f'{pdf.stat().st_size / 1e6:.1f} MB', f'{pagina_n} páginas')

if __name__ == '__main__':
    main()
