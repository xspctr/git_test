import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

interface ImageAsset {
    src: string
    srcSet?: string
    alt?: string
}

interface Product {
    name: string
    price: string
    image?: ImageAsset
    url?: string
}

interface Props {
    bandName?: string
    tagline?: string
    video?: string
    poster?: ImageAsset
    musicTitle?: string
    bandcampEmbed?: string
    bandcampUrl?: string
    products?: Product[]
    accent?: string
    style?: React.CSSProperties
}

const sampleProducts: Product[] = [
    { name: "Band tee", price: "Add price" },
    { name: "Vinyl record", price: "Add price" },
    { name: "Tour poster", price: "Add price" },
]

function httpsUrl(value?: string): string | undefined {
    try {
        const url = new URL(value?.trim() || "")
        return url.protocol === "https:" ? url.href : undefined
    } catch {
        return undefined
    }
}

function bandcampPlayer(value?: string): string | undefined {
    const safe = httpsUrl(value)
    if (!safe) return undefined
    const url = new URL(safe)
    return url.hostname === "bandcamp.com" &&
        url.pathname.startsWith("/EmbeddedPlayer/")
        ? safe
        : undefined
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 2000
 */
export default function BandWebsite({
    bandName = "YOUR BAND",
    tagline = "Turn it up. Stay a while.",
    video,
    poster,
    musicTitle = "The latest release.",
    bandcampEmbed,
    bandcampUrl,
    products = sampleProducts,
    accent = "#e2ff54",
    style,
}: Props) {
    const instance = React.useId().replace(/:/g, "")
    const sectionId = (section: string) => `${instance}-${section}`
    const staticRenderer = useIsStaticRenderer()
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const [videoError, setVideoError] = React.useState(false)
    const [allowAutoplay, setAllowAutoplay] = React.useState(false)
    const embed = bandcampPlayer(bandcampEmbed)
    const musicUrl = httpsUrl(bandcampUrl)

    React.useEffect(() => {
        setVideoError(false)
    }, [video])

    React.useEffect(() => {
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
        const update = () => setAllowAutoplay(!preference.matches && !staticRenderer)
        update()
        preference.addEventListener("change", update)
        return () => preference.removeEventListener("change", update)
    }, [staticRenderer])

    React.useEffect(() => {
        const player = videoRef.current
        if (!player) return
        if (allowAutoplay) {
            // Browsers may reject autoplay; native controls remain available.
            void player.play().catch(() => {})
        } else {
            player.pause()
        }
    }, [allowAutoplay, video, videoError])

    return (
        <div
            className="band-site"
            style={{ "--band-accent": accent, width: "100%", ...style } as React.CSSProperties}
        >
            <style>{css}</style>
            <a className="band-skip" href={`#${sectionId("music")}`}>Skip to music</a>
            <header className="band-nav">
                <a className="band-wordmark" href={`#${sectionId("video")}`}>{bandName}</a>
                <nav aria-label="Main navigation">
                    {["Video", "Music", "Merch"].map((label) => (
                        <a key={label} href={`#${sectionId(label.toLowerCase())}`}>{label}</a>
                    ))}
                </nav>
            </header>

            <main>
                <section className="band-hero" id={sectionId("video")} aria-labelledby={sectionId("title")}>
                    <div className="band-hero-copy">
                        <p className="band-eyebrow">LOUD & CLEAR / OFFICIAL SITE</p>
                        <h1 id={sectionId("title")}>{bandName}</h1>
                        <div className="band-hero-bottom">
                            <p>{tagline}</p>
                            <a className="band-button" href={`#${sectionId("music")}`}>Listen now ↗</a>
                        </div>
                    </div>
                    <div className="band-video-frame">
                        {video && !videoError ? (
                            <video
                                key={video}
                                ref={videoRef}
                                src={video}
                                poster={poster?.src}
                                autoPlay={allowAutoplay}
                                muted
                                loop
                                playsInline
                                controls
                                preload="metadata"
                                aria-label={`${bandName} featured video`}
                                onError={() => setVideoError(true)}
                            />
                        ) : (
                            <div className="band-video-placeholder">
                                {poster?.src && <img src={poster.src} srcSet={poster.srcSet} alt={poster.alt || ""} />}
                                <p>{videoError ? "Video unavailable. Listen to the music below." : "Your band video goes here."}</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="band-section" id={sectionId("music")} aria-labelledby={sectionId("music-title")}>
                    <div className="band-section-heading">
                        <p className="band-eyebrow">01 / MUSIC</p>
                        <h2 id={sectionId("music-title")}>{musicTitle}</h2>
                        <p>Press play. Find your new favorite.</p>
                        {musicUrl && <a className="band-text-link" href={musicUrl} target="_blank" rel="noopener noreferrer">Visit Bandcamp ↗</a>}
                    </div>
                    <div className="band-player">
                        {embed ? (
                            <iframe
                                title={`${bandName} on Bandcamp`}
                                src={embed}
                                width="100%"
                                height="470"
                                loading="lazy"
                            />
                        ) : (
                            <div className="band-empty">
                                <span aria-hidden="true">♫</span>
                                <h3>Your music, right here.</h3>
                                <p>Add your Bandcamp embedded-player URL in the component settings.</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="band-merch" id={sectionId("merch")} aria-labelledby={sectionId("merch-title")}>
                    <div className="band-merch-heading">
                        <div>
                            <p className="band-eyebrow">02 / MERCH</p>
                            <h2 id={sectionId("merch-title")}>Take the noise home.</h2>
                        </div>
                        <p>Records. Threads. Good things.</p>
                    </div>
                    <div className="band-products">
                        {products.length ? products.map((product, index) => {
                            const url = httpsUrl(product.url)
                            return (
                                <article className="band-product" key={index}>
                                    <div className="band-product-image">
                                        {product.image?.src ? (
                                            <img src={product.image.src} srcSet={product.image.srcSet} alt={product.image.alt || product.name} loading="lazy" />
                                        ) : <span>IMAGE / {String(index + 1).padStart(2, "0")}</span>}
                                    </div>
                                    <div className="band-product-meta"><h3>{product.name}</h3><p>{product.price}</p></div>
                                    {url ? (
                                        <a className="band-buy" href={url} target="_blank" rel="noopener noreferrer" aria-label={`Shop ${product.name} (opens in a new tab)`}>Shop now ↗</a>
                                    ) : <p className="band-unavailable">Coming soon</p>}
                                </article>
                            )
                        }) : <p>New merch coming soon.</p>}
                    </div>
                    <p className="band-shop-note">Purchases are completed securely on our store provider’s website.</p>
                </section>
            </main>
            <footer className="band-footer"><strong>{bandName}</strong><a href={`#${sectionId("video")}`}>Back to top ↑</a></footer>
        </div>
    )
}

addPropertyControls(BandWebsite, {
    bandName: { type: ControlType.String, title: "Band name", defaultValue: "YOUR BAND" },
    tagline: { type: ControlType.String, defaultValue: "Turn it up. Stay a while." },
    video: { type: ControlType.File, title: "Hero video", allowedFileTypes: ["mp4", "webm"] },
    poster: { type: ControlType.ResponsiveImage, title: "Video poster" },
    accent: { type: ControlType.Color, defaultValue: "#e2ff54" },
    musicTitle: { type: ControlType.String, title: "Music title", defaultValue: "The latest release." },
    bandcampEmbed: {
        type: ControlType.String,
        title: "Player URL",
        description: "Paste only the https://bandcamp.com/EmbeddedPlayer/… URL from the iframe src, not the full embed code. Choose a large player without artwork for a compact layout.",
    },
    bandcampUrl: { type: ControlType.String, title: "Bandcamp link" },
    products: {
        type: ControlType.Array,
        title: "Merch",
        maxCount: 12,
        defaultValue: sampleProducts,
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, title: "Product name" },
                price: { type: ControlType.String, title: "Display price" },
                image: { type: ControlType.ResponsiveImage },
                url: { type: ControlType.String, title: "Checkout URL" },
            },
        },
    },
})

const css = `
.band-site { background:#111210; color:#f2f1e9; font-family:Arial,Helvetica,sans-serif; line-height:1.5; container-type:inline-size; }
.band-site *, .band-site *::before, .band-site *::after { box-sizing:border-box; }
.band-site :is(h1,h2,h3,p) { margin:0; }
.band-site a { color:inherit; text-decoration:none; }
.band-site :is(a,video):focus-visible { outline:3px solid var(--band-accent); outline-offset:5px; }
.band-site a:hover { text-decoration:underline; text-underline-offset:5px; }
.band-site section { scroll-margin-top:110px; }
.band-site .band-nav { position:sticky; top:0; z-index:10; background:#111210; border-bottom:1px solid #34352e; display:flex; justify-content:space-between; align-items:center; gap:20px; padding:16px 5%; }
.band-site .band-wordmark { font-weight:900; letter-spacing:-1px; font-size:22px; overflow-wrap:anywhere; }
.band-site nav { display:flex; gap:24px; flex-shrink:0; }
.band-site nav a { display:flex; align-items:center; min-height:44px; font-size:14px; }
.band-site .band-skip { position:absolute; top:8px; left:8px; transform:translateY(-200%); z-index:20; padding:12px; background:#111210; }
.band-site .band-skip:focus { transform:translateY(0); }
.band-site .band-hero-copy { padding:64px 5% 32px; }
.band-site .band-eyebrow { font:12px/1.5 monospace; letter-spacing:2px; color:var(--band-accent); margin-bottom:24px; }
.band-site h1 { font-size:clamp(56px,12cqw,180px); line-height:.9; letter-spacing:-.065em; font-weight:900; overflow-wrap:anywhere; }
.band-site .band-hero-bottom { display:flex; justify-content:space-between; align-items:center; gap:24px; margin-top:32px; }
.band-site .band-button { background:var(--band-accent); color:#111210; padding:14px 24px; font-weight:bold; flex-shrink:0; }
.band-site .band-video-frame { margin:0 5%; background:#22251c; aspect-ratio:16/9; }
.band-site .band-video-frame video { width:100%; height:100%; object-fit:cover; display:block; }
.band-site .band-video-placeholder { width:100%; height:100%; position:relative; display:grid; place-items:center; background:linear-gradient(135deg,#333b25,#171915); }
.band-site .band-video-placeholder img { position:absolute; width:100%; height:100%; object-fit:cover; }
.band-site .band-video-placeholder p { position:relative; background:#111210dd; padding:12px 20px; text-align:center; }
.band-site .band-section { padding:100px 5%; display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }
.band-site h2 { font-size:clamp(36px,5cqw,68px); line-height:1.05; letter-spacing:-.045em; margin-bottom:24px; overflow-wrap:anywhere; }
.band-site .band-section-heading > p:not(.band-eyebrow) { color:#babcb1; }
.band-site .band-text-link { display:inline-block; margin-top:24px; padding:12px 0; text-decoration:underline; }
.band-site .band-player { min-width:0; background:#1d2018; border:1px solid #34352e; }
.band-site iframe { border:0; display:block; }
.band-site .band-empty { min-height:360px; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:32px; gap:16px; }
.band-site .band-empty span { font-size:56px; color:var(--band-accent); }
.band-site .band-empty p { color:#babcb1; max-width:280px; }
.band-site .band-merch { padding:80px 5%; border-top:1px solid #34352e; }
.band-site .band-merch-heading { display:flex; justify-content:space-between; align-items:end; gap:32px; margin-bottom:40px; }
.band-site .band-merch-heading h2 { margin-bottom:0; }
.band-site .band-merch-heading > p { color:#babcb1; }
.band-site .band-products { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:24px; }
.band-site .band-product-image { aspect-ratio:1; background:#25281f; display:grid; place-items:center; color:#babcb1; font:12px monospace; letter-spacing:2px; }
.band-site .band-product-image img { width:100%; height:100%; object-fit:cover; }
.band-site .band-product-meta { display:flex; justify-content:space-between; gap:16px; margin:20px 0 8px; overflow-wrap:anywhere; }
.band-site h3 { font-size:18px; }
.band-site .band-product-meta p { color:#babcb1; flex-shrink:0; }
.band-site .band-buy { display:inline-flex; align-items:center; min-height:44px; color:var(--band-accent); }
.band-site .band-unavailable { color:#babcb1; padding:10px 0; }
.band-site .band-shop-note { font-size:12px; color:#babcb1; margin-top:40px; }
.band-site .band-footer { border-top:1px solid #34352e; padding:32px 5%; display:flex; justify-content:space-between; align-items:center; gap:24px; }
.band-site .band-footer a { padding:12px 0; flex-shrink:0; }
@container (max-width:700px) {
    .band-site .band-nav { flex-wrap:wrap; gap:4px 20px; padding:12px 5%; }
    .band-site nav { gap:20px; }
    .band-site .band-hero-copy { padding-top:48px; }
    .band-site .band-hero-bottom, .band-site .band-merch-heading { align-items:start; flex-direction:column; }
    .band-site .band-section { grid-template-columns:1fr; gap:32px; padding:64px 5%; }
    .band-site .band-merch { padding:64px 5%; }
    .band-site .band-products { grid-template-columns:repeat(2,minmax(0,1fr)); }
    .band-site .band-product-meta { flex-direction:column; gap:4px; }
}
@container (max-width:420px) {
    .band-site .band-products { grid-template-columns:1fr; }
    .band-site .band-wordmark { font-size:18px; }
    .band-site .band-footer { flex-wrap:wrap; }
}
`
