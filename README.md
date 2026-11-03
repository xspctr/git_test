# Single-page band website for Framer

A self-contained React code component with three sections: **Video → Music → Merch**. Dark charcoal, oversized typography, and an editable acid-yellow accent provide a neutral starting point for your band’s identity.

## Add it to Framer

1. Create a blank page in your Framer project.
2. In **Assets → Code**, create a code file named `BandWebsite.tsx`.
3. Replace its contents with the repository’s `BandWebsite.tsx`.
4. Drag the component onto the page. Set its width to **Fill** and height to **Fit Content**. Keep the page height content-driven.
5. Use the component’s property controls to enter your band name, tagline, accent color, and music heading.
6. Preview at desktop, tablet, and mobile widths before publishing. This is a code component: its content is edited through property controls, not separate canvas text layers.

### Hero video

Upload an MP4 or WebM using **Hero video**, and choose a **Video poster**. Use a compressed 16:9 clip you own or have permission to publish. The video loops and attempts muted, inline autoplay in preview and on the published site. Native controls let visitors pause, play, and enable sound; autoplay with sound cannot be guaranteed by browsers.

Autoplay is disabled on the static Framer canvas and for visitors requesting reduced motion. The poster remains visible before playback; failed media displays a fallback message. If the clip includes meaningful dialogue or lyrics, use a captioned video and provide an accessible transcript alongside it before launch.

### Bandcamp player

On your Bandcamp album or track page, select **Share / Embed**, then configure a player. Copy **only the URL inside the iframe’s `src` attribute** into **Player URL**. It must begin with `https://bandcamp.com/EmbeddedPlayer/`—an album page URL or the entire iframe markup will not work.

The embed area is 470px tall. Choose the large, tracklist player **without artwork** to fit it; if you choose another embed layout, adjust the iframe height in the component to match Bandcamp’s generated embed. Playback remains user-initiated, independent of the muted hero video. Add your public artist/album page URL under **Bandcamp link** as a fallback for visitors whose browser blocks embeds. Bandcamp is a third-party service; review your privacy requirements before publishing.

### Merch shop

Under **Merch**, add up to 12 products with a name, display price (including currency), image/alt text, and HTTPS checkout URL. Link to Bandcamp merch, Shopify product pages, or another real storefront. Products without a valid checkout URL say **Coming soon**.

This is a storefront section, not a payment processor or cart. Checkout opens the provider in a new tab. Inventory, variants/sizes, shipping, taxes, payments, and returns must be configured with that provider. Display prices are manually maintained, not synchronized.

## Before publishing

- Replace the placeholder band name, product names, prices, and artwork.
- Add the actual band video, poster, Bandcamp embed, and checkout links.
- Check all navigation links, video playback/sound, player sizing, and purchases on your Framer preview and published site.
- Keep parent overflow visible so the sticky navigation can work; avoid Framer scroll/transform effects on the full-page component.
- Add page title, description, social image, favicon, and domain settings in Framer.
- Check keyboard navigation, accent contrast if changed, and mobile layouts.

## Local validation

Run `npm ci`, `npm run typecheck`, and `npm test`.

Framer’s npm package provides type definitions, not its hosted runtime. Tests mock its property-control/static-renderer exports and verify server-rendered output. These checks do not replace testing playback, responsive layout, and external checkout in Framer. No live Framer project has been created or published by this repository.

References: [Framer property controls](https://www.framer.com/developers/property-controls), [component auto-sizing](https://www.framer.com/developers/auto-sizing).
