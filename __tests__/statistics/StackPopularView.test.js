import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";

// Chart.js에서 사용하는 canvas context를 모킹
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: [] })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => []),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
  }));
});

// 반드시 mock 먼저
vi.mock("@/api/statistics", () => ({
  getPopularTechStacks: vi.fn(),
}));

import PopularTechStackChart from "@/features/statistics/views/StackPopularView.vue";
import { getPopularTechStacks } from "@/api/statistics";

const router = createRouter({
  history: createMemoryHistory(),
  routes: [],
});

describe("PopularTechStackChart.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getPopularTechStacks.mockResolvedValue({
      data: {
        data: {
          content: [
            {
              techStackName: "Vue.js",
              totalUsageCount: 100,
              latestProjectName: "프로젝트A",
              topJobName: "프론트엔드",
              monthlyUsage: { "2025-06-01": 30, "2025-06-10": 70 },
            },
          ],
        },
      },
    });
  });

  it("초기 렌더 시 기본 필터로 API를 호출한다", async () => {
    mount(PopularTechStackChart, {
      global: { plugins: [router] },
    });
    expect(getPopularTechStacks).toHaveBeenCalledWith("1m", 10);
  });

  it("필터 초기화 버튼을 누르면 period와 top이 초기화되고 API가 재호출된다", async () => {
    const wrapper = mount(PopularTechStackChart, {
      global: { plugins: [router] },
    });

    wrapper.vm.period = "6m";
    wrapper.vm.top = "20";
    await wrapper.vm.$nextTick();

    const button = wrapper.findComponent({ name: "PrimaryButton" });
    await button.vm.$emit("click");

    expect(wrapper.vm.period).toBe("1m");
    expect(wrapper.vm.top).toBe("5");
    expect(getPopularTechStacks).toHaveBeenLastCalledWith("1m", 5);
  });

  it("기간 변경 시 API가 다시 호출된다", async () => {
    const wrapper = mount(PopularTechStackChart, {
      global: { plugins: [router] },
    });
    await wrapper.find("#time-select").setValue("6m");
    expect(getPopularTechStacks).toHaveBeenLastCalledWith("6m", 10);
  });

  it("Top N 변경 시 API가 다시 호출된다", async () => {
    const wrapper = mount(PopularTechStackChart, {
      global: { plugins: [router] },
    });
    await wrapper.find("#top-select").setValue("20");
    expect(getPopularTechStacks).toHaveBeenLastCalledWith("1m", 20);
  });
});
