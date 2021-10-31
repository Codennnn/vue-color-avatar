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
      display: flex;
      align-items: center;
      justify-content: center;
      width: 8rem;
      height: 2.5rem;
      color: var.$color-text;
      font-weight: bold;
      font-size: 1.05rem;
      background-color: var.$color-dark;
      border-radius: 0.6rem;
      cursor: pointer;
      transition: box-shadow 0.2s, background-color 0.2s;
      user-select: none;

      &:hover {
        background-color: lighten(var.$color-dark, 2);
        box-shadow: 0 0.2rem 1.5rem 0.2rem lighten(var.$color-dark, 5);
      }

      .text {
        margin-left: 0.5rem;
      }
    }
  }
}
</style>
