<template>
  <PerfectScrollbar class="configurator-scroll">
    <div class="configurator">
      <SectionWrapper :title="t('label.wrapperShape')">
        <ul class="wrapper-shape">
          <li
            v-for="wrapperShape in SETTINGS.wrapperShape"
            :key="wrapperShape"
            class="wrapper-shape__item"
            :title="t(`wrapperShape.${wrapperShape}`)"
            @click="switchWrapperShape(wrapperShape)"
          >
            <div
              class="shape"
              :class="[
                wrapperShape,
                { active: wrapperShape === avatarOption.wrapperShape },
              ]"
            />
          </li>
        </ul>
      </SectionWrapper>

      <SectionWrapper :title="t('label.borderColor')">
        <ul class="color-list">
          <li
            v-for="borderColor in SETTINGS.borderColor"
            :key="borderColor"
            class="color-list__item"
            @click="switchBorderColor(borderColor)"
          >
            <div
              :style="{ background: borderColor }"
              class="bg-color"
              :class="[
                {
                  active: borderColor === avatarOption.background.borderColor,
                  transparent: borderColor === 'transparent',
                },
              ]"
            />
          </li>
        </ul>
      </SectionWrapper>

      <SectionWrapper :title="t('label.backgroundColor')">
        <ul class="color-list">
          <li
            v-for="bgColor in SETTINGS.backgroundColor"
            :key="bgColor"
            class="color-list__item"
            @click="switchBgColor(bgColor)"
          >
            <div
              :style="{ background: bgColor }"
              class="bg-color"
              :class="{
                active: bgColor === avatarOption.background.color,
                transparent: bgColor === 'transparent',
              }"
            ></div>
          </li>
        </ul>
      </SectionWrapper>

      <SectionWrapper
        v-for="s in sections"
        :key="s.widgetType"
        :title="t(`widgetType.${s.widgetType}`)"
      >
        <details
          v-if="
            s.widgetType === WidgetType.Tops ||
            s.widgetType === WidgetType.Face ||
            s.widgetType === WidgetType.Clothes
          "
          class="color-picker"
          :open="s.widgetType === WidgetType.Face"
        >
          <summary class="color">{{ t('label.colors') }}</summary>
          <ul class="color-list">
            <li
              v-for="fillColor in SETTINGS[
                s.widgetType === WidgetType.Face ? 'skinColors' : 'commonColors'
              ]"
              :key="fillColor"
              class="color-list__item"
              @click="setWidgetColor(s.widgetType, fillColor)"
            >
              <div
                :style="{ background: fillColor }"
                class="bg-color"
                :class="{
                  active: fillColor === getWidgetColor(s.widgetType),
                }"
              />
            </li>
          </ul>
        </details>

        <ul class="widget-list">
          <li
            v-for="it in s.widgetList"
            :key="it.widgetShape"
            class="list-item"
            :class="{
              selected:
                it.widgetShape === avatarOption.widgets?.[s.widgetType]?.shape,
            }"
            @click="switchWidget(s.widgetType, it.widgetShape)"
            v-html="it.svgRaw"
          />
        </ul>
      </SectionWrapper>
    </div>
  </PerfectScrollbar>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import PerfectScrollbar from '@/components/PerfectScrollbar.vue'
import SectionWrapper from '@/components/SectionWrapper.vue'
import {
  type WidgetShape,
  type WrapperShape,
  BeardShape,
  WidgetType,
} from '@/enums'
import { useAvatarOption } from '@/hooks'
import { AVATAR_LAYER, SETTINGS } from '@/utils/constant'
import { previewData } from '@/utils/dynamic-data'

const { t } = useI18n()

const [avatarOption, setAvatarOption] = useAvatarOption()

const sectionList = reactive(Object.values(WidgetType))
const sections = ref<
  {
    widgetType: WidgetType
    widgetList: {
      widgetType: WidgetType
      widgetShape: WidgetShape
      svgRaw: string
    }[]
  }[]
>([])

onMounted(() => {
  void (async () => {
    const a = await Promise.all(
      sectionList.map((section) => {
        return getWidgets(section)
      })
    )

    sections.value = sectionList.map((li, i) => {
      return {
        widgetType: li,
        widgetList: a[i],
      }
    })
  })()
})

async function getWidgets(widgetType: WidgetType) {
  const list = SETTINGS[`${widgetType}Shape`]
  // const promises: Promise<string>[] = list.map(async (widget: string) => {
  //   return (await import(`../assets/preview/${widgetType}/${widget}.svg?raw`))
  //     .default
  // })
  const promises: Promise<string>[] = list.map(async (widget: string) => {
    if (widget !== 'none' && previewData?.[widgetType]?.[widget]) {
      return (await previewData[widgetType][widget]()).default
    }
    return 'X'
  })
  const svgRawList = await Promise.all(promises).then((raw) => {
    return raw.map((svgRaw, i) => {
      return {
        widgetType,
        widgetShape: list[i],
        svgRaw,
      }
    })
  })
  return svgRawList
}

function switchWrapperShape(wrapperShape: WrapperShape) {
  if (wrapperShape !== avatarOption.value.wrapperShape) {
    setAvatarOption({ ...avatarOption.value, wrapperShape })
  }
}

function switchBorderColor(borderColor: string) {
  if (borderColor !== avatarOption.value.background.borderColor) {
    setAvatarOption({
      ...avatarOption.value,
      background: { ...avatarOption.value.background, borderColor },
    })
  }
}

function switchBgColor(bgColor: string) {
  if (bgColor !== avatarOption.value.background.color) {
    setAvatarOption({
      ...avatarOption.value,
      background: { ...avatarOption.value.background, color: bgColor },
    })
  }
}

function switchWidget(widgetType: WidgetType, widgetShape: WidgetShape) {
  if (widgetShape && avatarOption.value.widgets?.[widgetType]) {
    setAvatarOption({
      ...avatarOption.value,
      widgets: {
        ...avatarOption.value.widgets,
        [widgetType]: {
          ...avatarOption.value.widgets?.[widgetType],
          shape: widgetShape,
          ...(widgetShape === BeardShape.Scruff
            ? { zIndex: AVATAR_LAYER['mouth'].zIndex - 1 }
            : undefined),
        },
      },
    })
  }
}

function setWidgetColor(widgetType: WidgetType, fillColor: string) {
  if (avatarOption.value.widgets?.[widgetType]) {
    setAvatarOption({
      ...avatarOption.value,
      widgets: {
        ...avatarOption.value.widgets,
        [widgetType]: {
          ...avatarOption.value.widgets?.[widgetType],
          fillColor,
        },
      },
    })
  }
}

function getWidgetColor(type: string) {
  if (
    type === WidgetType.Face ||
    type === WidgetType.Tops ||
    type === WidgetType.Clothes
  ) {
    return avatarOption.value.widgets[type]?.fillColor
  } else return ''
}
</script>

<style lang="scss" scoped>
@use 'src/styles/var';

.configurator-scroll {
  width: var.$layout-sider-width;
  height: 100%;

  @media screen and (max-width: var.$screen-lg) {
    background-color: var.$color-configurator;
  }
}

.configurator {
  width: 100%;
  color: var.$color-text;

  .wrapper-shape {
    display: flex;
    align-items: center;

    .wrapper-shape__item {
      padding: 0.4rem 0.5rem;
      cursor: pointer;

      .shape {
        display: inline-block;
        width: 1.5rem;
        height: 1.5rem;
        background-color: var.$color-text;
        transition: background-color 0.2s;

        &.circle {
          border-radius: 50%;
        }

        &.squircle {
          border-radius: 20%;
        }

        &.active {
          background-color: var.$color-accent;
        }
      }
    }
  }

  .color-picker {
    margin: 1rem 0 0.5rem 0;

    summary {
      color: darken(var.$color-text, 20);
      font-size: small;
      cursor: pointer;
      user-select: none;
    }
  }

  .color-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .color-list__item {
      position: relative;
      z-index: 1;
      width: calc(100% / 7);
      padding: 0.6rem 0;
      cursor: pointer;
      transition: transform 0.2s;

      .bg-color {
        position: relative;
        box-sizing: content-box;
        width: 1.3em;
        height: 1.3em;
        margin: 0 auto;
        font-size: 16px;
        border-radius: 50%;
        box-shadow: 0 0 0.05em 0.2em var.$color-configurator;

        &.transparent {
          background: #fff !important;

          &::after {
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 1;
            color: #ff4757;
            font-weight: bold;
            font-size: 1.8rem;
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
            content: '\\';
          }
        }

        &::before {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: -1;
          width: 100%;
          height: 100%;
          background: inherit;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.5;
          transition: width 0.15s, height 0.15s;
          content: '';
        }

        &::after {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 1;
          color: var.$color-configurator;
          font-size: 1.5rem;
          transform: translate(-50%, -50%) scale(0.5);
          opacity: 0;
          transition: opacity 0.15s;
          content: '\2714';
        }

        &.active::before {
          width: 160%;
          height: 160%;
        }

        &.active::after {
          opacity: 1;
        }
      }
    }
  }

  .widget-list {
    display: flex;
    flex-wrap: wrap;

    .list-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: calc(100% / 4);
      height: 5rem;
      padding: 1rem;
      border-radius: 0.8rem;
      cursor: pointer;
      transition: background-color 0.2s;

      &.selected.selected {
        background-color: lighten(var.$color-configurator, 6);
      }

      &:hover {
        background-color: lighten(var.$color-configurator, 0);
      }

      & > :deep(svg) {
        width: 100% !important;
        height: 100% !important;
      }

      & :deep(path) {
        stroke: var.$color-stroke !important;
      }
    }
  }
}
</style>
