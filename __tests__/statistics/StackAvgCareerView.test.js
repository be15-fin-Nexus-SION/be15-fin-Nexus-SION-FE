// StackAvgCareerView.test.js
import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import StackAvgCareerView from "@/features/statistics/views/StackAvgCareerView.vue";

// mocking 일부 컴포넌트
vi.mock("@/components/side/SidebarWrapper.vue", () => ({
  default: { template: "<div>SquadSidebar</div>" },
}));

vi.mock("@/components/searchBar/TechStackSearchBar.vue", () => ({
  default: {
    props: ["selectedStacks"],
    emits: ["select"],
    template: `<input type="text" @click="$emit('select', 'Java')" />`,
  },
}));

vi.mock("@/features/statistics/components/AvgList.vue", () => ({
  default: {
    props: ["careerStats"],
    template: `<div>AvgList Component</div>`,
  },
}));

vi.mock("@/components/button/PrimaryButton.vue", () => ({
  default: {
    props: ["label", "onClick"],
    template: `<button @click="onClick">{{ label }}</button>`,
  },
}));

vi.mock("chart.js/auto", () => ({
  Chart: vi.fn().mockImplementation(() => ({
    destroy: vi.fn(),
    update: vi.fn(),
  })),
}));

describe("StackAvgCareerView.vue", () => {
  it("페이지 타이틀과 설명이 렌더링된다", () => {
    const wrapper = mount(StackAvgCareerView);
    expect(wrapper.text()).toContain("기술 스택별 평균 경력 조회");
    expect(wrapper.text()).toContain("개발자들의 평균 경력을 확인할 수");
  });

  it("TechStackSearchBar 클릭 시 스택이 추가된다", async () => {
    const wrapper = mount(StackAvgCareerView);
    const searchInput = wrapper.find("input");
    await searchInput.trigger("click");

    const badge = wrapper.findComponent({ name: "TechBadge" });
    expect(badge.exists()).toBe(true);
  });

  it("필터 초기화 버튼을 누르면 스택 뱃지가 모두 사라진다", async () => {
    const wrapper = mount(StackAvgCareerView);
    const searchInput = wrapper.find("input");
    await searchInput.trigger("click");

    let badges = wrapper.findAllComponents({ name: "TechBadge" });
    expect(badges.length).toBe(1);

    const button = wrapper.find("button");
    await button.trigger("click");

    badges = wrapper.findAllComponents({ name: "TechBadge" });
    expect(badges.length).toBe(0);
  });
});
