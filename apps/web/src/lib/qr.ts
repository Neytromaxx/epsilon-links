// QR codes are made at build time from the production address (src/lib/site.ts).
import QRCode, { type QRCodeToBufferOptions, type QRCodeToStringOptions } from 'qrcode'

// Near-black on white scans best, also when printed on a sticker. Level M survives small damage.
const colors = { dark: '#0B1F2E', light: '#FFFFFF' }

export function qrSvg(url: string): Promise<string> {
  const options: QRCodeToStringOptions = { type: 'svg', errorCorrectionLevel: 'M', margin: 2, color: colors }
  return QRCode.toString(url, options)
}

export function qrPng(url: string): Promise<Buffer> {
  const options: QRCodeToBufferOptions = {
    type: 'png',
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 1024,
    color: colors,
  }
  return QRCode.toBuffer(url, options)
}
