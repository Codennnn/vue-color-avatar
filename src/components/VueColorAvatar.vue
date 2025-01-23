<template>
  <div
    ref="avatarRef"
    class="vue-color-avatar"
    :style="{
      width: `${avatarSize}px`,
      height: `${avatarSize}px`,
      ...getWrapperShapeStyle(),
    }"
    :class="getWrapperShapeClassName()"
  >
    <Background :color="avatarOption.background.color" />

    <div class="avatar-payload" v-html="svgContent" />

    <Border
      :color="avatarOption.background.borderColor"
      :radius="getWrapperShapeStyle().borderRadius"
    />
  </div>
</template>

<script lang="ts">
export interface VueColorAvatarRef {
  avatarRef: HTMLDivElement
}
</script>

<script lang="ts" setup>
import { ref, toRefs, watchEffect } from 'vue'

import { WidgetType, WrapperShape } from '@/enums'
import type { AvatarOption } from '@/types'
import { getRandomAvatarOption } from '@/utils'
import { AVATAR_LAYER, NONE, SHAPE_STYLE_SET } from '@/utils/constant'
import { widgetData } from '@/utils/dynamic-data'

import Background from './widgets/Background.vue'
import Border from './widgets/Border.vue'

interface VueColorAvatarProps {
  option: AvatarOption
  size?: number
}

const props = withDefaults(defineProps<VueColorAvatarProps>(), {
  option: () => getRandomAvatarOption(),
  size: 280,
})

const { option: avatarOption, size: avatarSize } = toRefs(props)

const avatarRef = ref<VueColorAvatarRef['avatarRef']>()

defineExpose({ avatarRef })

function getWrapperShapeClassName() {
  return {
    [WrapperShape.Circle]:
      avatarOption.value.wrapperShape === WrapperShape.Circle,
    [WrapperShape.Square]:
      avatarOption.value.wrapperShape === WrapperShape.Square,
    [WrapperShape.Squircle]:
      avatarOption.value.wrapperShape === WrapperShape.Squircle,
  }
}

function getWrapperShapeStyle() {
  return SHAPE_STYLE_SET[avatarOption.value.wrapperShape ?? WrapperShape.Circle]
}

const svgContent = ref('')

watchEffect(async () => {
  const sortedList = Object.entries(avatarOption.value.widgets).sort(
    ([prevShape, prev], [nextShape, next]) => {
      const ix = prev.zIndex ?? AVATAR_LAYER[prevShape]?.zIndex ?? 0
      const iix = next.zIndex ?? AVATAR_LAYER[nextShape]?.zIndex ?? 0
      return ix - iix
    }
  )

  // const promises: Promise<string>[] = sortedList.map(async ([widgetType, opt]) => {
  //   return (
  //     await import(`../assets/widgets/${widgetType}/${opt.shape}.svg?raw`)
  //   ).default
  // })

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

  svgContent.value = `
    <svg
      width="${avatarSize.value}"
      height="${avatarSize.value}"
      viewBox="0 0 ${avatarSize.value / 0.7} ${avatarSize.value / 0.7}"
      preserveAspectRatio="xMidYMax meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(100, 65)">
        ${svgRawList.join('')}
      </g>
    </svg>
  `
})
</script>

<style lang="scss" scoped>
.vue-color-avatar {
  position: relative;
  overflow: hidden;

  .avatar-payload {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
  }
}
</style>
