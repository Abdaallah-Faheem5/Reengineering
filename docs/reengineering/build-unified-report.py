"""Build the edited, integrated report; do not concatenate historical PDFs."""
from pathlib import Path
import importlib.util
import re
import sys
import unicodedata
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader, PdfWriter

sys.dont_write_bytecode = True
BASE = Path(__file__).resolve().parent
STEM = 'Software_Reengineering_Stages_1-4'

def load_module(name, filename):
    spec = importlib.util.spec_from_file_location(name, BASE / filename)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

legacy = load_module('unified_legacy_style', 'build_report.py')
stage4 = load_module('unified_feature_style', '04-build-report.py')
style = stage4.base
style.NAME = STEM

# Unicode contextual forms support these unvocalized Arabic student names
# without adding an external shaping dependency. The Markdown stays logical text.
arabic_forms = {}
for cp in range(0xFB50, 0xFF00):
    parts = unicodedata.decomposition(chr(cp)).split()
    if len(parts) == 2 and parts[0] in ('<isolated>', '<initial>', '<medial>', '<final>'):
        arabic_forms.setdefault(chr(int(parts[1], 16)), {})[parts[0][1:-1]] = chr(cp)

def shape_arabic_name(value):
    result = []
    for i, char in enumerate(value):
        forms = arabic_forms.get(char, {})
        previous = arabic_forms.get(value[i-1], {}) if i else {}
        following = arabic_forms.get(value[i+1], {}) if i+1 < len(value) else {}
        joined_before = 'initial' in previous and 'final' in forms
        joined_after = 'initial' in forms and 'final' in following
        form = 'medial' if joined_before and joined_after else 'final' if joined_before else 'initial' if joined_after else 'isolated'
        result.append(forms.get(form, char))
    return ''.join(reversed(result))

pdfmetrics.registerFont(TTFont('StudentNames', 'C:/Windows/Fonts/tahoma.ttf'))
pdfmetrics.registerFont(TTFont('StudentNamesBold', 'C:/Windows/Fonts/tahomabd.ttf'))
pdfmetrics.registerFontFamily('StudentNames', normal='StudentNames', bold='StudentNamesBold', italic='StudentNames', boldItalic='StudentNamesBold')
names_style = ParagraphStyle('names', fontName='StudentNames', fontSize=12, leading=19,
                             alignment=TA_RIGHT, textColor=HexColor('#18334A'), spaceAfter=12)
original_paragraph = style.Paragraph
def paragraph(text, paragraph_style, *args, **kwargs):
    if re.search(r'[\u0600-\u06ff]', text):
        text = re.sub(r'[\u0600-\u06ff]+(?: [\u0600-\u06ff]+)*', lambda m: shape_arabic_name(m.group()), text)
        paragraph_style = names_style
    return original_paragraph(text, paragraph_style, *args, **kwargs)
style.Paragraph = paragraph

class UnifiedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.states = []
    def showPage(self):
        self.states.append(dict(self.__dict__))
        self._startPage()
    def save(self):
        total = len(self.states)
        for state in self.states:
            self.__dict__.update(state)
            self.setStrokeColor(HexColor('#D4E0E7'))
            self.line(52, 43, 543, 43)
            self.setFillColor(HexColor('#51616F'))
            self.setFont('Body', 8)
            self.drawString(52, 29, 'SOFTWARE REENGINEERING | STAGES 1-4')
            self.drawRightString(543, 29, f'{self._pageNumber} / {total}')
            self.setFont('Body', 7.6)
            self.drawRightString(543, 810, 'Software Reengineering Report')
            super().showPage()
        super().save()

figures = iter([legacy.architecture, stage4.diagram])
style.architecture = lambda: next(figures)()
style.NumberedCanvas = UnifiedCanvas

# Bypass the historical title overrides while retaining their common layout.
original_document = legacy.SimpleDocTemplate
def document(*args, **kwargs):
    kwargs.update(title='Software Reengineering: Stages 1-4',
                  subject='Consolidated evidence-based report on four reengineering stages',
                  author='عبدالله فهيم عمله؛ منة الله حسام خلف')
    return original_document(*args, **kwargs)
style.SimpleDocTemplate = document

def main():
    style.export()
    target = BASE / (STEM + '.pdf')
    reader = PdfReader(target)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    titles = [
        '1. Source Code Translation',
        '2. Reverse Engineering',
        '3. Program Structure Improvement',
        '4. Program Modularization',
        'Tools Used by Stage',
        'Verification and Evaluation',
        'Appendix A. Unified Evidence Register',
    ]
    writer.add_outline_item('Title, abstract and scope', 0)
    pages = {}
    for title in titles:
        matches = [i for i,p in enumerate(reader.pages) if title in p.extract_text().splitlines()]
        assert len(matches) == 1, (title, matches)
        pages[title] = matches[0] + 1
        writer.add_outline_item(title, matches[0])
    with target.open('wb') as stream:
        writer.write(stream)
    final = PdfReader(target)
    assert all(f'{i+1} / {len(final.pages)}' in p.extract_text() for i,p in enumerate(final.pages))
    text = (BASE / (STEM + '.md')).read_text(encoding='utf-8')
    assert len(re.findall(r'^# ', text, flags=re.M)) == 1
    assert len(re.findall(r'^## Appendix', text, flags=re.M)) == 1
    assert len(re.findall(r'^## Tools Used by Stage$', text, flags=re.M)) == 1
    print(f'Unified report: {len(final.pages)} pages, {len(text.split())} words; one title, tools table and appendix.')
    print('Section pages:', pages)

if __name__ == '__main__':
    main()
