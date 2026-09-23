# Homepage content and design audit — 2026-09-23

Scope: homepage, approved studio image, shared navigation and pilot entry point. Screenshot review plus rendered DOM and source inspection; not a full accessibility certification or product specification verification.

1. **Content — improved.** Before: dense ULL/LOW WER claims without measurements available in this project, repeated broadcast messaging. After: clear Hebrew captioning and local-processing description, one primary heading. Evidence: home-before.jpg and home-after.jpg. Performance claims on other pages still need substantiation.
2. **Composition — improved.** Approved full-width image replaces isolated device photo. Copy occupies empty left side; engraving and chassis remain uncovered. Original header/footer logo retained. Evidence: home-after.jpg.
3. **Mobile — checked.** Copy stacks above uncropped image, navigation remains visible. At 390px iframe width (375px content viewport), scrollWidth equals clientWidth; no horizontal overflow. Evidence: home-mobile.jpg. Product necessarily appears smaller on narrow screens.
4. **Actions — partial.** Primary link now points to Solutions. Navigation says Use Cases to match its page. Pilot opens an honest availability dialog; actual booking still needs a real contact destination. No lead capture has been implemented.
5. **Motion and semantics — reviewed.** Sign text/glow pulses every 2.8s; frame remains stationary. Reduced-motion CSS disables animation. Single h1, image alternatives, isolated RTL brand, existing focus styles and skip link retained. Contrast and assistive-technology behavior were not comprehensively tested.

Remaining beyond this homepage pass: validate performance/security claims and hardware connection specifications on detail pages; produce approved matching rear-panel image; connect pilot enquiries.
