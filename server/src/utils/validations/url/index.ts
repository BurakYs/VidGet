export default function urlValidation(url: string) {
  const urlRegex = new RegExp('https://[a-z0-9-]+(.[a-z0-9-]+)+([/?].*)?$');
  if (!urlRegex.test(url)) throw new Error('Invalid URL');

  return true;
}
