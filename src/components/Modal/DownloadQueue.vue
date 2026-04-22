<template>
  <transition name="slide">
    <div v-if="props.visible" class="download-queue">
      <div class="queue-header">
        <div class="header-title">
          <span class="title">{{ t('text.downloadQueue') }}</span>
          <span class="count">({{ queue.length }} {{ t('text.items') }})</span>
        </div>
        <button type="button" class="close-btn" @click="emit('close')">
          <img :src="IconClose" alt="close" />
        </button>
      </div>

      <div class="queue-body">
        <PerfectScrollbar
          style="height: 100%; overflow: hidden"
          :options="{ suppressScrollX: true }"
        >
          <div class="queue-items">
            <template v-for="item in queue" :key="item.id">
              <div class="queue-item" :class="getItemStatusClass(item.status)">
                <div class="item-thumbnail">
                  <img
                    :src="item.thumbnail"
                    :alt="item.fileName"
                    class="thumbnail-img"
                  />
                  <div class="status-indicator">
                    <template v-if="item.status === 'processing'">
                      <div class="spinner"></div>
                    </template>
                    <template v-else-if="item.status === 'completed'">
                      <span class="status-icon completed">✓</span>
                    </template>
                    <template v-else-if="item.status === 'cancelled'">
                      <span class="status-icon cancelled">×</span>
                    </template>
                    <template v-else-if="item.status === 'error'">
                      <span class="status-icon error">!</span>
                    </template>
                  </div>
                </div>

                <div class="item-info">
                  <div class="item-name">{{ item.fileName }}</div>
                  <div class="item-status">
                    {{ getStatusText(item.status) }}
                  </div>
                  <div v-if="item.status === 'processing'" class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: `${item.progress}%` }"
                    ></div>
                  </div>
                </div>

                <div class="item-actions">
                  <template
                    v-if="
                      item.status === 'pending' || item.status === 'processing'
                    "
                  >
                    <button
                      type="button"
                      class="action-btn cancel-btn"
                      :title="t('action.cancel')"
                      @click="emit('cancel', item.id)"
                    >
                      {{ t('action.cancel') }}
                    </button>
                  </template>
                  <template
                    v-else-if="
                      item.status === 'cancelled' || item.status === 'error'
                    "
                  >
                    <button
                      type="button"
                      class="action-btn retry-btn"
                      :title="t('action.retry')"
                      @click="emit('retry', item.id)"
                    >
                      {{ t('action.retry') }}
                    </button>
                  </template>
                  <template v-else-if="item.status === 'completed'">
                    <span class="completed-badge">{{
                      t('text.completed')
                    }}</span>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </PerfectScrollbar>
      </div>

      <div class="queue-footer">
        <div class="footer-stats">
          <span class="stat completed">
            {{ completedCount }} {{ t('text.completed') }}
          </span>
          <span class="stat remaining">
            {{ remainingCount }} {{ t('text.remaining') }}
          </span>
        </div>
        <div class="footer-actions">
          <button
            v-if="hasPendingOrProcessing"
            type="button"
            class="footer-btn cancel-all-btn"
            @click="emit('cancelAll')"
          >
            {{ t('action.cancelAll') }}
          </button>
          <button
            v-if="hasCompleted"
            type="button"
            class="footer-btn close-btn"
            @click="emit('close')"
          >
            {{ t('action.close') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import IconClose from '@/assets/icons/icon-close.svg'
import PerfectScrollbar from '@/components/PerfectScrollbar.vue'
import type { DownloadQueueItem, DownloadStatus } from '@/types'

const props = defineProps<{
  visible?: boolean
  queue: DownloadQueueItem[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'cancel', id: string): void
  (e: 'retry', id: string): void
  (e: 'cancelAll'): void
}>()

const { t } = useI18n()

const completedCount = computed(() => {
  return props.queue.filter((item) => item.status === 'completed').length
})

const remainingCount = computed(() => {
  return props.queue.filter((item) =>
    ['pending', 'processing'].includes(item.status)
  ).length
})

const hasPendingOrProcessing = computed(() => {
  return props.queue.some((item) =>
    ['pending', 'processing'].includes(item.status)
  )
})

const hasCompleted = computed(() => {
  return completedCount.value > 0 && remainingCount.value === 0
})

function getItemStatusClass(status: DownloadStatus): string {
  return `status-${status}`
}

function getStatusText(status: DownloadStatus): string {
  const statusMap: Record<DownloadStatus, string> = {
    pending: t('text.pending'),
    processing: t('text.downloading'),
    completed: t('text.completed'),
    cancelled: t('text.cancelled'),
    error: t('text.error'),
  }
  return statusMap[status]
}
</script>

<style lang="scss" scoped>
@use 'src/styles/var';

.slide-enter-active,
.slide-leave-active {
  @media (prefers-reduced-motion: no-preference) {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.download-queue {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  width: 22rem;
  height: 100vh;
  background-color: lighten(var.$color-dark, 2);
  box-shadow: -0.2rem 0 2rem rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;

  .queue-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    background-color: lighten(var.$color-dark, 5);
    border-bottom: 1px solid lighten(var.$color-dark, 8);

    .header-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .title {
        color: var.$color-text;
        font-weight: bold;
        font-size: 1rem;
      }

      .count {
        color: var.$color-accent;
        font-size: 0.85rem;
      }
    }

    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      background-color: transparent;
      border: none;
      cursor: pointer;
      border-radius: 0.25rem;
      transition: background-color 0.2s;

      &:hover {
        background-color: lighten(var.$color-dark, 10);
      }

      img {
        width: 1rem;
        height: 1rem;
        filter: brightness(0.7);
      }
    }
  }

  .queue-body {
    flex: 1;
    overflow: hidden;

    .queue-items {
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .queue-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background-color: lighten(var.$color-dark, 5);
        border-radius: 0.5rem;
        transition: background-color 0.2s;

        &.status-completed {
          background-color: rgba(var.$color-secondary, 0.1);
          border-left: 0.2rem solid var.$color-secondary;
        }

        &.status-cancelled {
          opacity: 0.6;
        }

        &.status-error {
          background-color: rgba(255, 100, 100, 0.1);
          border-left: 0.2rem solid hsl(0, 70%, 60%);
        }

        .item-thumbnail {
          position: relative;
          width: 3rem;
          height: 3rem;
          flex-shrink: 0;

          .thumbnail-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 0.3rem;
            background-color: lighten(var.$color-dark, 8);
          }

          .status-indicator {
            position: absolute;
            top: -0.25rem;
            right: -0.25rem;
            width: 1.25rem;
            height: 1.25rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            .spinner {
              width: 1rem;
              height: 1rem;
              border: 2px solid rgba(var.$color-accent, 0.3);
              border-top-color: var.$color-accent;
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
            }

            .status-icon {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              font-size: 0.75rem;
              font-weight: bold;

              &.completed {
                background-color: var.$color-secondary;
                color: #fff;
              }

              &.cancelled {
                background-color: var.$color-gray;
                color: var.$color-text;
              }

              &.error {
                background-color: hsl(0, 70%, 60%);
                color: #fff;
              }
            }
          }
        }

        .item-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;

          .item-name {
            color: var.$color-text;
            font-size: 0.85rem;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .item-status {
            color: var.$color-text;
            font-size: 0.75rem;
            opacity: 0.7;
          }

          .progress-bar {
            width: 100%;
            height: 0.25rem;
            background-color: lighten(var.$color-dark, 10);
            border-radius: 0.125rem;
            overflow: hidden;

            .progress-fill {
              height: 100%;
              background-color: var.$color-accent;
              border-radius: 0.125rem;
              transition: width 0.1s ease;
            }
          }
        }

        .item-actions {
          flex-shrink: 0;

          .action-btn {
            padding: 0.3rem 0.75rem;
            font-size: 0.75rem;
            border-radius: 0.3rem;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s, color 0.2s;

            &.cancel-btn {
              color: var.$color-text;
              background-color: lighten(var.$color-dark, 8);

              &:hover {
                background-color: lighten(var.$color-dark, 12);
              }
            }

            &.retry-btn {
              color: #fff;
              background-color: var.$color-accent;

              &:hover {
                background-color: lighten(var.$color-accent, 5);
              }
            }
          }

          .completed-badge {
            padding: 0.3rem 0.75rem;
            font-size: 0.75rem;
            color: var.$color-secondary;
            background-color: rgba(var.$color-secondary, 0.15);
            border-radius: 0.3rem;
          }
        }
      }
    }
  }

  .queue-footer {
    padding: 0.75rem 1rem;
    background-color: lighten(var.$color-dark, 5);
    border-top: 1px solid lighten(var.$color-dark, 8);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .footer-stats {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .stat {
        font-size: 0.8rem;
        color: var.$color-text;

        &.completed {
          color: var.$color-secondary;
        }

        &.remaining {
          opacity: 0.7;
        }
      }
    }

    .footer-actions {
      display: flex;
      gap: 0.5rem;

      .footer-btn {
        padding: 0.4rem 0.9rem;
        font-size: 0.8rem;
        border-radius: 0.4rem;
        border: none;
        cursor: pointer;
        transition: background-color 0.2s, color 0.2s;

        &.cancel-all-btn {
          color: var.$color-text;
          background-color: lighten(var.$color-dark, 8);

          &:hover {
            background-color: lighten(var.$color-dark, 12);
          }
        }

        &.close-btn {
          color: #fff;
          background-color: var.$color-accent;

          &:hover {
            background-color: lighten(var.$color-accent, 5);
          }
        }
      }
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
