<template>
  <header class="header">
    <Logo />

    <h2 class="site-title">Color Avatar</h2>

    <div class="header-right">
      <a
        href="https://github.com/Codennnn/vue-color-avatar"
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        <button
          type="button"
          class="github-button"
          @click="
            recordEvent('click_github', {
              event_category: 'click',
            })
          "
        >
          <img :src="IconGitHub" alt="GitHub" />
          <span class="text">GitHub</span>
        </button>
      </a>
    </div>
  </header>
</template>

<script lang="ts" setup>
import IconGitHub from '@/assets/icons/icon-github.svg'
import Logo from '@/components/Logo.vue'
import { recordEvent } from '@/utils/ga'
</script>

<style lang="scss" scoped>
@use 'src/styles/var';

.header {
  display: flex;
  align-items: center;
  height: var.$layout-header-height;
  padding: 1rem 2rem;

  .site-title {
    margin-left: 1rem;
    font-weight: bold;
    font-size: 1.9rem;
    cursor: default;

    @media screen and (max-width: var.$screen-sm) {
      display: none;
    }
  }

  .header-right {
    margin-left: auto;

    .github-button {
      position: relative;
      z-index: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 9rem;
      height: 2.6rem;
      overflow: hidden;
      color: var.$color-text;
      font-weight: bold;
      font-size: 1.05rem;
      background-color: var.$color-dark;
      border-radius: 0.6rem;
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: darken(var.$color-dark, 3);
      }

      .text {
        margin-left: 0.5rem;
        letter-spacing: 0.03rem;
      }
    }
  }
}
</style>
