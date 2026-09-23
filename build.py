from pathlib import Path
import re
root=Path(__file__).resolve().parent
html=(root/'src/approved-page.html').read_text()
head=html.split('<body>')[0]
header=re.search(r'<header>.*?</header>',html,re.S).group()
footer=re.search(r'<footer.*?</footer>',html,re.S).group()
dialog=html[html.index('<dialog'):html.index('</body>')]
hero=html[html.index('<section class="hero"'):html.index('<section class="local"')]
local=html[html.index('<section class="local"'):html.index('<div class="technical"')]
technical=html[html.index('<div class="technical"'):html.index('<section class="use-cases"')]
cases=html[html.index('<section class="use-cases"'):html.index('</main>')]
links={'#top':'index.html','#product':'index.html','#local':'solutions.html','#workflow':'technology.html','#use-cases':'use-cases.html','#about':'about.html'}
def nav(s,active):
 for a,b in links.items():s=s.replace('href="'+a+'"','href="'+b+'"')
 s=s.replace('href="'+active+'">','href="'+active+'" aria-current="page">')
 return s
local=(root/'src/pages/solutions.html').read_text()
technical=(root/'src/pages/technology.html').read_text()
cases=(root/'src/pages/use-cases.html').read_text()
about=(root/'src/pages/about.html').read_text()
controls='''<div class="slideshow-controls" aria-label="Page slideshow" hidden><button type="button" data-slide="previous" aria-label="Previous page">←</button><span class="slide-position" aria-live="off">1 / 5</span><button type="button" data-slide="next" aria-label="Next page">→</button><button type="button" class="play-toggle" aria-pressed="false">Pause slideshow</button></div>'''
pages=[('index.html','Product',hero,'product-page'),('solutions.html','Solutions',local,'solutions-page'),('technology.html','Technology',technical,'technology-page'),('use-cases.html','Use Cases',cases,'use-cases-page'),('about.html','About',about,'about-page-wrapper')]
for filename,title,content,cls in pages:
 content=nav(content,filename)
 out=head.replace('<title>Wave22 Labs — דבראLIVE</title>',f'<title>{title} — Wave22 Labs | דבראLIVE</title>')+'<body><a class="skip" href="#main">Skip to content</a><div class="site" id="top">'+nav(header,filename)+f'<main id="main" class="{cls}">'+content+'</main>'+controls+nav(footer,filename)+'</div>'+dialog+'</body></html>'
 (root/'out'/filename).write_text(out)
print('Built 5 pages')
