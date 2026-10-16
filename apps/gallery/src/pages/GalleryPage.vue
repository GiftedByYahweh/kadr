<script setup lang="ts">
import { onMounted } from 'vue';
import GalleryGrid from '../components/widgets/GalleryGrid.vue';
import GalleryHero from '../components/widgets/GalleryHero.vue';
import GalleryToolbar from '../components/widgets/GalleryToolbar.vue';
import GalleryViewer from '../components/widgets/GalleryViewer.vue';
import { useGallery } from '../composables/useGallery.ts';

const { gallery, load } = useGallery();

onMounted(load);
</script>

<template>
  <template v-if="gallery">
    <GalleryHero
      :title="gallery.title"
      :subtitle="gallery.subtitle"
      :cover-url="gallery.coverUrl"
    />
    <GalleryToolbar id="photos" />
    <main class="page page--wide">
      <GalleryGrid />
    </main>
    <GalleryViewer />
  </template>
</template>
