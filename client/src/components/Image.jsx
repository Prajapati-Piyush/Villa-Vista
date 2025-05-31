export default function Image({ src, ...rest }) {
    src = src && src.includes('https://')
        ? src
        : 'https://backend-k9y6.onrender.com/uploads/' + src;
    return (
        <img {...rest} src={src} alt={''} />
    );
}
