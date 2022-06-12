import { type InjectionKey } from 'vue'
import { type Store, createStore, useStore as baseUseStore } from 'vuex'

import { WrapperShape } from '@/enums'
import type { AvatarOption } from '@/types'
import { getRandomAvatarOption } from '@/utils'
import { SCREEN } from '@/utils/constant'

import {
  REDO,
  SET_AVATAR_OPTION,
  SET_SIDER_STATUS,
  UNDO,
} from './mutation-type'

export interface State {
  history: {
    past: AvatarOption[]
    present: AvatarOption
    future: AvatarOption[]
  }
  isSiderCollapsed: boolean
}

export default createStore<State>({
  strict: true,

  state: {
    history: {
      past: [],
      present: getRandomAvatarOption({ wrapperShape: WrapperShape.Squircle }),
      future: [],
    },
    isSiderCollapsed: window.innerWidth <= SCREEN.lg,
  },

  mutations: {
    [SET_AVATAR_OPTION](state, data: AvatarOption) {
      state.history = {
        past: [...state.history.past, state.history.present],
        present: data,
        future: [],
      }
    },

    [UNDO](state) {
      if (state.history.past.length > 0) {
        const previous = state.history.past[state.history.past.length - 1]
        const newPast = state.history.past.slice(
          0,
          state.history.past.length - 1
        )
        state.history = {
          past: newPast,
          present: previous,
          future: [state.history.present, ...state.history.future],
        }
      }
    },

    [REDO](state) {
      if (state.history.future.length > 0) {
        const next = state.history.future[0]
        const newFuture = state.history.future.slice(1)
        state.history = {
          past: [...state.history.past, state.history.present],
          present: next,
          future: newFuture,
        }
      }
    },

    [SET_SIDER_STATUS](state, collapsed) {
      if (collapsed !== state.isSiderCollapsed) {
        state.isSiderCollapsed = collapsed
      }
    },
  },
})

export const storeKey: InjectionKey<Store<State>> = Symbol()

export function useStore() {
  return baseUseStore(storeKey)
}
