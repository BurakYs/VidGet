<script lang="ts">
    import Toast from '$components/Toast/Toast.svelte';
    import { toasts } from '$stores/toastStore'
</script>

{#each $toasts as toast (toast.id)}
    <Toast message={toast.message} type={toast.type} />
{/each}