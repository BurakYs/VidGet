type DownloadingStore = Array<{ url: string, isDownloading: boolean }>;

export default async function saveFile(url: string, filename?: string, downloadingStore?: DownloadingStore) {
  changeDownloadingStatus(url, true, downloadingStore);

  const response = await fetch(url).catch(() => null);

  if (!response?.ok) {
    changeDownloadingStatus(url, false, downloadingStore);
    return;
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = blobUrl;
  anchor.download = (filename || url.split('/').pop()!).split('?')[0];
  anchor.click();
  URL.revokeObjectURL(blobUrl);
  anchor.remove();

  changeDownloadingStatus(url, false, downloadingStore);
}

function changeDownloadingStatus(url: string, isDownloading: boolean, downloadingStore?: DownloadingStore) {
  if (!downloadingStore) return;

  const index = downloadingStore.findIndex((item) => item.url === url);
  if (index < 0) {
    downloadingStore.push({ url, isDownloading });
  } else {
    downloadingStore[index].isDownloading = isDownloading;
  }
}