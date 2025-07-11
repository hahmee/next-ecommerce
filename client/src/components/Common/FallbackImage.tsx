'use client';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

type Props = Omit<ImageProps, 'src'> & {
  src: string | undefined;
  fallbackSrc: string;
};

const FallbackImage = ({ src, fallbackSrc, alt, ...rest }: Props) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};

export default FallbackImage;
