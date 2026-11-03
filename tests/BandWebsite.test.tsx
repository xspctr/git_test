import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import BandWebsite from "../BandWebsite"

describe("Framer band website", () => {
    it("renders safely without a browser or configured media", () => {
        const html = renderToStaticMarkup(<BandWebsite />)
        expect(html).toContain("YOUR BAND")
        expect(html).toContain("Your band video goes here.")
        expect(html).toContain("Your music, right here.")
        expect(html).not.toContain("<iframe")
        expect(html.match(/<section /g)).toHaveLength(3)
    })

    it("links every anchor to a real, instance-specific destination", () => {
        const html = renderToStaticMarkup(<><BandWebsite /><BandWebsite /></>)
        const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((match) => match[1])
        expect(new Set(ids).size).toBe(ids.length)
        for (const match of html.matchAll(/href="#([^"]+)"/g)) {
            expect(ids).toContain(match[1])
        }
        expect(html).toContain('aria-label="Main navigation"')
    })

    it("embeds a valid HTTPS Bandcamp player with an accessible title", () => {
        const url = "https://bandcamp.com/EmbeddedPlayer/album=123/size=large/artwork=none/"
        const html = renderToStaticMarkup(<BandWebsite bandName="Test Band" bandcampEmbed={url} />)
        expect(html).toContain(`src="${url}"`)
        expect(html).toContain('title="Test Band on Bandcamp"')
        expect(html).toContain('loading="lazy"')
    })

    it.each([
        "javascript:alert(1)",
        "http://bandcamp.com/EmbeddedPlayer/album=123/",
        "https://bandcamp.com.evil.example/EmbeddedPlayer/album=123/",
        "https://artist.bandcamp.com/album/test",
        '<iframe src="https://bandcamp.com/EmbeddedPlayer/album=123/"></iframe>',
        "not a URL",
    ])("does not embed an invalid player: %s", (bandcampEmbed) => {
        const html = renderToStaticMarkup(<BandWebsite bandcampEmbed={bandcampEmbed} />)
        expect(html).not.toContain("<iframe")
        expect(html).toContain("Your music, right here.")
    })

    it("renders native video controls without server-side autoplay", () => {
        const html = renderToStaticMarkup(<BandWebsite video="https://example.com/live.mp4" poster={{ src: "https://example.com/poster.jpg" }} />)
        expect(html).toContain("<video")
        expect(html).toContain('poster="https://example.com/poster.jpg"')
        expect(html).toContain('controls=""')
        expect(html).toContain('playsinline=""')
        expect(html).not.toContain("autoplay")
    })

    it("only enables real HTTPS product checkout links", () => {
        const html = renderToStaticMarkup(<BandWebsite products={[
            { name: "Tour tee", price: "$25", url: "https://shop.example.com/tee" },
            { name: "Record", price: "$30", url: "javascript:alert(1)" },
        ]} />)
        expect(html).toContain('href="https://shop.example.com/tee"')
        expect(html).toContain('rel="noopener noreferrer"')
        expect(html).toContain("Shop Tour tee (opens in a new tab)")
        expect(html).toContain("Coming soon")
        expect(html).not.toContain("javascript:")
    })

    it("supports an empty merch collection and escapes band text", () => {
        const html = renderToStaticMarkup(<BandWebsite bandName={'<script>alert("test")</script>'} products={[]} />)
        expect(html).toContain("New merch coming soon.")
        expect(html).not.toContain("<script>")
    })
})
