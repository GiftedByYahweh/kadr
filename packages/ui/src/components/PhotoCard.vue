<script setup lang="ts">
import { ref } from 'vue';

type PhotoCardShape = 'natural' | 'portrait' | 'square';

const {
  shape = 'natural',
  caption = '',
  ratio = 0,
} = defineProps<{
  src: string;
  alt: string;
  shape?: PhotoCardShape;
  caption?: string;
  ratio?: number;
}>();

const loaded = ref(false);
</script>

<template>
  <figure class="photo-card" :class="`photo-card--${shape}`">
    <div
      class="photo-card__frame"
      :style="ratio ? { aspectRatio: ratio } : undefined"
    >
      <img
        class="photo-card__image"
        :class="{ 'photo-card__image--loaded': loaded }"
        :src="src"
        :alt="alt"
        loading="lazy"
        @load="loaded = true"
      />
      <div v-if="$slots['default']" class="photo-card__overlay">
        <slot />
      </div>
    </div>
    <figcaption v-if="caption" class="photo-card__caption">
      {{ caption }}
    </figcaption>
  </figure>
</template>
