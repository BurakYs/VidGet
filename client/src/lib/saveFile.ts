import type { Writable } from 'svelte/store';

type DownloadingStore = Writable<Array<{ url: string, isDownloading: boolean }>>;

function changeDownloadingStatus(url: string, downloadingStore: DownloadingStore, isDownloading: boolean) {
  downloadingStore.update((downloading) => {
    const index = downloading.findIndex((item) => item.url === url);
    if (index < 0) {
      downloading.push({ url, isDownloading });
    } else {
      downloading[index].isDownloading = isDownloading;
    }

    return downloading;
  });
}

export default async function saveFile(url: string, filename?: string, downloadingStore?: DownloadingStore) {
  if (downloadingStore) changeDownloadingStatus(url, downloadingStore, true);

  const response = await fetch(url);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = blobUrl;
  anchor.download = (filename || url.split('/').pop()!).split('?')[0];
  anchor.click();
  URL.revokeObjectURL(blobUrl);
  anchor.remove();

  if (downloadingStore) changeDownloadingStatus(url, downloadingStore, false);
}