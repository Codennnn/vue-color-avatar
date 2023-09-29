import type { AvatarOption, AvatarSettings } from '@/types'

import {
  BeardShape,
  ClothesShape,
  EarringsShape,
  EarShape,
  EyebrowsShape,
  EyesShape,
  FaceShape,
  Gender,
  GlassesShape,
  MouthShape,
  NoseShape,
  TopsShape,
  WidgetType,
  WrapperShape,
} from '../enums'

export const AVATAR_LAYER: Readonly<{
  [key in `${WidgetType}`]: { zIndex: number }
}> = {
  [WidgetType.Face]: {
    zIndex: 10,
  },
  [WidgetType.Ear]: {
    zIndex: 102,
  },
  [WidgetType.Earrings]: {
    zIndex: 103,
  },
  [WidgetType.Eyebrows]: {
    zIndex: 70,
  },
  [WidgetType.Eyes]: {
    zIndex: 50,
  },
  [WidgetType.Nose]: {
    zIndex: 60,
  },
  [WidgetType.Glasses]: {
    zIndex: 90,
  },
  [WidgetType.Mouth]: {
    zIndex: 100,
  },
  [WidgetType.Beard]: {
    zIndex: 105,
  },
  [WidgetType.Tops]: {
    zIndex: 80,
  },
  [WidgetType.Clothes]: {
    zIndex: 110,
  },
}

export const SETTINGS: Readonly<AvatarSettings> = {
  gender: [Gender.Male, Gender.Female],

  wrapperShape: Object.values(WrapperShape),
  faceShape: Object.values(FaceShape),
  topsShape: Object.values(TopsShape),
  earShape: Object.values(EarShape),
  earringsShape: Object.values(EarringsShape),
  eyebrowsShape: Object.values(EyebrowsShape),
  eyesShape: Object.values(EyesShape),
  noseShape: Object.values(NoseShape),
  glassesShape: Object.values(GlassesShape),
  mouthShape: Object.values(MouthShape),
  beardShape: Object.values(BeardShape),
  clothesShape: Object.values(ClothesShape),

  commonColors: [
    '#6BD9E9',
    '#FC909F',
    '#F4D150',
    '#E0DDFF',
    '#D2EFF3',
    '#FFEDEF',
    '#FFEBA4',
    '#506AF4',
    '#F48150',
    '#48A99A',
    '#C09FFF',
    '#FD6F5D',
  ],

  skinColors: ['#F8D9CE', '#F9C9B6', '#DEB3A3', '#C89583', '#9C6458'],

  get backgroundColor() {
    return [
      ...this.commonColors,
      'linear-gradient(45deg, #E3648C, #D97567)',
      'linear-gradient(62deg, #8EC5FC, #E0C3FC)',
      'linear-gradient(90deg, #ffecd2, #fcb69f)',
      'linear-gradient(120deg, #a1c4fd, #c2e9fb)',
      'linear-gradient(-135deg, #fccb90, #d57eeb)',
      'transparent',
    ]
  },

  get borderColor() {
    return [...this.commonColors, 'transparent']
  },
}

export const SCREEN = {
  lg: 976,
} as const

export const NONE = 'none'

export const TRIGGER_PROBABILITY = 0.1

export const SPECIAL_AVATARS: Readonly<AvatarOption[]> = [
  {
    wrapperShape: 'squircle',
    background: {
      color: 'linear-gradient(62deg, #8EC5FC, #E0C3FC)',
      borderColor: 'transparent',
    },
    widgets: {
      face: {
        shape: FaceShape.Base,
        fillColor: '#F9C9B6',
      },
      tops: {
        shape: TopsShape.Pixie,
        fillColor: '#d2eff3',
      },
      ear: {
        shape: EarShape.Attached,
      },
      earrings: {
        shape: EarringsShape.Stud,
      },
      eyebrows: {
        shape: EyebrowsShape.Up,
      },
      eyes: {
        shape: EyesShape.Eyeshadow,
      },
      nose: {
        shape: NoseShape.Pointed,
      },
      glasses: {
        shape: NONE,
      },
      mouth: {
        shape: MouthShape.Laughing,
      },
      beard: {
        shape: NONE,
      },
      clothes: {
        shape: ClothesShape.Crew,
        fillColor: '#e0ddff',
      },
    },
  },
  {
    wrapperShape: 'squircle',
    background: {
      color: '#fd6f5d',
      borderColor: 'transparent',
    },
    widgets: {
      face: {
        shape: FaceShape.Base,
        fillColor: '#F9C9B6',
      },
      tops: {
        shape: TopsShape.Clean,
      },
      ear: {
        shape: EarShape.Attached,
      },
      earrings: {
        shape: NONE,
      },
      eyebrows: {
        shape: EyebrowsShape.Eyelashesdown,
      },
      eyes: {
        shape: EyesShape.Round,
      },
      nose: {
        shape: NoseShape.Round,
      },
      glasses: {
        shape: NONE,
      },
      mouth: {
        shape: MouthShape.Surprised,
      },
      beard: {
        shape: NONE,
      },
      clothes: {
        shape: ClothesShape.Crew,
        fillColor: '#f4d150',
      },
    },
  },
]

export const NOT_COMPATIBLE_AGENTS = [
  'quark',
  'micromessenger',
  'weibo',
  'douban',
] as const

export const DOWNLOAD_DELAY = 800

export const SHAPE_STYLE_SET = {
  [WrapperShape.Circle]: {
    borderRadius: '50%',
  },
  [WrapperShape.Square]: {
    borderRadius: '0',
  },
  [WrapperShape.Squircle]: {
    // TODO: Radius should adapt to the avatar size
    borderRadius: '25px',
  },
}
