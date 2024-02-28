import React, { useRef, useState } from "react";
import "./carousel.css";

////////////////////////////////////////////////////////// library import
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Thumbs,
  Autoplay,
  Controller,
  EffectFade,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
////////////////////////////////////////////////////////// library import

interface CarouselProps {
  pause?: boolean;
}

const Carousel = ({ pause = true, ...props }: CarouselProps) => {
  const swiperElRef = useRef(null) as any;
  const [isSwiperStop, setIsSwiperStop] = useState(false);

  const data = [
    "https://asset.dropkitchen.xyz/contents/202308_prod/20230830102558820_dk.webp",
    "https://asset.dropkitchen.xyz/contents/202308_prod/20230817130416910_dk.webp",
    "https://asset.dropkitchen.xyz/contents/202304_dev/20230405163917111_dk.webp",
    "https://asset.dropkitchen.xyz/contents/202308_prod/20230808181206566_dk.webp",
    "https://asset.dropkitchen.xyz/contents/202309_prod/20230901105942218_dk.webp",
  ];

  const pagination = {
    bulletActiveClass: `swiper-pagination-bullet-active${
      isSwiperStop ? " stop" : ""
    }`,
    el: ".swiper-custom-pagination",
    enabled: true,
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return `
      <span class="${className}">
          <img class="swiper-pagination-image" src="${data[index]}">
<svg width="50" height="50" class="progress"><rect width="50" height="50" /></svg>
      </span>
      `;
    },
  };

  return (
    <>
      <Swiper
        ref={swiperElRef}
        effect={"fade"}
        modules={[EffectFade, Pagination, Autoplay]}
        pagination={pagination}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="swiper-custom"
      >
        {data.map((item, key) => (
          <SwiperSlide key={key}>
            <img src={item} className="swiper-image" loading="lazy" />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-pagination-wrapper">
        <div className="swiper-custom-pagination"></div>
        {pause && (
          <button
            onClick={() => {
              if (isSwiperStop) {
                if (swiperElRef.current) {
                  swiperElRef.current.swiper.autoplay.start();
                  swiperElRef.current.swiper.pagination.bullets[
                    swiperElRef.current.swiper.activeIndex
                  ].classList.remove("stop");
                  swiperElRef.current.swiper.pagination.bullets[
                    swiperElRef.current.swiper.activeIndex
                  ].classList.add("swiper-pagination-bullet-active");
                }

                setIsSwiperStop(false);
              } else {
                swiperElRef.current.swiper.autoplay.stop();
                swiperElRef.current.swiper.pagination.bullets[
                  swiperElRef.current.swiper.activeIndex
                ].classList.remove("swiper-pagination-bullet-active");
                setIsSwiperStop(true);
              }
            }}
          >
            {isSwiperStop ? "play" : "pause"}
          </button>
        )}
      </div>
    </>
  );
};

export default Carousel;
