export default function Image({ src, ...rest }) {
    src = src && src.includes('https://')
        ? src
        : 'https://villa-vista.onrender.com/uploads/' + src;
    return (
        <img {...rest} src={src} alt={''} />
    );
}
