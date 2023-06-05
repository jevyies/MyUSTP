<script setup>
import LoadingLogo from "@/views/loading-logo.vue";
import axios from "axios";
import { watch } from "vue";
const laptopScreen = ref();
const screen = ref();
const apps = ref([]);
import { localApi } from "@axios";
import { avatarText } from '@core/utils/formatters'
import { useTheme } from "vuetify";

const globalFunctions = inject("globalFunctions");
const { global } = useTheme();
const currentSkin = ref(global.name.value);
const iconDiv = ref();
const svgImage = ref();
const circleStyle = ref();
const bigCircleRef = ref();
const loading = ref(false);
const doneAnimate = ref(false);
const favorites = ref([]);

watch(global.name, (val) => {
  currentSkin.value = val;
});
const setDimensions = ($event) => {
  if ($event) {
    resizeScreen();
    if(!doneAnimate.value){
      resizeBubble();
    }
    createCanvas(doneAnimate.value);
  }
};

const resizeScreen = () => {
  screen.value.style.height = `${laptopScreen.value.getBoundingClientRect().height}px`;
  screen.value.style.width = `${laptopScreen.value.getBoundingClientRect().width}px`;
  screen.value.style.top = `${laptopScreen.value.getBoundingClientRect().top}px`;
  screen.value.style.left = `${laptopScreen.value.getBoundingClientRect().left}px`;
};

const resizeBubble = () => {
  if (apps.value.length === 0) return;
  if (apps.value.length == 6) {
    apps.value[0].styles = { bottom: `200px`, left: `-50px` };
    apps.value[1].styles = { top: `170px`, left: `-100px` };
    apps.value[2].styles = { top: `50px`, left: `50px` };
    apps.value[3].styles = { top: `50px`, right: `50px` };
    apps.value[4].styles = { top: `170px`, right: `-100px` };
    apps.value[5].styles = { bottom: `200px`, right: `-50px` };
  }
  if(apps.value.length == 5){
    apps.value[0].styles = { bottom: `200px`, left: `-50px` };
    apps.value[1].styles = { top: `90px`, left: `-50px` };
    apps.value[2].styles = { top: `0`, left: `50%`, transform: `translateX(-50%)` };
    apps.value[3].styles = { top: `90px`, right: `-50px` };
    apps.value[4].styles = { bottom: `200px`, right: `-50px` };
  }
  if(apps.value.length == 4){
    apps.value[0].styles = { top: `200px`, left: `-50px` };
    apps.value[1].styles = { top: `50px`, left:`50px` };
    apps.value[2].styles = { bottom: `50px`, right:`50px` };
    apps.value[3].styles = { bottom: `200px`, right: `-50px` };
  }
  if(apps.value.length == 3){
    apps.value[0].styles = { bottom: `200px`, left: `-50px` };
    apps.value[1].styles = { top: `0`, left: `50%`, transform: `translateX(-50%)` };
    apps.value[2].styles = { bottom: `200px`, right: `-50px` };
  }
  if(apps.value.length == 2){
    apps.value[0].styles = { top: `50%`, left: `0`, transform: `translateY(-50%)` };
    apps.value[1].styles = { top: `50%`, right: `0`, transform: `translateY(-50%)` };
  }
  if(apps.value.length == 1){
    apps.value[0].styles = { top: `50%`, left: `50%`, transform: `translate(-50%, -50%)` };
  }
};

const moveBubbles = () => {
  if (apps.value.length === 0) return;
  if (apps.value.length == 6) {
    apps.value[0].styles = { bottom: `0`, left: `10%` };
    apps.value[1].styles = { top: `50%`, left: `-75px`, transform: `translateY(-50%)`};
    apps.value[2].styles = { top: `0`, left: `10%` };
    apps.value[3].styles = { top: `0`, right: `10%` };
    apps.value[4].styles = { top: `50%`, right: `-75px`, transform: `translateY(-50%)` };
    apps.value[5].styles = { bottom: `0`, right: `10%` };
  }
  if(apps.value.length == 5){
    apps.value[0].styles = { bottom: `0`, left: `5%` };
    apps.value[1].styles = { top: `40%`, left: `-75px`, transform: `translateY(-50%)` };
    apps.value[2].styles = { top: `-75px`, left: `50%`, transform: `translateX(-50%)` };
    apps.value[3].styles = { top: `40%`, right: `-75px`, transform: `translateY(-50%)` };  
    apps.value[4].styles = { bottom: `0`, right: `5%` };
  }
  if(apps.value.length == 4){
    apps.value[0].styles = { top: `50%`, left: `0`, transform: `translateY(-50%)` };
    apps.value[1].styles = { top: `0`, left: `50%`, transform: `translateX(-50%)` };
    apps.value[2].styles = { bottom: `0`, right: `50%`, transform: `translateX(50%)` };
    apps.value[3].styles = { bottom: `50%`, right: `0`, transform: `translateY(50%)` };
  }
  if(apps.value.length == 3){
    apps.value[0].styles = { bottom: `200px`, left: `0` };
    apps.value[1].styles = { top: `0`, left: `50%`, transform: `translateX(-50%)` };
    apps.value[2].styles = { bottom: `200px`, right: `0` };
  }
};
const clearBubbleStyles = () => {
  apps.value.forEach((app) => {
    app.styles = {};
  });
};
const startAnimation = async () => {
  bigCircleRef.value.style.rotate = "360deg";
  moveBubbles();
  await globalFunctions.wait(1000);
  bigCircleRef.value.style.scale = "0";
  await globalFunctions.wait(1000);
  createCanvas(true);
  clearBubbleStyles();
  doneAnimate.value = true;
  bigCircleRef.value.style.scale = "1";
};
const createCanvas = (reset = false) => {
  var center = laptopScreen.value.getBoundingClientRect();
  var moreHeight = 150;
  if (reset) {
    circleStyle.value = {
      height: `${center.height}px`,
      width: `${center.width}px`,
      top: `${center.top}px`,
      left: `${center.left}px`,
    };
  } else {
    circleStyle.value = {
      height: `${center.width + moreHeight}px`,
      width: `${center.width + moreHeight}px`,
      top: `${center.top - center.width / 2 + moreHeight / 2}px`,
      left: `${center.left - moreHeight / 2}px`,
    };
  }
};

const fetchIcons = async (website) => {
  try {
    const { data } = await localApi.get(`${encodeURIComponent(website.url)}`);
    website.image = data.screenshot
      ? `data:image/jpeg;base64, ${data.screenshot}`
      : null;
    website.icon = data.favIcon;
  } catch (error) {
    website.image = null;
    website.icon = null;
  }
};

const getFavorites = async () => {
  apps.value = [];
  try {
    const { data } = await localApi.get(`get/favorites`);
    data.forEach((item) => {
      apps.value.push({
        url: item,
        image: null,
        icon: null,
        styles: {},
      });
    });
    for (const website of apps.value) {
      await fetchIcons(website);
    }
  } catch (error) {
    apps.value = [];
  }
};

onMounted(async () => {
  loading.value = true;
  await nextTick();
  resizeScreen();
  createCanvas();
  await getFavorites();
  resizeBubble();
  await globalFunctions.wait(2000);
  loading.value = false;
  await globalFunctions.wait(900);
  bigCircleRef.value.style.scale = "1";
  await globalFunctions.wait(2500);
  startAnimation();
});
</script>
<template>
  <div
    class="position-fixed big-circle"
    :style="circleStyle"
    ref="bigCircleRef"
    style="z-index: 2;"
  >
    <div
      class="position-relative h-100 w-100"
      :class="{ 'd-flex align-center justify-center pa-4': doneAnimate, 'pa-15': apps.length == 1 }"
    >
      <div :class="{ 'v-row': doneAnimate }">
        <template v-for="app in apps" :key="app.url">
          <div :class="{ 'v-col v-col-6': doneAnimate, 'v-col-12': apps.length == 1 }">
            <div :class="{
                'v-card v-card--density-default v-card--variant-elevated pa-2': doneAnimate,
                'light v-theme--light': currentSkin === 'light',
                'dark v-theme--dark': currentSkin === 'dark',
                'bubble position-absolute': !doneAnimate,
              }"
              :style="app.styles"
            >
              <div
                :class="{
                  'w150px h150px': !doneAnimate,
                  'd-flex gap-x-2 align-center': doneAnimate,
                  'bubble-text': !app.icon && !doneAnimate,
                }"
              >
                <VImg :src="app.icon" :width="doneAnimate ? 40 : `100%`" v-if="app.icon"/>
                <h1 class="text-primary reduce-h1" :class="{'px-2': doneAnimate}" v-else>{{ avatarText(app.url) }}</h1>
                <div
                  class="d-flex flex-column gap-y-2 w-100"
                  v-if="doneAnimate"
                >
                  <div class="w-75 bg-grey" style="height: 15px;"></div>
                  <div class="w-100 bg-grey" style="height: 12px;"></div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <div class="position-absolute" style="z-index: 1;bottom: -5px;" ref="svgImage">
    <svg
      width="746"
      height="571"
      viewBox="0 0 746 571"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.4561 437.826L79.4206 351.271H652.544L719.202 437.826V447.302H11.4561V437.826Z"
        fill="url(#paint0_linear_4_17)"
      />
      <path
        d="M66.3505 403.709L100.986 355.062H631.632L665.614 403.709H66.3505Z"
        fill="#626262"
        stroke="black"
        stroke-opacity="0.09"
      />
      <path d="M653.198 0H80.7351L79.4206 351.271H653.198V0Z" fill="#403E3E" />
      <path
        d="M630.979 25.9031H100.986V322.841L630.979 320.314V25.9031Z"
        fill="rgb(var(--v-theme-background))"
        ref="laptopScreen"
      />
      <path
        d="M241.49 430.244L247.371 409.395H481.98L491.129 430.244H241.49Z"
        fill="#8E8E8E"
      />
      <path
        d="M12.1096 446.671V438.457H718.548V446.671H12.1096Z"
        fill="#8F8F8F"
      />
      <path
        d="M364.39 17.9596C367.408 17.9482 369.859 15.572 369.847 12.6347C369.835 9.69732 367.365 7.33974 364.348 7.35115C361.33 7.36256 358.879 9.73874 358.891 12.6761C358.903 15.6134 361.373 17.971 364.39 17.9596Z"
        fill="url(#paint1_linear_4_17)"
        stroke="black"
        stroke-width="0.5"
      />
      <ellipse
        cx="364.349"
        cy="12.6357"
        rx="2.61402"
        ry="2.52713"
        fill="url(#paint2_linear_4_17)"
      />
      <ellipse
        cx="364.349"
        cy="12.6358"
        rx="1.30701"
        ry="1.26357"
        fill="#232323"
      />
      <path
        d="M49.3594 502.899L1 570.5H111.442L127.126 550.915L144.118 531.961L172.218 514.903L196.398 507.953L223.845 505.426L251.292 502.899L268.937 499.74L283.968 492.791L299.652 484.578L316.643 479.523L346.704 469.415L354.546 465.624L358.467 458.043L360.428 454.252L358.467 447.934L356.507 443.512L351.279 441.616H341.476H334.288L329.713 443.512L319.257 447.934L295.731 456.147L268.937 458.043L256.52 454.252H251.292L247.371 449.198L248.678 443.512L256.52 435.93L276.126 416.345L306.84 383.492L316.643 375.279L326.445 371.488H332.327L346.704 378.438L351.279 382.86L356.507 384.756H360.428L362.388 383.492L363.368 380.965L364.349 378.438V375.279L360.428 368.961L349.972 360.116L338.209 351.271H317.95L316.643 344.953L309.454 337.372L292.463 339.267L290.503 334.213L287.889 327.264H280.7L268.937 329.159H264.362L262.729 325.684L261.095 322.209H256.52H251.292L242.143 325.368L211.429 334.213L182.674 344.953L172.218 350.008L163.723 357.589L117.977 418.24L95.7582 447.302L71.5785 478.26L66.3505 484.578L59.8154 489L55.2409 493.422L49.3594 502.899Z"
        fill="#EDB37E"
        stroke="#D1945C"
      />
      <path
        d="M326.445 385.388L324.485 373.384L316.643 375.279L306.84 385.388L313.375 391.074H321.871L326.445 385.388Z"
        fill="#EDB37E"
      />
      <path
        d="M239.529 364.539L263.055 348.744L291.81 338.004"
        stroke="url(#paint3_linear_4_17)"
      />
      <path
        d="M322.524 351.271H301.713L262.402 375.279"
        stroke="url(#paint4_linear_4_17)"
      />
      <path
        d="M215.35 351.271L239.86 337.133L265.016 328.527"
        stroke="url(#paint5_linear_4_17)"
      />
      <path
        d="M600.697 546.864L629.424 570H745L714.269 522.366L706.92 514.881L694.895 501.271L680.197 481.537L658.819 452.276L618.735 395.796L603.37 374.021L593.349 367.216L579.987 360.411L565.958 355.648L545.916 348.162L520.529 340.677L515.185 338.636L509.84 339.316L505.164 341.358L503.159 344.76L501.823 348.162L492.47 344.76L484.453 344.08L478.441 346.801L474.432 352.926V358.37L471.092 357.009L459.067 354.967L451.05 357.009L448.378 363.133L447.042 367.216V371.979L439.693 369.257H431.008L424.995 371.979L420.987 374.701L408.294 386.269L400.945 395.796V400.56V403.962L404.953 406.684H409.63L411.634 403.962L431.008 392.394L435.016 390.352L439.693 392.394L438.357 395.796L436.353 403.962L438.357 409.406L443.033 412.808H448.378L451.05 411.447L455.058 409.406L457.063 403.962L461.071 406.684L491.134 441.389L515.185 463.164L517.523 470.99L519.861 478.815L511.176 482.898L494.474 486.301L477.105 482.898L457.063 478.815L443.033 472.691L428.336 467.927H414.306L406.958 472.691L404.953 478.815L406.958 487.662L414.306 495.147L434.348 503.313L457.063 510.117L477.105 521.686L491.134 527.81L511.176 533.254L577.983 540.059L600.697 546.864Z"
        fill="#EBB37F"
        stroke="url(#paint6_linear_4_17)"
      />
      <path
        d="M525.206 382.187L500.487 367.216L474.432 358.37"
        stroke="url(#paint7_linear_4_17)"
      />
      <path
        d="M457.063 403.282L448.378 396.477L440.361 392.394"
        stroke="url(#paint8_linear_4_17)"
      />
      <path
        d="M551.928 371.299L525.206 355.648L501.823 348.162"
        stroke="url(#paint9_linear_4_17)"
      />
      <path
        d="M496.479 393.074L471.76 379.465L447.042 371.979"
        stroke="url(#paint10_linear_4_17)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_4_17"
          x1="719.855"
          y1="233.128"
          x2="489.347"
          y2="512.491"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#B6B6B6" />
          <stop offset="1" stop-color="#B6B6B6" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_4_17"
          x1="365.22"
          y1="14.3204"
          x2="369.461"
          y2="17.8298"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#0F0E0E" />
          <stop offset="1" stop-color="#D9D9D9" stop-opacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_4_17"
          x1="361.175"
          y1="7.94241"
          x2="365.067"
          y2="15.811"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#D9D9D9" />
          <stop offset="1" stop-color="#D9D9D9" stop-opacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_4_17"
          x1="265.669"
          y1="338.004"
          x2="265.669"
          y2="364.539"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#D1945C" stop-opacity="0" />
          <stop offset="0.239583" stop-color="#D1945C" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_4_17"
          x1="292.463"
          y1="351.271"
          x2="292.463"
          y2="375.279"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#D3965F" />
          <stop offset="1" stop-opacity="0" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_4_17"
          x1="240.183"
          y1="328.527"
          x2="240.183"
          y2="351.271"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.046875" stop-color="#D3965F" stop-opacity="0" />
          <stop offset="0.317708" stop-color="#D3965F" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_4_17"
          x1="572.972"
          y1="338.636"
          x2="572.972"
          y2="570"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#D3965F" />
          <stop offset="1" stop-opacity="0" />
        </linearGradient>
        <linearGradient
          id="paint7_linear_4_17"
          x1="500.821"
          y1="358.37"
          x2="500.821"
          y2="382.187"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#D3965F" />
          <stop offset="1" stop-opacity="0" />
        </linearGradient>
        <linearGradient
          id="paint8_linear_4_17"
          x1="448.712"
          y1="392.394"
          x2="448.712"
          y2="403.282"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#D3965F" />
          <stop offset="1" stop-opacity="0" />
        </linearGradient>
        <linearGradient
          id="paint9_linear_4_17"
          x1="528.212"
          y1="348.162"
          x2="528.212"
          y2="371.299"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#D3965F" />
          <stop offset="1" stop-opacity="0" />
        </linearGradient>
        <linearGradient
          id="paint10_linear_4_17"
          x1="472.428"
          y1="370.618"
          x2="472.428"
          y2="393.074"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#D3965F" />
          <stop offset="1" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
  <div ref="screen" class="position-fixed zIndex-1" v-resize="setDimensions">
    <div class="h-100 w-100 position-relative pa-4">
      <div class="d-flex justify-center align-center" :class="{ 'fade-out': !loading }">
        <LoadingLogo :width="50" :height="20" :small-loading="true" />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@use "@/styles/login.scss";
</style>
