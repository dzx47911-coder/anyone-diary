import html2canvas from 'html2canvas'

export async function exportDiaryAsImage(element, filename = 'diary', cardColor = '#FFB6C1') {
  if (!element) return

  const cardCanvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
    logging: false
  })

  const border = 40
  const targetW = cardCanvas.width + border * 2
  const targetH = cardCanvas.height + border * 2

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')

  // 同色系深一点的边框背景
  ctx.fillStyle = cardColor
  ctx.fillRect(0, 0, targetW, targetH)

  ctx.drawImage(cardCanvas, border, border)

  const link = document.createElement('a')
  link.download = `${filename}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
