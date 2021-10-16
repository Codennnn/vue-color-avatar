import {
  BeardShape,
  ClothesShape,
  EarringsShape,
  EarShape,
  EyebrowsShape,
  EyesShape,
  FaceShape,
  GlassesShape,
  MouthShape,
  NoseShape,
  TopsShape,
  WidgetType,
} from '../enums'

/** @internal */
type Data = Readonly<{
  [key in `${WidgetType}`]: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key in string]: () => Promise<any>
  }
}>

const widgetData: Data = {
  [WidgetType.Face]: {
    [FaceShape.Base]: () => import(`../assets/widgets/face/base.svg?raw`),
  },

  [WidgetType.Ear]: {
    [EarShape.Attached]: () => import(`../assets/widgets/ear/attached.svg?raw`),
    [EarShape.Detached]: () => import(`../assets/widgets/ear/detached.svg?raw`),
  },

  [WidgetType.Eyes]: {
    [EyesShape.Ellipse]: () => import(`../assets/widgets/eyes/ellipse.svg?raw`),
    [EyesShape.Eyeshadow]: () =>
      import(`../assets/widgets/eyes/eyeshadow.svg?raw`),
    [EyesShape.Round]: () => import(`../assets/widgets/eyes/round.svg?raw`),
    [EyesShape.Smiling]: () => import(`../assets/widgets/eyes/smiling.svg?raw`),
  },

  [WidgetType.Beard]: {
    [BeardShape.Scruff]: () => import(`../assets/widgets/beard/scruff.svg?raw`),
  },

  [WidgetType.Clothes]: {
    [ClothesShape.Collared]: () =>
      import(`../assets/widgets/clothes/collared.svg?raw`),
    [ClothesShape.Crew]: () => import(`../assets/widgets/clothes/crew.svg?raw`),
    [ClothesShape.Open]: () => import(`../assets/widgets/clothes/open.svg?raw`),
  },

  [WidgetType.Earrings]: {
    [EarringsShape.Hoop]: () =>
      import(`../assets/widgets/earrings/hoop.svg?raw`),
    [EarringsShape.Stud]: () =>
      import(`../assets/widgets/earrings/stud.svg?raw`),
  },

  [WidgetType.Eyebrows]: {
    [EyebrowsShape.Down]: () =>
      import(`../assets/widgets/eyebrows/down.svg?raw`),
    [EyebrowsShape.Eyelashesdown]: () =>
      import(`../assets/widgets/eyebrows/eyelashesdown.svg?raw`),
    [EyebrowsShape.Eyelashesup]: () =>
      import(`../assets/widgets/eyebrows/eyelashesup.svg?raw`),
    [EyebrowsShape.Up]: () => import(`../assets/widgets/eyebrows/up.svg?raw`),
  },

  [WidgetType.Glasses]: {
    [GlassesShape.Round]: () =>
      import(`../assets/widgets/glasses/round.svg?raw`),
    [GlassesShape.Square]: () =>
      import(`../assets/widgets/glasses/square.svg?raw`),
  },

  [WidgetType.Mouth]: {
    [MouthShape.Frown]: () => import(`../assets/widgets/mouth/frown.svg?raw`),
    [MouthShape.Laughing]: () =>
      import(`../assets/widgets/mouth/laughing.svg?raw`),
    [MouthShape.Nervous]: () =>
      import(`../assets/widgets/mouth/nervous.svg?raw`),
    [MouthShape.Pucker]: () => import(`../assets/widgets/mouth/pucker.svg?raw`),
    [MouthShape.Sad]: () => import(`../assets/widgets/mouth/sad.svg?raw`),
    [MouthShape.Smile]: () => import(`../assets/widgets/mouth/smile.svg?raw`),
    [MouthShape.Smirk]: () => import(`../assets/widgets/mouth/smirk.svg?raw`),
    [MouthShape.Surprised]: () =>
      import(`../assets/widgets/mouth/surprised.svg?raw`),
  },

  [WidgetType.Nose]: {
    [NoseShape.Curve]: () => import(`../assets/widgets/nose/curve.svg?raw`),
    [NoseShape.Pointed]: () => import(`../assets/widgets/nose/pointed.svg?raw`),
    [NoseShape.Round]: () => import(`../assets/widgets/nose/round.svg?raw`),
  },

  [WidgetType.Tops]: {
    [TopsShape.Beanie]: () => import(`../assets/widgets/tops/beanie.svg?raw`),
    [TopsShape.Clean]: () => import(`../assets/widgets/tops/clean.svg?raw`),
    [TopsShape.Danny]: () => import(`../assets/widgets/tops/danny.svg?raw`),
    [TopsShape.Fonze]: () => import(`../assets/widgets/tops/fonze.svg?raw`),
    [TopsShape.Funny]: () => import(`../assets/widgets/tops/funny.svg?raw`),
    [TopsShape.Pixie]: () => import(`../assets/widgets/tops/pixie.svg?raw`),
    [TopsShape.Punk]: () => import(`../assets/widgets/tops/punk.svg?raw`),
    [TopsShape.Turban]: () => import(`../assets/widgets/tops/turban.svg?raw`),
    [TopsShape.Wave]: () => import(`../assets/widgets/tops/wave.svg?raw`),
  },
}

const previewData: Data = {
  [WidgetType.Face]: {
    [FaceShape.Base]: () => import(`../assets/preview/face/base.svg?raw`),
  },

  [WidgetType.Ear]: {
    [EarShape.Attached]: () => import(`../assets/preview/ear/attached.svg?raw`),
    [EarShape.Detached]: () => import(`../assets/preview/ear/detached.svg?raw`),
  },

  [WidgetType.Eyes]: {
    [EyesShape.Ellipse]: () => import(`../assets/preview/eyes/ellipse.svg?raw`),
    [EyesShape.Eyeshadow]: () =>
      import(`../assets/preview/eyes/eyeshadow.svg?raw`),
    [EyesShape.Round]: () => import(`../assets/preview/eyes/round.svg?raw`),
    [EyesShape.Smiling]: () => import(`../assets/preview/eyes/smiling.svg?raw`),
  },

  [WidgetType.Beard]: {
    [BeardShape.Scruff]: () => import(`../assets/preview/beard/scruff.svg?raw`),
  },

  [WidgetType.Clothes]: {
    [ClothesShape.Collared]: () =>
      import(`../assets/preview/clothes/collared.svg?raw`),
    [ClothesShape.Crew]: () => import(`../assets/preview/clothes/crew.svg?raw`),
    [ClothesShape.Open]: () => import(`../assets/preview/clothes/open.svg?raw`),
  },

  [WidgetType.Earrings]: {
    [EarringsShape.Hoop]: () =>
      import(`../assets/preview/earrings/hoop.svg?raw`),
    [EarringsShape.Stud]: () =>
      import(`../assets/preview/earrings/stud.svg?raw`),
  },

  [WidgetType.Eyebrows]: {
    [EyebrowsShape.Down]: () =>
      import(`../assets/preview/eyebrows/down.svg?raw`),
    [EyebrowsShape.Eyelashesdown]: () =>
      import(`../assets/preview/eyebrows/eyelashesdown.svg?raw`),
    [EyebrowsShape.Eyelashesup]: () =>
      import(`../assets/preview/eyebrows/eyelashesup.svg?raw`),
    [EyebrowsShape.Up]: () => import(`../assets/preview/eyebrows/up.svg?raw`),
  },

  [WidgetType.Glasses]: {
    [GlassesShape.Round]: () =>
      import(`../assets/preview/glasses/round.svg?raw`),
    [GlassesShape.Square]: () =>
      import(`../assets/preview/glasses/square.svg?raw`),
  },

  [WidgetType.Mouth]: {
    [MouthShape.Frown]: () => import(`../assets/preview/mouth/frown.svg?raw`),
    [MouthShape.Laughing]: () =>
      import(`../assets/preview/mouth/laughing.svg?raw`),
    [MouthShape.Nervous]: () =>
      import(`../assets/preview/mouth/nervous.svg?raw`),
    [MouthShape.Pucker]: () => import(`../assets/preview/mouth/pucker.svg?raw`),
    [MouthShape.Sad]: () => import(`../assets/preview/mouth/sad.svg?raw`),
    [MouthShape.Smile]: () => import(`../assets/preview/mouth/smile.svg?raw`),
    [MouthShape.Smirk]: () => import(`../assets/preview/mouth/smirk.svg?raw`),
    [MouthShape.Surprised]: () =>
      import(`../assets/preview/mouth/surprised.svg?raw`),
  },

  [WidgetType.Nose]: {
    [NoseShape.Curve]: () => import(`../assets/preview/nose/curve.svg?raw`),
    [NoseShape.Pointed]: () => import(`../assets/preview/nose/pointed.svg?raw`),
    [NoseShape.Round]: () => import(`../assets/preview/nose/round.svg?raw`),
  },

  [WidgetType.Tops]: {
    [TopsShape.Beanie]: () => import(`../assets/preview/tops/beanie.svg?raw`),
    [TopsShape.Clean]: () => import(`../assets/preview/tops/clean.svg?raw`),
    [TopsShape.Danny]: () => import(`../assets/preview/tops/danny.svg?raw`),
    [TopsShape.Fonze]: () => import(`../assets/preview/tops/fonze.svg?raw`),
    [TopsShape.Funny]: () => import(`../assets/preview/tops/funny.svg?raw`),
    [TopsShape.Pixie]: () => import(`../assets/preview/tops/pixie.svg?raw`),
    [TopsShape.Punk]: () => import(`../assets/preview/tops/punk.svg?raw`),
    [TopsShape.Turban]: () => import(`../assets/preview/tops/turban.svg?raw`),
    [TopsShape.Wave]: () => import(`../assets/preview/tops/wave.svg?raw`),
  },
}

export { previewData, widgetData }
