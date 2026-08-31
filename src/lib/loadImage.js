/**
 * Reads a picked image file into a data URL, downscaled.
 *
 * A phone photo is 4000px and several megabytes; held as a data URL in state
 * and re-encoded into the print pipeline, that is enough to make the whole
 * preview stutter. A decorative image sits at roughly a quarter of an A4
 * sheet — about 74mm — where 1600px is still over 500dpi, far past anything a
 * printer resolves. So it is capped, and nothing visible is lost.
 */
const MAX_EDGE = 1600

export function loadImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('הקובץ אינו תמונה'))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('לא הצלחתי לקרוא את הקובץ'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('לא הצלחתי לפתוח את התמונה'))
      img.onload = () => {
        const ratio = Math.min(1, MAX_EDGE / Math.max(img.width, img.height))
        if (ratio === 1) {
          resolve(reader.result)
          return
        }
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * ratio)
        canvas.height = Math.round(img.height * ratio)
        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        // PNG, not JPEG: a transparent cut-out stays transparent, which is
        // the whole point of dropping a character onto a backdrop.
        resolve(canvas.toDataURL('image/png'))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
