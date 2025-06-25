import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PopularList from "@/features/statistics/components/PopularList.vue";

describe("PopularList.vue", () => {
  const list = [
    {
      techStackName: "Vue.js",
      totalUsageCount: 100,
      latestProjectName: "프로젝트A",
      topJobName: "백엔드",
    },
    {
      techStackName: "React",
      totalUsageCount: 80,
      latestProjectName: "프로젝트B",
      topJobName: "풀스택",
    },
    {
      techStackName: "Spring",
      totalUsageCount: 120,
      latestProjectName: "프로젝트C",
      topJobName: "백엔드",
    },
  ];

  it("리스트 항목이 올바르게 렌더링된다", () => {
    const wrapper = mount(PopularList, {
      props: { list },
    });

    const items = wrapper.findAll(".content");
    expect(items.length).toBe(3);

    const texts = items.map((item) => item.text());

    expect(texts.some((t) => t.includes("Vue.js"))).toBe(true);
    expect(texts.some((t) => t.includes("React"))).toBe(true);
    expect(texts.some((t) => t.includes("Spring"))).toBe(true);
  });

  it("기본 정렬은 totalUsageCount 내림차순이다", () => {
    const wrapper = mount(PopularList, {
      props: { list },
    });

    const items = wrapper.findAll(".content");
    expect(items[0].text()).toContain("Spring"); // 120
    expect(items[1].text()).toContain("Vue.js"); // 100
    expect(items[2].text()).toContain("React"); // 80
  });

  it("정렬 기준을 techStackName으로 바꾸면 이름순으로 정렬된다", async () => {
    const wrapper = mount(PopularList, {
      props: { list },
    });

    const select = wrapper.find("#sort-select");
    await select.setValue("techStackName");

    const items = wrapper.findAll(".content");
    expect(items[0].text()).toContain("React");
    expect(items[1].text()).toContain("Spring");
    expect(items[2].text()).toContain("Vue.js");
  });
});
