<script setup lang="ts">
import { onMounted } from 'vue';
import GalleryGrid from '../components/widgets/GalleryGrid.vue';
import GalleryHero from '../components/widgets/GalleryHero.vue';
import GallerySelectionBar from '../components/widgets/GallerySelectionBar.vue';
import GalleryToolbar from '../components/widgets/GalleryToolbar.vue';
import GalleryViewer from '../components/widgets/GalleryViewer.vue';
import { useGallery } from '../composables/useGallery.ts';

const { gallery, likedMedia, load } = useGallery();

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
    <main
      class="gallery-main page page--wide"
      :class="{ 'gallery-main--with-bar': likedMedia.length }"
    >
      <GalleryGrid />
    </main>
    <GallerySelectionBar />
    <GalleryViewer />
  </template>
</template>

<style scoped>
@media (max-width: 800px) {
  .gallery-main--with-bar {
    padding-bottom: calc(var(--selection-bar-height) + var(--space-3));
  }
}
</style>
