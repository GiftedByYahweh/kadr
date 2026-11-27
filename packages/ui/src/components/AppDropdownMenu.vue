<script setup lang="ts" generic="T extends string">
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui';

const { items, label, icon } = defineProps<{
  items: { value: T; label: string; danger: boolean; separated: boolean }[];
  label: string;
  icon: string;
}>();

const emit = defineEmits<{ select: [value: T] }>();
</script>

<template>
  <DropdownMenuRoot :modal="false">
    <DropdownMenuTrigger
      class="btn btn--icon"
      :aria-label="label"
      :title="label"
    >
      <span class="icon icon--s" :class="icon" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent class="dropdown-menu" align="end" :side-offset="4">
        <template v-for="item in items" :key="item.value">
          <DropdownMenuSeparator
            v-if="item.separated"
            class="dropdown-menu__separator"
          />
          <DropdownMenuItem
            class="dropdown-menu__item"
            :class="{ 'dropdown-menu__item--danger': item.danger }"
            @select="emit('select', item.value)"
          >
            {{ item.label }}
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
