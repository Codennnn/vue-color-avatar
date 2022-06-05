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

      @media (prefers-reduced-motion: no-preference) {
        transition: background-color 0.2s;

        &::before,
        &::after {
          position: absolute;
          right: 0;
          bottom: 0;
          z-index: -1;
          width: 5rem;
          height: 5rem;
          background: var.$color-text;
          border-radius: 50%;
          transform: translate(100%, -25%) translate3d(0, 0, 0);
          opacity: 0;
          transition: transform 0.15s cubic-bezier(0.02, 0.01, 0.47, 1),
            opacity 0.15s cubic-bezier(0.02, 0.01, 0.47, 1);
          content: '';
        }

        &:hover {
          background-color: darken(var.$color-dark, 3);

          &::before,
          &::after {
            opacity: 0.15;
            transition: transform 0.2s cubic-bezier(0.02, 0.01, 0.47, 1),
              opacity 0.2s cubic-bezier(0.02, 0.01, 0.47, 1);
          }

          &::before {
            transform: translate3d(50%, 0, 0) scale(0.9);
          }

          &::after {
            transform: translate(50%, 0) scale(1.1);
          }
        }
      }

      .text {
        margin-left: 0.5rem;
        letter-spacing: 0.03rem;
      }
    }
  }
}
</style>
