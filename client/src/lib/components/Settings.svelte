<script lang="ts">
  import * as Dialog from '$components/ui/dialog';
  import * as Select from '$components/ui/select';
  import { Checkbox } from '$components/ui/checkbox';
  import { Label } from '$components/ui/label';

  import SettingsIcon from 'lucide-svelte/icons/settings';

  import { setTheme, theme } from '$lib/stores/theme';
  import { setSetting, settings } from '$lib/stores/settings';
  import type { Settings, Theme } from '$lib/types';

  type Option = {
    category: string;
    items: {
      type: 'checkbox' | 'select';
      name: string;
      description?: string;
      placeholder?: string;
      value: any;
      options?: { key: string, name: string }[];
      onChange: (value: unknown) => unknown;
    }[];
  }

  let options = $derived([
    {
      category: 'General',
      items: [
        {
          type: 'select',
          name: 'Quick Download',
          description: 'Select whether to download without seeing a modal on some platforms.',
          placeholder: 'Select download type',
          value: $settings.quickDownloadType,
          options: [
            { key: 'off', name: 'Off' },
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
    },
    {
      category: 'Preferences',
      items: [
        {
          type: 'checkbox',
          name: 'Send Anonymous Data',
          description: 'Help us improve by sending anonymous data. See our <strong><a href="/legal/privacy" class="hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a></strong>.',
          value: $settings.sendAnonymousData,
          onChange: (value) => {
            setSetting('sendAnonymousData', value as Settings['sendAnonymousData']);
          }
        },
        {
          type: 'checkbox',
          name: 'Reduced Motion',
          description: 'Disable animations and transitions for a better performance.',
          value: $settings.reducedMotion,
          onChange: (value) => {
            setSetting('reducedMotion', value as Settings['reducedMotion']);
          }
        }
      ]
    }
  ] satisfies Option[]);
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <SettingsIcon class="!size-6 text-muted-foreground"/>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header class="text-start">
      <Dialog.Title>Settings</Dialog.Title>
      <Dialog.Description>Customize your experience.</Dialog.Description>
    </Dialog.Header>
    {#each options as { category, items }, optionIndex}
      <div class="space-y-2">
        <h2 class="text-lg font-semibold">{category}</h2>
        <div class="space-y-4">
          <!-- eslint-disable svelte/no-at-html-tags -->
          {#each items as item, itemIndex}
            {#if item.type === 'checkbox'}
              <div class="flex items-start">
                <Checkbox
                  id="settingsCheckbox_{optionIndex}_{itemIndex}"
                  aria-labelledby="settingsLabel_{optionIndex}_{itemIndex}"
                  checked={item.value}
                  onclick={() =>
                    item.onChange(
                      !item.value
                    )}
                  class="appearance-none rounded-sm bg-white data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-0"
                />
                <Label
                  for="settingsCheckbox_{optionIndex}_{itemIndex}"
                  id="settingsLabel_{optionIndex}_{itemIndex}"
                  class="ml-2 font-medium leading-none"
                >
                  {item.name}
                  {#if item.description}
                    <p class="text-xs text-muted-foreground">
                      {@html item.description}
                    </p>
                  {/if}
                </Label>
              </div>
            {:else if item.type === 'select'}
              <div class="space-y-1">
                <Label
                  for="settingsSelect_{optionIndex}_{itemIndex}"
                  class="font-medium"
                >
                  {item.name}

                  {#if item.description}
                    <p class="text-xs text-muted-foreground">
                      {@html item.description}
                    </p>
                  {/if}
                </Label>

                <Select.Root
                  value={item.value}
                  onValueChange={e => e && item.onChange(e)}
                  type="single">
                  <Select.Trigger placeholder={item.placeholder}>
                    {item.options && item.options.find(option => option.key === item.value)?.name}
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
      </div>
    {/each}
  </Dialog.Content>
</Dialog.Root>
