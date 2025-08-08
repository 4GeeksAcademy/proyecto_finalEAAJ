export const Icosahedron = () => {//Adaptación de "https://codepen.io/scriptraccoon/pen/ZEmgwwQ"
  return (
    <div className="icosahedron container-fluid d-flex justify-content-between align-items-center">
        <style>
            {`@use "sass:math";

            // mixins

            @mixin flex-center() {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            @mixin visually-hidden() {
                position: absolute;
                left: -100vh;
                width: 1px;
                height: 1px;
                overflow: hidden;
            }

            // global stuff

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                @include flex-center();
                background-color: white;
                font-family: Segoe UI, sans-serif;
                min-height: 100vh;
                overflow: hidden;
            }

            .scene {
                perspective: 80rem;
                transition: perspective 1200ms ease-in-out;
                * {
                    position: absolute;
                    transform-style: preserve-3d;
                }
            }

            // icosahedron

            .icosahedron {
                @include flex-center();
                $duration: 70s;
                $rx: -30deg;
                animation: rotate $duration linear infinite;

                @keyframes rotate {
                    from {
                        transform: rotateX($rx) rotateY(0turn) rotateZ(0turn);
                    }
                    to {
                        transform: rotateX($rx) rotateY(2turn) rotateZ(-1turn);
                    }
                }
            }

            // triangles of icosahedron

            .triangle {
                $width: 7rem;
                $height: 0.5 * math.sqrt(3) * $width;
                $height2: $height - 0.0175 * $width;
                $radius: 1/ (2 * math.sqrt(5 - math.sqrt(20))) * $width;
                $angle: 72deg;
                $tilt: -10.54deg;
                width: $width;
                height: $height;
                clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
                transform-origin: bottom center;
                opacity: 0;

                animation: intro 4s var(--delay, 0ms) ease-in-out forwards;

                @keyframes intro {
                    0% {
                        opacity: 0;
                        transform: scale(0) translateY(0rem) rotateX(0deg) rotateY(0deg)
                            translateZ(0rem) rotateX(0deg);
                    }
                    10% {
                        opacity: 0.69;
                        transform: scale(1) translateY(0rem) rotateX(0deg) rotateY(0deg)
                            translateZ(0rem) rotateX(0deg);
                    }
                    100% {
                        opacity: 0.69;
                        transform: scale(1) translateY(var(--ty, 0rem)) rotateX(var(--s, 0deg))
                            rotateY(var(--ry, 0deg)) translateZ($radius) rotateX(var(--rx, 0deg));
                    }
                }

                // greenish inner filling
                &::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    clip-path: polygon(0.5% 99.7%, 50% 1%, 99.5% 99.7%);
                    background-color: hsl(var(--hue, 0deg), 100%, 15%);
                }

                // positioning the triangles

                @for $i from 0 to 20 {
                    $m: $i % 5;
                    &:nth-child(#{$i + 1}) {
                        --hue: #{(60 + math.random(100)) * 1deg};
                        @if ($i < 10) {
                            --delay: 0s;
                            --ry: #{$m * $angle};
                            --rx: #{$tilt};
                            @if ($i >= 5) {
                                --delay: 4s;
                                --ty: #{-$height2};
                                --s: 180deg;
                            }
                        } @else {
                            --ry: #{($m + 0.5) * $angle};
                            --rx: #{-5 * $tilt};
                            --delay: 12s;
                            @if ($i < 15) {
                                --delay: 8s;
                                --ty: #{-$height2};
                            } @else {
                                --s: 180deg;
                            }
                        }
                    }
                }
            }
            input {
                @include visually-hidden();
            }`}
        </style>
        <input id="toggler" type="checkbox"/>
<div class="scene">
  <div class="icosahedron"> 
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
    <div class="triangle"></div>
  </div>
</div>
    </div>
  );
};
