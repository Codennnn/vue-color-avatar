import { computed } from 'vue'

import { useStore } from '@/store'
import { SET_AVATAR_OPTION } from '@/store/mutation-type'
import { type AvatarOption } from '@/types'

export default function useAvatarOption() {
  const store = useStore()

  const avatarOption = computed(() => store.state.history.present)

  const setAvatarOption = (newOption: AvatarOption) => {
    store.commit(SET_AVATAR_OPTION, newOption)
  }

  return [avatarOption, setAvatarOption] as const
}
