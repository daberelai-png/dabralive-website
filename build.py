from pathlib import Path
import re

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

page = (head + '<body class="scrolling-site"><a class="skip" href="#main">Skip to content</a>'
        '<div class="site" id="top">' + header
        + '<main id="main" class="single-page">' + ''.join(sections) + '</main>'
        + footer + '</div>' + dialog + '</body></html>')
(root / 'out/index.html').write_text(anchors(page), encoding='utf-8')

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
