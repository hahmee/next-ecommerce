'use client';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

type Props = Omit<ImageProps, 'src'> & {
  src: string | undefined;
  fallbackSrc: string;
  index: number;
};

const FallbackImage = ({ src, fallbackSrc, alt, index, ...rest }: Props) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      priority={index < 2} // 첫 번째, 두번째 이미지에만 preload
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};

export default FallbackImage;
