<script lang="ts">
  import * as Dialog from '$components/ui/dialog';
  import * as Select from '$components/ui/select';
  import { Checkbox } from '$components/ui/checkbox';
  import { Label } from '$components/ui/label';

  import SettingsIcon from 'lucide-svelte/icons/settings';
  import { setTheme, theme } from '$lib/stores/theme';
  import { setSetting, settings as settingsStore } from '$lib/stores/settings';
  import type { Settings, Theme } from '$lib/types';

  type Option = {
    category: string;
    items: {
      type: 'checkbox' | 'select';
      name: string;
      description?: string;
      placeholder?: string;
      value: any;
      disabled?: boolean;
      options?: { key: string, name: string }[];
      onChange: (value: unknown) => void;
    }[];
  }

  function getOptions($settings: typeof $settingsStore): Option[] {
    return [
      {
        category: 'General',
        items: [
          {
            type: 'checkbox',
            name: 'Quick Download',
            description: 'Download with one click from some platforms. No modal.',
            value: $settings.quickDownload,
            onChange: (value) => {
              setSetting('quickDownload', value as Settings['quickDownload']);
            }
          },
          {
            type: 'select',
            name: 'Quick Download Type',
            description: 'Select whether to download when Quick Download is enabled.',
            placeholder: 'Select download type',
            disabled: !$settings.quickDownload,
            value: $settings.quickDownloadType,
            options: [
              { key: 'video_picture', name: 'Video/Picture' },
              { key: 'audio', name: 'Audio' }
            ],
            onChange: (value) => {
              setSetting('quickDownloadType', value as Settings['quickDownloadType']);
            }
          },
          {
            type: 'select',
            name: 'Theme',
            description: 'Select the preferred theme.',
            placeholder: 'Select theme',
            value: $theme,
            options: [
              { key: 'light', name: 'Light' },
              { key: 'dark', name: 'Dark' }
            ],
            onChange: (value) => {
              setTheme(value as Theme);
            }
          }
        ]
      }
    ];
  }

  $: options = getOptions($settingsStore);
</script>

<Dialog.Root>
    <Dialog.Trigger>
        <SettingsIcon class="w-6 h-6 text-muted-foreground"/>
    </Dialog.Trigger>
    <Dialog.Content>
        <Dialog.Header class="text-start">
            <Dialog.Title>Settings</Dialog.Title>
            <Dialog.Description>Customize your experience.</Dialog.Description>
        </Dialog.Header>
        <div class="space-y-4">
            {#each options as { category, items }, optionIndex}
                <h2 class="text-lg font-semibold">{category}</h2>
                <div class="space-y-4">
                    {#each items as item, itemIndex}
                        {#if item.type === 'checkbox'}
                            <div>
                                <div class="flex items-center space-x-2">
                                    <Checkbox
                                            id="settingsCheckbox_{optionIndex}_{itemIndex}"
                                            aria-labelledby="settingsLabel_{optionIndex}_{itemIndex}"
                                            checked={item.value}
                                            on:click={e => item.onChange(e.detail.currentTarget.ariaChecked === 'false')}
                                            class="appearance-none rounded-sm bg-white data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-0"
                                    />

                                    <Label
                                            for="settingsCheckbox_{optionIndex}_{itemIndex}"
                                            id="settingsLabel_{optionIndex}_{itemIndex}"
                                            class="font-medium leading-none"
                                    >
                                        {item.name}
                                    </Label>
                                </div>
                                {#if item.description}
                                    <p class="text-xs text-muted-foreground mt-1.5">
                                        {item.description}
                                    </p>
                                {/if}
                            </div>
                        {:else if item.type === 'select'}
                            <div class="space-y-1">
                                <Label for="settingsSelect_{optionIndex}_{itemIndex}" class="font-medium">
                                    {item.name}

                                    {#if item.description}
                                        <p class="text-xs text-muted-foreground">
                                            {item.description}
                                        </p>
                                    {/if}
                                </Label>

                                <Select.Root
                                        disabled={item.disabled}
                                        selected={{ value: item.value, label: item.options && item.options.find(option => option.key === item.value)?.name }}
                                        onSelectedChange={e => e && item.onChange(e.value)}>
                                    <Select.Trigger>
                                        <Select.Value placeholder={item.placeholder}/>
                                    </Select.Trigger>
                                    <Select.Content
                                            class="bg-background transition-opacity duration-500"
                                            id="settingsSelect_{optionIndex}_{itemIndex}"
                                    >
                                        {#each item.options || [] as option}
                                            <Select.Item value={option.key}>{option.name}</Select.Item>
                                        {/each}
                                    </Select.Content>
                                </Select.Root>
                            </div>
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>
    </Dialog.Content>
</Dialog.Root>
