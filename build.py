from pathlib import Path
import re
import json
from html import escape
from html.parser import HTMLParser

root = Path(__file__).resolve().parent
html = (root / 'src/approved-page.html').read_text(encoding='utf-8')
head = html.split('<body>')[0]
header = re.search(r'<header>.*?</header>', html, re.S).group()
footer = re.search(r'<footer.*?</footer>', html, re.S).group().replace('id="about"', 'id="footer"')
dialog = html[html.index('<dialog'):html.index('</body>')]
hero = html[html.index('<section class="hero"'):html.index('<section class="local"')]
hero = hero.replace('id="product"', '')
links = {'index.html': '#product', 'solutions.html': '#solutions', 'technology.html': '#technology', 'use-cases.html': '#use-cases', 'about.html': '#about', '#local': '#solutions', '#workflow': '#technology'}

def anchors(content):
    for old, new in links.items():
        content = content.replace(f'href="{old}"', f'href="{new}"')
    return content

sections = [f'<section id="product" class="product-page scroll-section" aria-labelledby="hero-title">{hero}</section>']
for name in ['solutions', 'technology', 'use-cases', 'about']:
    content = (root / f'src/pages/{name}.html').read_text(encoding='utf-8')
    content = content.replace('page-title', f'{name}-title')
    content = re.sub(r'<(/?)h2\b', r'<\1h3', content)
    content = content.replace('<h1 ', '<h2 class="section-heading" ').replace('</h1>', '</h2>')
    content = content.replace('<section ', f'<section id="{name}" ', 1)
    content = content.replace('class="', 'class="scroll-section ', 1)
    content = content.replace('<img ', '<img loading="lazy" decoding="async" ')
    sections.append(content)

sections.append((root / 'src/legal.html').read_text(encoding='utf-8'))
page = (head + '<body class="scrolling-site"><a class="skip" href="#main">Skip to content</a>'
        '<div class="site" id="top">' + header
        + '<main id="main" class="single-page">' + ''.join(sections) + '</main>'
        + footer + '</div>' + dialog + '</body></html>')
page = anchors(page)
page = re.sub(r'<button class="(cta(?: small)?)" data-pilot>(.*?)</button>', r'<a class="\1" href="mailto:info@wave22labs.com?subject=daberelive%20Studio%20Pilot">\2</a>', page, flags=re.S)
page = re.sub(r'<dialog\b.*?</dialog>', '', page, flags=re.S)
page = page.replace('</footer>', '<div class="contact-links"><a href="mailto:info@wave22labs.com">Contact us</a><a href="mailto:support@wave22labs.com">Technical support</a></div></footer>')
page = page.replace('</footer>', '<div class="contact-links legal-links"><a href="#accessibility">Accessibility statement</a><a href="#privacy">Privacy information</a></div></footer>')
page = page.replace('</body>', '<a class="back-to-top" href="#top"><span aria-hidden="true">↑</span> Back to Top</a></body>')
switch = '<a class="language-switch" href="he.html" lang="he" hreflang="he" aria-label="מעבר לעברית">עברית <span aria-hidden="true">/ EN</span></a>'
page = page.replace('<a class="cta small"', switch + '<a class="cta small"', 1)
page = page.replace('</head>', '<link rel="alternate" hreflang="en" href="https://dabrelive.com/"><link rel="alternate" hreflang="he" href="https://dabrelive.com/he.html"></head>')
(root / 'out/index.html').write_text(page, encoding='utf-8')

translations = json.loads((root / 'src/he.json').read_text(encoding='utf-8'))
class HebrewPage(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.tags = []
    def handle_decl(self, decl):
        self.parts.append('<!' + decl + '>')
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'html': attrs.update(lang='he', dir='rtl')
        if attrs.get('class') == 'language-switch':
            attrs.update(href='index.html', lang='en', hreflang='en', **{'aria-label':'Switch to English'})
        for key in ['aria-label', 'alt', 'title', 'content']:
            if key in attrs and attrs[key] in translations: attrs[key] = translations[attrs[key]]
        self.parts.append('<' + tag + ''.join(' ' + k + ('="' + escape(v, quote=True) + '"' if v is not None else '') for k,v in attrs.items()) + '>')
        if tag not in ['meta','link','img','br','input','hr','source']: self.tags.append(tag)
    def handle_endtag(self, tag):
        self.parts.append('</' + tag + '>')
        if self.tags and self.tags[-1] == tag: self.tags.pop()
    def handle_data(self, data):
        key = data.strip()
        translated = translations.get(key, key)
        # Isolate English terms and numeric ranges inside Hebrew sentences.
        value = escape(translated)
        if self.tags and self.tags[-1] not in ['title', 'script', 'style']:
            chunks = re.split(r'([A-Za-z0-9][A-Za-z0-9 /–.()%+—-]*[A-Za-z0-9%)]|[A-Za-z0-9])', translated)
            value = ''.join('<bdi dir="ltr" lang="en">' + escape(v) + '</bdi>' if i % 2 else escape(v) for i,v in enumerate(chunks))
        self.parts.append(data[:len(data)-len(data.lstrip())] + value + data[len(data.rstrip()):] if key else data)

he_source = page.replace(switch, '<a class="language-switch" href="index.html" lang="en" hreflang="en" aria-label="Switch to English">English <span aria-hidden="true">/ עברית</span></a>')
translator = HebrewPage()
translator.feed(he_source)
(root / 'out/he.html').write_text(''.join(translator.parts), encoding='utf-8')

# Keep previously shared URLs working at their corresponding sections.
for name in ['solutions', 'technology', 'use-cases', 'about']:
    target = f'index.html#{name}'
    redirect = (f'<!doctype html><html lang="en"><head><meta charset="utf-8">'
                f'<meta name="viewport" content="width=device-width,initial-scale=1">'
                f'<meta http-equiv="refresh" content="0;url={target}">'
                f'<title>Wave22 Labs — {name.replace("-", " ").title()}</title>'
                f'<link rel="canonical" href="{target}"></head><body>'
                f'<p><a href="{target}">Continue to the {name.replace("-", " ")} section.</a></p>'
                f'<script>location.replace("{target}");</script></body></html>')
    (root / f'out/{name}.html').write_text(redirect, encoding='utf-8')
print('Built one scrolling page and four legacy redirects')
