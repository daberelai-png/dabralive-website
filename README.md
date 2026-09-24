# Wave22 Labs / DabraLIVE website

A responsive, single-page website preserving the approved dark studio identity.

## Sections

`out/index.html` contains Product, Solutions, Technology, Use Cases and About in one continuous scroll. The sticky navigation links to section anchors and highlights the section currently in view. The larger company wordmark is retained.

Previously shared `solutions.html`, `technology.html`, `use-cases.html` and `about.html` URLs redirect to the corresponding anchor. Automatic slideshows, hover navigation and swipe-to-change-page navigation have been removed.

## Development

Run `python3 build.py` to generate the scrolling page and legacy redirects from `src/approved-page.html` and `src/pages/`. Shared CSS and JavaScript live in `out/styles.css` and `out/site.js`. Run `npm run dev` for the local server. No package installation is needed. Deploy `out/` on a static host.

Technology tabs retain keyboard navigation. Rear-panel connection buttons support pointer, touch and keyboard use. Section links use native anchors and browser history. Reduced-motion preferences disable smooth scrolling and decorative animations. Below-the-fold artwork loads lazily.

## Imagery and technical scope

The supplied WAVE22labs JPEG remains the header/footer wordmark. Hero and use-case images include artwork approved through the design process. The rear image is a hardware concept, not a validated chassis or final bill of materials. Display outputs do not imply video input or SDI support.

Technology copy describes the Hebrew audio-to-caption workflow and separates studio validation from supported product claims. Published latency and WER ranges are owner-supplied; independent benchmark evidence remains to be documented. Integration and hardware require project-owner validation. See `docs/design/rear-hardware-layout.md` and `docs/audits/solution-motion/index.html` for previous design reviews.

Studio Pilot and contact links open mailto:info@wave22labs.com; support opens mailto:support@wave22labs.com. Decorative autoplay animations are disabled. The site includes a Hebrew RTL version at he.html with an English/Hebrew language switch. Accessibility statement and privacy policy remain pending verified company details and professional review; no full compliance claim is made.

GitHub repository: https://github.com/daberelai-png/dabralive-website
