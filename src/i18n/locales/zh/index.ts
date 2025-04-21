import { WidgetType } from '@/enums'

export const zh = {
  action: {
    undo: '撤销',
    redo: '还原',
    flip: '水平翻转',
    code: '配置代码',
    randomize: '随机生成',
    download: '下载头像',
    downloadMultiple: '批量生成',
    copyCode: '复制代码',
    copied: '已复制',
    downloading: '准备下载',
    close: '关闭',
  },
  label: {
    wrapperShape: '头像形状',
    borderColor: '边框颜色',
    backgroundColor: '背景颜色',
    colors: '颜色',
  },
  widgetType: {
    [WidgetType.Face]: '脸蛋',
    [WidgetType.Tops]: '头发 / 头饰',
    [WidgetType.Ear]: '耳朵',
    [WidgetType.Earrings]: '耳环',
    [WidgetType.Eyebrows]: '眉毛',
    [WidgetType.Eyes]: '眼睛',
    [WidgetType.Nose]: '鼻子',
    [WidgetType.Glasses]: '眼镜',
    [WidgetType.Mouth]: '嘴巴',
    [WidgetType.Beard]: '胡子',
    [WidgetType.Clothes]: '衣着',
  },
  wrapperShape: {
    circle: '圆形',
    square: '方形',
    squircle: '方圆形',
  },
  text: {
    codeModalTitle: '配置代码',
    downloadTip: '长按图片或右键点击下载至本地相册',
    downloadMultiple: '下载全部',
    downloadingMultiple: '正在下载',
    downloadMultipleTip: '已为你自动生成头像',
    regenerate: '换一批',
  },
}
