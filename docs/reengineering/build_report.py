"""Export the editable report with ReportLab; all outputs stay beside this script."""
from pathlib import Path
import html
import math
import re
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Preformatted, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing, Rect, Line, Polygon, String
from reportlab.graphics import renderSVG

BASE = Path(__file__).resolve().parent
NAME = 'Software_Reengineering_Stages_1-3'
for name, filename in [('Body','calibri.ttf'), ('Bold','calibrib.ttf'), ('Italic','calibrii.ttf'), ('Mono','consola.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(Path('C:/Windows/Fonts') / filename)))
pdfmetrics.registerFontFamily('Body', normal='Body', bold='Bold', italic='Italic', boldItalic='Bold')
NAVY, TEAL, GREY = map(HexColor, ['#18334A', '#137D8C', '#51616F'])
WIDTH = 491.28
styles = {
    'p': ParagraphStyle('p', fontName='Body', fontSize=10, leading=12.8, textColor=NAVY, spaceAfter=6),
    'h1': ParagraphStyle('h1', fontName='Bold', fontSize=30, leading=34, textColor=NAVY, spaceAfter=20),
    'h2': ParagraphStyle('h2', fontName='Bold', fontSize=19, leading=23, textColor=NAVY, spaceBefore=4, spaceAfter=12, keepWithNext=True),
    'h3': ParagraphStyle('h3', fontName='Bold', fontSize=12, leading=15, textColor=TEAL, spaceBefore=9, spaceAfter=6, keepWithNext=True),
    'cell': ParagraphStyle('cell', fontName='Body', fontSize=8.7, leading=10.7, textColor=NAVY),
    'head': ParagraphStyle('head', fontName='Bold', fontSize=8.7, leading=10.7, textColor=white),
    'code': ParagraphStyle('code', fontName='Mono', fontSize=8.1, leading=10.8, textColor=NAVY, backColor=HexColor('#F1F5F8'), borderPadding=9, spaceBefore=5, spaceAfter=12),
}

def inline(text):
    # Protect code spans from subsequent Markdown substitutions.
    spans = []
    def code(match):
        spans.append('<font name="Mono" size="8.4">' + html.escape(match.group(1)) + '</font>')
        return f'ZZCODE{len(spans)-1}ZZ'
    text = re.sub(r'`([^`]+)`', code, text)
    text = html.escape(text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    for i, span in enumerate(spans):
        text = text.replace(f'ZZCODE{i}ZZ', span)
    return text

def architecture():
    d = Drawing(WIDTH, 204)
    boxes = {
        'server': (4,155,95,32,'server.ts'),
        'app': (146,155,95,32,'src/app.ts'),
        'config': (4,88,95,36,'db.config.ts'),
        'routes': (146,88,95,36,'routes'),
        'controllers': (278,88,95,36,'controllers'),
        'services': (399,88,88,36,'services'),
        'models': (399,12,88,36,'models'),
        'checks': (146,12,170,36,'middleware / validation'),
        'db': (4,12,95,36,'MongoDB'),
    }
    def edge(points, dashed=False):
        for p,q in zip(points,points[1:]):
            line = Line(*p,*q,strokeColor=TEAL if dashed else GREY,strokeWidth=1.4)
            if dashed: line.strokeDashArray=[4,3]
            d.add(line)
        p,q=points[-2:]
        angle=math.atan2(q[1]-p[1],q[0]-p[0]); a=5
        vertices=[*q,q[0]-a*math.cos(angle-.5),q[1]-a*math.sin(angle-.5),q[0]-a*math.cos(angle+.5),q[1]-a*math.sin(angle+.5)]
        d.add(Polygon(vertices,fillColor=TEAL if dashed else GREY,strokeColor=None))
    edge([(99,171),(146,171)],True)
    edge([(51,155),(51,124)],True)
    edge([(51,88),(51,48)],True)
    edge([(194,155),(194,124)],True)
    edge([(241,106),(278,106)],True)
    edge([(373,106),(399,106)],True)
    edge([(443,88),(443,48)],True)
    edge([(399,30),(336,30),(336,2),(112,2),(112,30),(99,30)],True)
    edge([(194,88),(194,48)],False)
    for x,y,w,h,label in boxes.values():
        d.add(Rect(x,y,w,h,rx=5,ry=5,fillColor=HexColor('#F0F6F8'),strokeColor=HexColor('#B3C8D2'),strokeWidth=.7))
        d.add(String(x+w/2,y+h/2-3,label,fontName='Bold',fontSize=9.4,textAnchor='middle',fillColor=NAVY))
    d.add(String(8,195,'RECOVERED DEPENDENCIES',fontName='Bold',fontSize=8,fillColor=TEAL))
    renderSVG.drawToFile(d,str(BASE/'architecture-verified.svg'))
    d.scale(.82,.82)
    d.width=WIDTH*.82
    d.height=204*.82
    return d

class NumberedCanvas(canvas.Canvas):
    def __init__(self,*args,**kwargs):
        super().__init__(*args,**kwargs); self.saved=[]
    def showPage(self):
        self.saved.append(dict(self.__dict__)); self._startPage()
    def save(self):
        count=len(self.saved)
        for state in self.saved:
            self.__dict__.update(state)
            self.setStrokeColor(HexColor('#D4E0E7')); self.line(52,43,543,43)
            self.setFillColor(GREY); self.setFont('Body',8)
            self.drawString(52,29,'SOFTWARE REENGINEERING | STAGES 1-3')
            self.drawRightString(543,29,f'{self._pageNumber} / {count}')
            self.setFont('Body',7.6)
            self.drawRightString(543,810,'Backend repository study | 10 November 2026')
            super().showPage()
        super().save()

def export():
    lines=(BASE/f'{NAME}.md').read_text(encoding='utf-8').splitlines()
    story=[]; i=0
    while i<len(lines):
        line=lines[i].strip()
        if not line: i+=1; continue
        if line=='<!-- pagebreak -->': story.append(PageBreak()); i+=1; continue
        if line.startswith('!['): story.append(architecture()); story.append(Spacer(1,6)); i+=1; continue
        if line.startswith('```'):
            code=[]; i+=1
            while not lines[i].startswith('```'): code.append(lines[i]); i+=1
            # Preserve lines as written; the source examples fit the page width.
            story.append(Preformatted('\n'.join(code),styles['code'])); i+=1; continue
        if line.startswith('|'):
            rows=[]
            while i<len(lines) and lines[i].strip().startswith('|'):
                row=[c.strip() for c in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r'[-: ]+',c) for c in row): rows.append(row)
                i+=1
            n=len(rows[0]); header=rows[0]
            if header[0]=='ID': widths=[30,WIDTH-30]
            elif header[0]=='Method': widths=[45,202,WIDTH-247]
            elif n==4: widths=[205,72,72,WIDTH-349]
            elif n==3: widths=[191,111,WIDTH-302]
            else: widths=[151,WIDTH-151]
            data=[[Paragraph(inline(c),styles['head' if ri==0 else 'cell']) for c in row] for ri,row in enumerate(rows)]
            table=Table(data,colWidths=widths,repeatRows=1,hAlign='LEFT')
            table.setStyle(TableStyle([
                ('BACKGROUND',(0,0),(-1,0),NAVY),('ROWBACKGROUNDS',(0,1),(-1,-1),[HexColor('#F0F5F8'),white]),
                ('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),
                ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),
                ('LINEBELOW',(0,0),(-1,0),.5,NAVY),('LINEBELOW',(0,1),(-1,-1),.25,HexColor('#D8E3EA')),
            ])); story.append(table); story.append(Spacer(1,9)); continue
        match=re.match(r'^(#{1,3}) (.+)',line)
        if match:
            story.append(Paragraph(inline(match[2]),styles[f'h{len(match[1])}'])); i+=1; continue
        bullet=re.match(r'^(?:- |(\d+)\. )(.+)',line)
        if bullet:
            label=(bullet[1]+'.') if bullet[1] else '-'
            style=ParagraphStyle('item',parent=styles['p'],leftIndent=17,firstLineIndent=0,bulletIndent=0)
            story.append(Paragraph(inline(bullet[2]),style,bulletText=label)); i+=1; continue
        para=[line + ('ZZBREAKZZ' if lines[i].endswith('  ') else '')]; i+=1
        while i<len(lines) and lines[i].strip() and not re.match(r'^(#|\||```|<!--|!\[|- |\d+\. )',lines[i].strip()):
            para.append(lines[i].strip() + ('ZZBREAKZZ' if lines[i].endswith('  ') else '')); i+=1
        story.append(Paragraph(inline(' '.join(para)).replace('ZZBREAKZZ','<br/>'),styles['p']))
    doc=SimpleDocTemplate(str(BASE/f'{NAME}.pdf'),pagesize=(595.28,841.89),rightMargin=52,leftMargin=52,topMargin=52,bottomMargin=57,
        title='Software Reengineering: Stages 1-3',author='Repository evidence study',subject='Source Code Translation, Reverse Engineering, and Program Structure Improvement')
    doc.build(story,canvasmaker=NumberedCanvas)
    print(f'Exported {BASE / (NAME + ".pdf")}')

if __name__=='__main__': export()
