# Wave22 Labs / DabraLIVE website

Responsive static website preserving the approved dark studio identity.

## Pages

- Product: `out/index.html`
- Appliance and rear connections: `out/solutions.html`
- Technical studio brief: `out/technology.html`
- Use-case mosaic: `out/use-cases.html`
- Company: `out/about.html`

## Development

Run `python3 build.py` to generate pages from `src/approved-page.html` and `src/pages/`. Shared CSS and JavaScript live in `out/styles.css` and `out/site.js`. Run `npm run dev` for the local server. No package installation is needed. Deploy `out/` on a static host.

Desktop pages fit a typical laptop viewport. Mobile uses readable stacked layouts. Navigation supports page links, slideshow controls and desktop hover. Manual interactions pause the slideshow; mobile and reduced-motion preferences disable autoplay. Technology tabs support keyboard navigation. Rear-panel connection buttons support pointer, touch and keyboard use.

## Imagery and technical scope

The official supplied WAVE22labs JPEG remains the header/footer wordmark. Hero and use-case images include generated artwork approved through the design process. The rear image is a hardware concept with motherboard I/O, dual Ethernet, a separate GPU bracket and power/cooling. It is not a validated chassis or final bill of materials. Display outputs do not imply video input or SDI support.

Technology copy describes the Hebrew audio-to-caption workflow and separates studio validation from supported product claims. No numeric performance guarantees are published. Current engine source was not accessible during this content review; integration and hardware require project-owner validation. See `docs/design/rear-hardware-layout.md` and `docs/audits/solution-motion/index.html`.

The Studio Pilot button opens an availability notice; it does not collect or transmit leads. The ON AIR effect dims the photographic sign gently; reduced motion leaves it steady.

GitHub repository: https://github.com/daberelai-png/dabralive-website

Imported from the latest published Sites source, commit `2c159b9359e7ce65e8d7d297e06a2dacb1427ded` (version 11).
