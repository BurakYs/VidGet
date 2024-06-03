<script lang="ts">
    import { dotNotation } from '$lib';

    export let details: Record<string, any>;
    export let key: string;
    export let text: string;

    $: value = dotNotation<string>(details, key);
</script>

<a href={value} target="_blank">
    <button
            class="bg-primary-button text-white flex items-center justify-center py-3 px-6 rounded-xl mt-2 w-40 h-10 mb-2 disabled:opacity-50"
            disabled={!value}
    >
        {text}
    </button>
</a>