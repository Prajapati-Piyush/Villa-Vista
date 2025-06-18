export default function Image({ src, ...rest }) {
  const isFullUrl = src?.startsWith("http://") || src?.startsWith("https://");

  const backendBaseUrl = import.meta.env.MODE === 'development'
    ? 'http://localhost:3000'
    : 'https://villa-vista-backend.onrender.com';

  const finalSrc = isFullUrl ? src : `${backendBaseUrl}/uploads/${src}`;

  return <img {...rest} src={finalSrc} alt="" />;
}
