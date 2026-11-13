import os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

font = TTFont('C:/Windows/Fonts/times.ttf')
glyph_set = font.getGlyphSet()
cmap = font.getBestCmap()
h_metrics = font['hmtx'].metrics

text = 'FREMKYS'
paths = []
current_x = 0

# Ascender for Times is ~1825, baseline at y=0, descender is ~-443. Cap height is ~1356.
# We want tight bounding box around the capital letters FREMKYS!
min_y = 0
max_y = 1356 # Cap height
padding = 40

# We transform: x_svg = current_x + x, y_svg = (max_y + padding) - y
for char in text:
    glyph_name = cmap[ord(char)]
    glyph = glyph_set[glyph_name]
    advance, lsb = h_metrics[glyph_name]
    
    pen = SVGPathPen(glyph_set)
    t_pen = TransformPen(pen, (1, 0, 0, -1, current_x, max_y + padding))
    glyph.draw(t_pen)
    paths.append(pen.getCommands())
    current_x += advance

total_width = current_x
view_height = max_y + 2 * padding
d_str = " ".join(paths)

# Black SVG with currentColor
svg_black = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_width} {view_height}" fill="currentColor" width="100%" height="100%">
  <path d="{d_str}" />
</svg>'''

with open('public/images/fremkys_logo.svg', 'w', encoding='utf-8') as f:
    f.write(svg_black)

# Also pure black fill SVG
svg_pure_black = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_width} {view_height}" fill="#000000" width="100%" height="100%">
  <path d="{d_str}" />
</svg>'''

with open('public/images/fremkys_logo_black.svg', 'w', encoding='utf-8') as f:
    f.write(svg_pure_black)

# And white fill SVG
svg_white = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_width} {view_height}" fill="#FFFFFF" width="100%" height="100%">
  <path d="{d_str}" />
</svg>'''

with open('public/images/fremkys_logo_white.svg', 'w', encoding='utf-8') as f:
    f.write(svg_white)

print(f"Generated SVGs successfully! total_width={total_width}, view_height={view_height}")
