<script setup lang="ts">
import PhotoSwipe from 'photoswipe';
import { onBeforeUnmount, reactive, shallowRef, watch } from 'vue';

export interface ViewerItem {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}

type HostName = 'actions' | 'footer' | 'panel';

const HOSTS: { name: HostName; appendTo: 'bar' | 'root' }[] = [
  { name: 'actions', appendTo: 'bar' },
  { name: 'footer', appendTo: 'root' },
  { name: 'panel', appendTo: 'root' },
];
const PANEL_OPEN_CLASS = 'pswp--panel-open';
const WIDE_SCREEN_QUERY = '(min-width: 801px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const icon = (name: string) => `<span class="icon icon--${name}"></span>`;

const { items, index, panelOpen } = defineProps<{
  items: ViewerItem[];
  index: number | null;
  panelOpen?: boolean;
}>();

const emit = defineEmits<{ change: [index: number]; close: [] }>();

const instance = shallowRef<PhotoSwipe | null>(null);
const hosts = reactive<Record<HostName, HTMLElement | null>>({
  actions: null,
  footer: null,
  panel: null,
});

function cssToken(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function isTyping(event: Event) {
  return (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement
  );
}

function slidePadding() {
  const bar = parseFloat(cssToken('--viewer-bar-height'));
  const showsSidePanel = panelOpen && matchMedia(WIDE_SCREEN_QUERY).matches;
  const panel = showsSidePanel ? parseFloat(cssToken('--panel-width')) : 0;
  return { top: bar, bottom: bar, left: 0, right: panel };
}

function thumbnailOf(id: string) {
  return (
    document.querySelector<HTMLElement>(`[data-viewer-id="${id}"]`) ?? undefined
  );
}

function createInstance(startIndex: number) {
  const reducedMotion = matchMedia(REDUCED_MOTION_QUERY).matches;
  return new PhotoSwipe({
    dataSource: items.map(({ id, src, width, height, alt }) => ({
      src,
      msrc: src,
      width,
      height,
      alt,
      element: thumbnailOf(id),
    })),
    index: startIndex,
    bgOpacity: 1,
    zoom: false,
    counter: false,
    closeSVG: icon('close'),
    arrowPrevSVG: icon('chevron-left'),
    arrowNextSVG: icon('chevron-right'),
    paddingFn: slidePadding,
    showHideAnimationType: reducedMotion ? 'none' : 'zoom',
    easing: cssToken('--ease-out'),
  });
}

function registerHosts(pswp: PhotoSwipe) {
  pswp.on('uiRegister', () => {
    for (const host of HOSTS) {
      pswp.ui?.registerElement({
        name: host.name,
        appendTo: host.appendTo,
        onInit: (element) => {
          hosts[host.name] = element;
        },
      });
    }
  });
}

function bindEvents(pswp: PhotoSwipe) {
  pswp.on('keydown', (event) => {
    if (isTyping(event.originalEvent)) event.preventDefault();
  });
  pswp.on('change', () => {
    emit('change', pswp.currIndex);
  });
  pswp.on('destroy', () => {
    hosts.actions = null;
    hosts.footer = null;
    hosts.panel = null;
    instance.value = null;
    emit('close');
  });
}

function open(startIndex: number) {
  const pswp = createInstance(startIndex);
  registerHosts(pswp);
  bindEvents(pswp);
  pswp.init();
  instance.value = pswp;
}

watch(
  () => index,
  (next) => {
    if (next !== null && !instance.value) open(next);
  },
  { immediate: true },
);

function flipFrom(element: HTMLElement, before: DOMRect) {
  const after = element.getBoundingClientRect();
  if (!after.width || !after.height) return;
  const dx = before.left - after.left;
  const dy = before.top - after.top;
  const sx = before.width / after.width;
  const sy = before.height / after.height;
  element.animate(
    [
      {
        transformOrigin: 'top left',
        transform: `translate(${String(dx)}px, ${String(dy)}px) scale(${String(sx)}, ${String(sy)})`,
      },
      { transformOrigin: 'top left', transform: 'none' },
    ],
    {
      duration: parseFloat(cssToken('--duration-slow')),
      easing: cssToken('--ease-out'),
    },
  );
}

function resizeSmoothly(pswp: PhotoSwipe, isPanelOpen: boolean) {
  const image = pswp.currSlide?.content.element;
  const before = image?.getBoundingClientRect();
  pswp.element?.classList.toggle(PANEL_OPEN_CLASS, isPanelOpen);
  pswp.updateSize(true);
  if (image && before && !matchMedia(REDUCED_MOTION_QUERY).matches) {
    flipFrom(image, before);
  }
}

watch(
  () => panelOpen,
  (isOpen) => {
    if (instance.value) resizeSmoothly(instance.value, isOpen);
  },
);

onBeforeUnmount(() => {
  instance.value?.destroy();
});
</script>

<template>
  <Teleport v-if="hosts.actions" :to="hosts.actions">
    <slot name="actions" />
  </Teleport>
  <Teleport v-if="hosts.footer" :to="hosts.footer">
    <slot name="footer" />
  </Teleport>
  <Teleport v-if="hosts.panel" :to="hosts.panel">
    <Transition name="viewer-panel">
      <slot name="panel" />
    </Transition>
  </Teleport>
</template>
