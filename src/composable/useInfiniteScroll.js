import { ref, onMounted, onBeforeUnmount } from "vue";

/**
 * useInfiniteScroll - 무한 스크롤 composable
 *
 * @param {Object} options
 * @param {Function} options.fetchFn - (page, params?) => Promise
 * @param {Ref<HTMLElement>} options.scrollTargetRef - 스크롤 대상 엘리먼트 ref
 * @param {number} [options.threshold=200] - 스크롤 트리거 임계값
 * @param {Ref<Object>|undefined} [options.params] - 선택 파라미터 (예: { keyword: "" })
 *
 * @returns {Object} { items, isLoading, isLastPage, reset, loadMore }
 */

export function useInfiniteScroll({
  fetchFn,
  scrollTargetRef,
  threshold = 200,
  params = ref(undefined),
}) {
  const items = ref([]);
  const curPage = ref(0);
  const totalPage = ref(1);
  const isLoading = ref(false);
  const isLastPage = ref(false);

  const fetchInitial = async () => {
    try {
      isLoading.value = true;
      const wrapper = await fetchFn(0, params?.value);
      items.value = wrapper.data.data.content;
      curPage.value = wrapper.data.data.currentPage;
      totalPage.value = wrapper.data.data.totalPages;
      if (wrapper.data.data.currentPage + 1 === wrapper.data.data.totalPages) {
        isLastPage.value = true;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const loadMore = async () => {
    if (isLoading.value || isLastPage.value) return;

    try {
      isLoading.value = true;
      const wrapper = await fetchFn(curPage.value + 1, params?.value);
      items.value.push(...wrapper.data.data.content);
      curPage.value = wrapper.data.data.currentPage;

      if (wrapper.data.data.currentPage + 1 === wrapper.data.data.totalPages) {
        isLastPage.value = true;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const handleScroll = async () => {
    const el = scrollTargetRef.value;
    if (!el || isLoading.value || isLastPage.value) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      await loadMore();
    }
  };

  onMounted(async () => {
    await fetchInitial();
    scrollTargetRef.value?.addEventListener("scroll", handleScroll);
  });

  onBeforeUnmount(() => {
    scrollTargetRef.value?.removeEventListener("scroll", handleScroll);
  });

  const reset = async () => {
    curPage.value = 0;
    totalPage.value = 1;
    items.value = [];
    isLastPage.value = false;
    await fetchInitial();

    // scroll 이벤트가 살아 있는지 확인해서 없으면 다시 붙이기
    const el = scrollTargetRef.value;
    if (el) {
      el.removeEventListener("scroll", handleScroll); // 중복 방지
      el.addEventListener("scroll", handleScroll);
    }
  };

  return {
    items,
    isLoading,
    isLastPage,
    reset,
    loadMore,
  };
}
