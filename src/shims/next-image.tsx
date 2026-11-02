import React from 'react'

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt?: string
  width?: number | string
  height?: number | string
  priority?: boolean
  quality?: number | string
  fill?: boolean
  unoptimized?: boolean
}

export default function Image({
  src,
  alt = '',
  width,
  height,
  className,
  style,
  priority,
  quality,
  fill,
  unoptimized,
  ...rest
}: ImageProps) {
  const mergedStyle: React.CSSProperties = {
    ...style,
    ...(fill
      ? {
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          height: '100%',
          width: '100%',
          objectFit: 'cover',
        }
      : {}),
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={mergedStyle}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...rest}
    />
  )
}
