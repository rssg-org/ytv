<template>
  <aside class="sidebar" :class="{ 'compact-mode': !isOpen, 'hidden-mode': isHidden }">
    <nav class="sidebar-nav">
      <router-link to="/" class="sidebar-item" :class="{ active: isActive('/') }">
        <span class="sidebar-icon">🏠</span>
        <span class="sidebar-label">ホーム</span>
      </router-link>
      
      <router-link to="/subscriptions" class="sidebar-item" :class="{ active: isActive('/subscriptions') }">
        <span class="sidebar-icon">🔔</span>
        <span class="sidebar-label">登録チャンネル</span>
      </router-link>
      
      <router-link to="/playlists" class="sidebar-item" :class="{ active: isActive('/playlists') }">
        <span class="sidebar-icon">📋</span>
        <span class="sidebar-label">プレイリスト</span>
      </router-link>
      
      <router-link to="/history" class="sidebar-item" :class="{ active: isActive('/history') }">
        <span class="sidebar-icon">⏱️</span>
        <span class="sidebar-label">履歴</span>
      </router-link>
      
      <button 
        type="button" 
        class="sidebar-item sidebar-button" 
        @click="openSettings"
        :class="{ active: isActive('/settings') }"
      >
        <span class="sidebar-icon">⚙️</span>
        <span class="sidebar-label">設定</span>
      </button>
    </nav>
  </aside>
</template>

<script>
import { ref, computed, onMounted, watch, inject, onUnmounted, nextTick } from 'vue';

export default {
  name: 'Sidebar',
  props: {
    open: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const isOpen = ref(props.open);
    const viewportWidth = ref(window.innerWidth);
    const settingsModal = inject('settingsModal', {});
    const SIDEBAR_STATE_KEY = 'youtube_sidebar_state';

    // ビューポート幅に基づいて非表示モードかどうかを判定
    const isHidden = computed(() => {
      return viewportWidth.value < 790;
    });

    // 初期状態を設定
    const initializeState = () => {
      const width = window.innerWidth;
      if (width >= 1315) {
        isOpen.value = true;
      } else if (width >= 790) {
        isOpen.value = false; // compact
      } else {
        isOpen.value = false; // hidden on small screens (isHidden will handle display)
      }
    };

    // body クラスを更新して他のコンポーネント（SettingsView など）が
    // サイドバー状態を参照できるようにする
    const updateBodyClass = () => {
      const body = document.body;
      // determine logical state
      let state = 'open';
      if (isHidden.value) state = 'hidden';
      else if (!isOpen.value) state = 'compact';

      // update classes
      body.classList.toggle('sidebar-compact', state === 'compact');
      body.classList.toggle('sidebar-hidden', state === 'hidden');

      // update CSS variable for offset (used by SettingsView)
      const offsetMap = {
        open: '250px',
        compact: '70px',
        hidden: '0px'
      };
      const offset = offsetMap[state] || '250px';
      body.style.setProperty('--sidebar-offset', offset);

      // debug log for visibility
      console.log(`[Sidebar.vue] updateBodyClass: isOpen=${isOpen.value}, isHidden=${isHidden.value}, state=${state}, stored=${localStorage.getItem(SIDEBAR_STATE_KEY)}`);

      // persist to localStorage
      try {
        localStorage.setItem(SIDEBAR_STATE_KEY, state);
        console.log(`[Sidebar.vue] Saved to localStorage: youtube_sidebar_state=${state}`);
      } catch (e) {
        console.error('[Sidebar.vue] Failed to save to localStorage', e);
      }
    };

    const openSettings = () => {
      console.log('[Sidebar.vue] openSettings called');
      console.log('[Sidebar.vue] settingsModal object:', settingsModal);
      console.log('[Sidebar.vue] settingsModal.openSettingsModal exists:', !!settingsModal?.openSettingsModal);
      if (settingsModal?.openSettingsModal) {
        console.log('[Sidebar.vue] Calling openSettingsModal()');
        settingsModal.openSettingsModal();
      } else {
        console.warn('[Sidebar.vue] WARNING: openSettingsModal is not available');
      }
    };

    const isActive = (path) => {
      // Will be called in template, but we need the route context
      return false; // Placeholder, will use methods instead
    };

    onMounted(() => {
      // Clear localStorage sidebar state on page load - always use screen-size defaults
      try {
        localStorage.removeItem(SIDEBAR_STATE_KEY);
        console.log('[Sidebar.vue] Cleared persisted sidebar state, using screen-size defaults');
      } catch (e) {
        console.warn('[Sidebar.vue] Failed to clear sidebar state from localStorage', e);
      }

      // Initialize state based on current screen width
      initializeState();

      // Ensure updateBodyClass is called immediately and synchronously
      // to set the correct initial state in localStorage
      updateBodyClass();
      
      // Also trigger after nextTick to ensure watch handlers run
      try {
        nextTick(() => {
          updateBodyClass();
        });
      } catch (e) {
        // fallback: call synchronously
        updateBodyClass();
      }

      // ウィンドウリサイズリスナー
      const handleResize = () => {
        viewportWidth.value = window.innerWidth;
        initializeState();
        updateBodyClass();
      };
      window.addEventListener('resize', handleResize);
    });

    // propsの変更を監視
    watch(() => props.open, (newValue) => {
      isOpen.value = newValue;
    });

    // isOpen が変化したら body クラスを更新
    watch([isOpen, isHidden], () => {
      updateBodyClass();
    });

    onUnmounted(() => {
      // クリーンアップ: body のクラスを削除
      const body = document.body;
      body.classList.remove('sidebar-compact');
      body.classList.remove('sidebar-hidden');
    });

    return {
      isOpen,
      isHidden,
      viewportWidth,
      settingsModal,
      openSettings,
      isActive
    };
  },
  methods: {
    isActive(path) {
      return this.$route.path === path;
    }
  }
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 52px;
  width: 250px;
  height: calc(100vh - 52px);
  background-color: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  z-index: 10;
  transition: width 0.3s ease, height 0.3s ease;
}

/* When settings modal is open, limit sidebar height to match settings panel */
:global(body.settings-modal-open) .sidebar {
  height: auto;
  max-height: calc(100vh - 52px);
}

.sidebar.compact-mode {
  width: 70px;
}

.sidebar.hidden-mode {
  display: none;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 12px 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: var(--text-primary);
  text-decoration: none;
  transition: background-color 0.2s ease;
  border-left: 3px solid transparent;
}

.sidebar-item.sidebar-button {
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.sidebar.compact-mode .sidebar-item {
  padding: 12px;
  justify-content: center;
}

.sidebar-item:hover {
  background-color: var(--hover-bg);
}

.sidebar-item.active {
  background-color: var(--hover-bg);
  border-left-color: var(--accent-color);
  color: var(--accent-color);
  font-weight: 600;
}

.sidebar.compact-mode .sidebar-item.active {
  border-left: none;
  border-bottom: 3px solid var(--accent-color);
}

.sidebar-icon {
  margin-right: 16px;
  font-size: 20px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.sidebar.compact-mode .sidebar-icon {
  margin-right: 0;
}

.sidebar-label {
  font-size: 14px;
  white-space: nowrap;
}

.sidebar.compact-mode .sidebar-label {
  display: none;
}

@media (max-width: 1314px) {
  .sidebar {
    width: 250px;
  }

  .sidebar.compact-mode {
    width: 70px;
  }
}

@media (max-width: 789px) {
  .sidebar {
    display: none;
  }

  .sidebar.hidden-mode {
    display: none;
  }
}
</style>
