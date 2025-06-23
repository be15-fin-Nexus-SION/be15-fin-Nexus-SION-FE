// __tests__/AvgList.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import AvgList from "@/features/statistics/components/AvgList.vue";

// 모킹할 API 함수
vi.mock("@/api/statistics.js", () => ({
  getStackAvgCareer: vi.fn(),
}));

import { getStackAvgCareer } from "@/api/statistics.js";

// 공통 mock 데이터
const mockData = {
  data: {
    data: {
      content: [
        {
          techStackName: "JavaScript",
          averageCareer: 5.3,
          minCareer: 1,
          maxCareer: 10,
          count: 25,
        },
        {
          techStackName: "TypeScript",
          averageCareer: 3.2,
          minCareer: 1,
          maxCareer: 6,
          count: 12,
        },
      ],
      currentPage: 0,
      totalPages: 1,
    },
  },
};

describe("AvgList.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("정렬 옵션이 변경되면 이벤트를 emit한다", async () => {
    getStackAvgCareer.mockResolvedValue(mockData);

    const wrapper = mount(AvgList, {
      props: {
        selectedStacks: ["JavaScript"],
        sortOption: "techStackName",
      },
    });

    await flushPromises();

    const select = wrapper.find("#sort-select");
    await select.setValue("averageCareer");

    expect(wrapper.emitted("updateSort")).toBeTruthy();
    expect(wrapper.emitted("updateSort")[0]).toEqual(["averageCareer"]);
  });

  it("기술 스택 리스트가 렌더링된다", async () => {
    getStackAvgCareer.mockResolvedValue(mockData);

    const wrapper = mount(AvgList, {
      props: {
        selectedStacks: ["JavaScript", "TypeScript"],
        sortOption: "averageCareer",
      },
    });

    await flushPromises();

    const items = wrapper.findAll("[data-testid='avg-list-item']");
    expect(items.length).toBe(2);
    expect(items[0].text()).toContain("JavaScript");
    expect(items[1].text()).toContain("TypeScript");
  });

  it("데이터가 없을 경우 '선택된 기술 스택이 없습니다.'를 보여준다", async () => {
    getStackAvgCareer.mockResolvedValue({
      data: {
        data: {
          content: [],
          currentPage: 0,
          totalPages: 1,
        },
      },
    });

    const wrapper = mount(AvgList, {
      props: {
        selectedStacks: [],
        sortOption: "techStackName",
      },
    });

    await flushPromises();
    expect(wrapper.text()).toContain("선택된 기술 스택이 없습니다.");
  });
});
