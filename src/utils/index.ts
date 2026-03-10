import {
  type EarringsShape,
  type GlassesShape,
  BeardShape,
  Gender,
  TopsShape,
  WidgetType,
  WrapperShape,
} from '@/enums'
import type { AvatarOption, None } from '@/types'

import {
  AVATAR_LAYER,
  NONE,
  SETTINGS,
  SHAPE_STYLE_SET,
  SPECIAL_AVATARS,
} from './constant'
import { widgetData } from './dynamic-data'

/**
 * Get a random value from an array.
 */
function getRandomValue<Item = unknown>(
  arr: Item[],
  {
    avoid = [],
    usually = [],
  }: { avoid?: unknown[]; usually?: (Item | 'none')[] } = {}
): Item {
  const avoidValues = avoid.filter(Boolean)
  const filteredArr = arr.filter((it) => !avoidValues.includes(it))

  const usuallyValues = usually
    .filter(Boolean)
    .reduce<Item[]>((acc, cur) => acc.concat(new Array(15).fill(cur)), [])

  const finalArr = filteredArr.concat(usuallyValues)

  const randomIdx = Math.floor(Math.random() * finalArr.length)
  const randomValue = finalArr[randomIdx]

  return randomValue
}

export function getRandomFillColor(colors = SETTINGS.commonColors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

export function getRandomAvatarOption(
  presetOption: Partial<AvatarOption> = {},
  useOption: Partial<AvatarOption> = {}
): AvatarOption {
  const gender = getRandomValue(SETTINGS.gender)

  const beardList: BeardShape[] = []
  let topList: TopsShape[] = [TopsShape.Danny, TopsShape.Wave, TopsShape.Pixie]

  if (gender === Gender.Male) {
    beardList.push(BeardShape.Scruff)
    topList = SETTINGS.topsShape.filter((shape) => !topList.includes(shape))
  }

  const beardShape = getRandomValue<BeardShape | None>(beardList, {
    usually: [NONE],
  })

  const hairShape = getRandomValue(topList, {
    avoid: [useOption.widgets?.tops?.shape],
  })
  const hairColor = getRandomFillColor()

  const avatarOption: AvatarOption = {
    gender,

    wrapperShape:
      presetOption?.wrapperShape || getRandomValue(SETTINGS.wrapperShape),

    background: {
      color: getRandomValue(SETTINGS.backgroundColor, {
        avoid: [
          useOption.background?.color,
          (hairShape === TopsShape.Punk || hairShape === TopsShape.Fonze) &&
            hairColor, // Handle special cases and prevent color conflicts.
        ],
      }),
      borderColor: getRandomValue(SETTINGS.borderColor, {
        avoid: [useOption.background?.color],
        usually: ['transparent'],
      }),
    },

    widgets: {
      face: {
        shape: getRandomValue(SETTINGS.faceShape),
        fillColor: getRandomFillColor(SETTINGS.skinColors),
      },
      tops: {
        shape: hairShape,
        fillColor: hairColor,
      },
      ear: {
        shape: getRandomValue(SETTINGS.earShape, {
          avoid: [useOption.widgets?.ear?.shape],
        }),
      },
      earrings: {
        shape: getRandomValue<EarringsShape | None>(SETTINGS.earringsShape, {
          usually: [NONE],
        }),
      },
      eyebrows: {
        shape: getRandomValue(SETTINGS.eyebrowsShape, {
          avoid: [useOption.widgets?.eyebrows?.shape],
        }),
      },
      eyes: {
        shape: getRandomValue(SETTINGS.eyesShape, {
          avoid: [useOption.widgets?.eyes?.shape],
        }),
      },
      nose: {
        shape: getRandomValue(SETTINGS.noseShape, {
          avoid: [useOption.widgets?.nose?.shape],
        }),
      },
      glasses: {
        shape: getRandomValue<GlassesShape | None>(SETTINGS.glassesShape, {
          usually: [NONE],
        }),
      },
      mouth: {
        shape: getRandomValue(SETTINGS.mouthShape, {
          avoid: [useOption.widgets?.mouth?.shape],
        }),
      },
      beard: {
        shape: beardShape,

        // HACK:
        ...(beardShape === BeardShape.Scruff
          ? { zIndex: AVATAR_LAYER['mouth'].zIndex - 1 }
          : undefined),
      },
      clothes: {
        shape: getRandomValue(SETTINGS.clothesShape, {
          avoid: [useOption.widgets?.clothes?.shape],
        }),
        fillColor: getRandomFillColor(),
      },
    },
  }

  return avatarOption
}

export function getSpecialAvatarOption(): AvatarOption {
  return SPECIAL_AVATARS[Math.floor(Math.random() * SPECIAL_AVATARS.length)]
}

export function showConfetti() {
  import('canvas-confetti').then((confetti) => {
    const canvasEle: HTMLCanvasElement | null =
      document.querySelector('#confetti')

    if (!canvasEle) {
      return
    }

    const myConfetti = confetti.create(canvasEle, {
      resize: true,
      useWorker: true,
      disableForReducedMotion: true,
    })

    const duration = performance.now() + 1 * 1000

    const confettiColors = ['#6967fe', '#85e9f4', '#e16984']

    void (function frame() {
      myConfetti({
        particleCount: confettiColors.length,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: confettiColors,
      })
      myConfetti({
        particleCount: confettiColors.length,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: confettiColors,
      })

      if (performance.now() < duration) {
        requestAnimationFrame(frame)
      }
    })()
  })
}

export function highlightJSON(json: string): string {
  if (!json) {
    return ''
  }

  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2)
  }

  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = ''
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key'
        } else {
          cls = 'string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean'
      } else if (/null/.test(match)) {
        cls = 'null'
      } else {
        cls = 'number'
      }
      return `<span class="token ${cls}">${match}</span>`
    }
  )
}

/**
 * 根据AvatarOption生成头像SVG字符串
 * @param option 头像配置选项
 * @param size 头像尺寸
 */
export async function generateAvatarSvg(
  option: AvatarOption,
  size = 280
): Promise<string> {
  const sortedList = Object.entries(option.widgets).sort(
    ([prevShape, prev], [nextShape, next]) => {
      const ix = prev.zIndex ?? AVATAR_LAYER[prevShape]?.zIndex ?? 0
      const iix = next.zIndex ?? AVATAR_LAYER[nextShape]?.zIndex ?? 0
      return ix - iix
    }
  )

  const promises: Promise<string>[] = sortedList.map(
    async ([widgetType, opt]) => {
      if (opt.shape !== NONE && widgetData?.[widgetType]?.[opt.shape]) {
        return (await widgetData[widgetType][opt.shape]()).default
      }
      return ''
    }
  )

  let skinColor: string | undefined

  const svgRawList = await Promise.all(promises).then((raw) => {
    return raw.map((svgRaw, i) => {
      const [widgetType, widget] = sortedList[i]
      let widgetFillColor = widget.fillColor

      if (widgetType === WidgetType.Face) {
        skinColor = widgetFillColor
      }
      if (skinColor && widgetType === WidgetType.Ear) {
        widgetFillColor = skinColor
      }

      const content = svgRaw
        .slice(svgRaw.indexOf('>', svgRaw.indexOf('<svg')) + 1)
        .replace('</svg>', '')
        .replaceAll('$fillColor', widgetFillColor || 'transparent')

      return `
        <g id="vue-color-avatar-${sortedList[i][0]}">
          ${content}
        </g>
      `
    })
  })

  const svgContent = `
    <svg
      width="${size}"
      height="${size}"
      viewBox="0 0 ${size / 0.7} ${size / 0.7}"
      preserveAspectRatio="xMidYMax meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(100, 65)">
        ${svgRawList.join('')}
      </g>
    </svg>
  `

  return svgContent
}

/**
 * 根据AvatarOption生成头像PNG的base64数据（不含前缀）
 * @param option 头像配置选项
 * @param size 头像尺寸
 */
export async function generateAvatarPngBase64(
  option: AvatarOption,
  size = 280
): Promise<string> {
  const svgString = await generateAvatarSvg(option, size)
  const shapeStyle = SHAPE_STYLE_SET[option.wrapperShape ?? WrapperShape.Circle]
  const hasBorder =
    option.background.borderColor &&
    option.background.borderColor !== 'transparent'

  // 创建离屏canvas
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // 1. 绘制背景
  ctx.fillStyle = option.background.color
  if (shapeStyle.borderRadius === '50%') {
    // 圆形背景
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.clip()
  } else if (shapeStyle.borderRadius) {
    // 圆角矩形背景
    const radius = parseInt(shapeStyle.borderRadius) || 0
    ctx.beginPath()
    ctx.roundRect(0, 0, size, size, radius)
    ctx.fill()
    ctx.clip()
  } else {
    // 方形背景
    ctx.fillRect(0, 0, size, size)
  }

  // 2. 绘制SVG头像
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size)

      // 3. 绘制边框
      if (hasBorder) {
        ctx.strokeStyle = option.background.borderColor
        ctx.lineWidth = 10
        if (shapeStyle.borderRadius === '50%') {
          ctx.beginPath()
          ctx.arc(size / 2, size / 2, size / 2 - 5, 0, Math.PI * 2)
          ctx.stroke()
        } else if (shapeStyle.borderRadius) {
          const radius = parseInt(shapeStyle.borderRadius) || 0
          ctx.beginPath()
          ctx.roundRect(5, 5, size - 10, size - 10, radius - 5)
          ctx.stroke()
        } else {
          ctx.strokeRect(5, 5, size - 10, size - 10)
        }
      }

      // 转换为base64
      const base64 = canvas.toDataURL().replace('data:image/png;base64,', '')
      URL.revokeObjectURL(url)
      resolve(base64)
    }
    img.onerror = reject
    img.src = url
  })
}
