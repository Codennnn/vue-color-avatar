import { computed } from 'vue'

import { useStore } from '@/store'
import { SET_AVATAR_OPTION } from '@/store/mutation-type'
import type { AvatarOption } from '@/types'

export function useAvatarOption() {
  const store = useStore()

  const avatarOption = computed(() => store.history.present)

  const setAvatarOption = (newOption: AvatarOption) => {
    store[SET_AVATAR_OPTION](newOption)
  }

  return [avatarOption, setAvatarOption] as const
}
