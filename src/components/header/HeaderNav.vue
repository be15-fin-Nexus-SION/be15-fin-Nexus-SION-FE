<template>
  <div class="menu-container">
    <router-link to="/statistics/stack/member-count" class="menu-text menu-box"
      >통계</router-link
    >
    <router-link to="/developers" class="menu-text menu-box"
      >개발자</router-link
    >
    <router-link to="/projects" class="menu-text menu-box"
      >프로젝트</router-link
    >
    <router-link to="/squads" class="menu-text menu-box">스쿼드</router-link>
  </div>
</template>

<style scoped>
.menu-container {
  @apply flex items-center gap-[39px];
}

.menu-text {
  @apply text-[18px] leading-[22px] font-semibold text-[#474747] flex items-center justify-center h-[63px];
  text-decoration: none; /* 링크 기본 밑줄 제거 */
}

.menu-text:hover {
  color: #6574f6; /* 원하는 hover 색상으로 조정 가능 */
}
</style>
