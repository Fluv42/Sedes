// Draws the link-preview card for every page (the picture LinkedIn, Slack and messages show when
// a link is shared): 1200 × 630, paper on the left with the Sedes logo, the page's title and its
// description, and the sunset field on the right, feathered into the paper like the site's hero.
//
// Run with `npm run og` (macOS: it uses AppKit and Core Text). Reads the page list that
// scripts/og-cards.mjs writes, and saves public/og/<name>.jpg.
import AppKit
import CoreText

let root = URL(fileURLWithPath: CommandLine.arguments[1])
struct Page: Decodable { let file: String; let title: String; let kicker: String; let description: String }
let pages = try JSONDecoder().decode([Page].self, from: Data(contentsOf: root.appendingPathComponent(".ssr/og-pages.json")))

for name in ["Libron-Regular", "Libron-Italic"] {
  CTFontManagerRegisterFontsForURL(root.appendingPathComponent("public/fonts/\(name).woff2") as CFURL, .process, nil)
}
func libron(_ size: CGFloat, italic: Bool = false) -> NSFont {
  NSFont(name: italic ? "Libron-Italic" : "Libron-Regular", size: size) ?? NSFont(name: "Georgia", size: size)!
}
func color(_ hex: UInt32, _ alpha: CGFloat = 1) -> NSColor {
  NSColor(srgbRed: CGFloat(hex >> 16 & 255) / 255, green: CGFloat(hex >> 8 & 255) / 255, blue: CGFloat(hex & 255) / 255, alpha: alpha)
}
let paper = color(0xf6f2e7), ink = color(0x2d2b24), muted = color(0x6a6556), walnut = color(0x6b4428)
let width: CGFloat = 1200, height: CGFloat = 630
let field = NSImage(contentsOf: root.appendingPathComponent("public/media/field-sunset.jpg"))!

// A soft oval: opaque in the middle, fading to nothing at its edge (the hero's mask).
func featherMask(size: CGSize) -> CGImage {
  let space = CGColorSpaceCreateDeviceGray()
  let context = CGContext(data: nil, width: Int(size.width), height: Int(size.height), bitsPerComponent: 8, bytesPerRow: 0, space: space, bitmapInfo: 0)!
  let stops: [CGFloat] = [0, 0.52, 0.62, 0.73, 0.84, 0.93, 1]
  let values: [CGFloat] = [1, 1, 0.84, 0.55, 0.27, 0.08, 0]
  let gradient = CGGradient(colorSpace: space, colorComponents: values.flatMap { [$0, 1] }, locations: stops, count: stops.count)!
  context.translateBy(x: size.width / 2, y: size.height / 2)
  context.scaleBy(x: size.width / 2, y: size.height / 2)
  context.drawRadialGradient(gradient, startCenter: .zero, startRadius: 0, endCenter: .zero, endRadius: 1, options: [])
  return context.makeImage()!
}

// The logo: "Sedes" with the walnut line under it that ends in an ear of wheat (logo A2).
// Drawn in the logo's own 240 × 120 units, scaled.
func drawLogo(at origin: CGPoint, scale: CGFloat) {
  let context = NSGraphicsContext.current!.cgContext
  context.saveGState()
  context.translateBy(x: origin.x, y: origin.y)
  context.scaleBy(x: scale, y: scale)
  let word = NSAttributedString(string: "Sedes", attributes: [.font: libron(44), .foregroundColor: ink])
  let size = word.size()
  word.draw(at: CGPoint(x: 120 - size.width / 2, y: 70 - libron(44).ascender))
  walnut.setStroke()
  walnut.setFill()
  let stem = NSBezierPath()
  stem.move(to: CGPoint(x: 69, y: 82.25))
  stem.line(to: CGPoint(x: 165, y: 82.25))
  stem.lineWidth = 4.5
  stem.lineCapStyle = .round
  stem.stroke()
  func grain(_ x: CGFloat, _ y: CGFloat, _ rx: CGFloat, _ ry: CGFloat, _ angle: CGFloat) {
    context.saveGState()
    context.translateBy(x: x, y: y)
    context.rotate(by: angle * .pi / 180)
    context.fillEllipse(in: CGRect(x: -rx, y: -ry, width: rx * 2, height: ry * 2))
    context.restoreGState()
  }
  for x: CGFloat in [139, 150, 161] { grain(x, 78.6, 6.2, 2.5, -28); grain(x, 85.9, 6.2, 2.5, 28) }
  grain(171, 82.25, 5, 2.3, 0)
  context.restoreGState()
}

func paragraph(_ text: String, font: NSFont, color: NSColor, lineHeight: CGFloat) -> NSAttributedString {
  let style = NSMutableParagraphStyle()
  style.minimumLineHeight = lineHeight
  style.maximumLineHeight = lineHeight
  style.lineBreakMode = .byWordWrapping
  return NSAttributedString(string: text, attributes: [.font: font, .foregroundColor: color, .paragraphStyle: style])
}

let out = root.appendingPathComponent("public/og")
try FileManager.default.createDirectory(at: out, withIntermediateDirectories: true)

for page in pages {
  let image = NSImage(size: NSSize(width: width, height: height), flipped: true) { _ in
    let context = NSGraphicsContext.current!.cgContext
    paper.setFill()
    NSRect(x: 0, y: 0, width: width, height: height).fill()

    // The field, feathered into the paper on the right.
    let box = CGRect(x: 560, y: -40, width: 800, height: 710)
    context.saveGState()
    context.clip(to: box, mask: featherMask(size: CGSize(width: 800, height: 710)))
    let scale = max(box.width / field.size.width, box.height / field.size.height)
    let drawn = CGSize(width: field.size.width * scale, height: field.size.height * scale)
    field.draw(in: CGRect(x: box.midX - drawn.width * 0.55, y: box.midY - drawn.height * 0.5, width: drawn.width, height: drawn.height),
               from: .zero, operation: .sourceOver, fraction: 1, respectFlipped: true, hints: nil)
    context.restoreGState()

    drawLogo(at: CGPoint(x: 72 - 66 * 1.25, y: 14), scale: 1.25)
    let kicker = paragraph(page.kicker, font: libron(25), color: muted, lineHeight: 32)
    kicker.draw(in: CGRect(x: 72, y: 190, width: 520, height: 40))
    let title = paragraph(page.title, font: libron(page.title.count > 14 ? 58 : page.title.count > 10 ? 66 : 76), color: ink, lineHeight: page.title.count > 14 ? 64 : page.title.count > 10 ? 72 : 82)
    let titleHeight = title.boundingRect(with: NSSize(width: 520, height: 300), options: [.usesLineFragmentOrigin]).height
    title.draw(with: CGRect(x: 72, y: 232, width: 520, height: titleHeight + 10), options: [.usesLineFragmentOrigin])
    let description = paragraph(page.description, font: libron(26), color: muted, lineHeight: 36)
    description.draw(with: CGRect(x: 72, y: 250 + titleHeight, width: 500, height: 36 * 3), options: [.usesLineFragmentOrigin, .truncatesLastVisibleLine])
    paragraph("sedes.ca", font: libron(23, italic: true), color: walnut, lineHeight: 30).draw(in: CGRect(x: 72, y: 560, width: 300, height: 34))
    return true
  }
  let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: Int(width), pixelsHigh: Int(height), bitsPerSample: 8, samplesPerPixel: 4,
                                hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
  NSGraphicsContext.saveGraphicsState()
  NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
  image.draw(in: NSRect(x: 0, y: 0, width: width, height: height))
  NSGraphicsContext.restoreGraphicsState()
  let jpeg = bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.82])!
  try jpeg.write(to: out.appendingPathComponent("\(page.file).jpg"))
  print("og/\(page.file).jpg  \(page.title)")
}
