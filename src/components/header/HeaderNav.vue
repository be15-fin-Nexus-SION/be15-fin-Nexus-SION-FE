<template>
  <div class="menu-container">
    <span class="menu-text menu-box">통계</span>
    <span class="menu-text menu-box">개발자</span>
    <span class="menu-text menu-box">프로젝트</span>
    <span class="menu-text menu-box">스쿼드</span>
  </div>
</template>

<style scoped>
.menu-container {
  @apply flex items-center gap-[39px];
}
.menu-text {
  @apply text-[18px] leading-[22px] font-semibold text-[#474747] flex items-center justify-center;
}
.menu-box {
  @apply h-[63px];
}
</style>
