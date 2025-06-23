// AvgList.test.js
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import AvgList from "@/features/statistics/components/AvgList.vue";

describe("AvgList.vue", () => {
  const dummyData = [
    {
      techStackName: "Java",
      averageCareer: 5.2,
      minCareer: 1.0,
      maxCareer: 9.0,
      memberCount: 3,
    },
    {
      techStackName: "React",
      averageCareer: 3.8,
      minCareer: 2.0,
      maxCareer: 5.0,
      memberCount: 2,
    },
  ];

  it("기술스택 이름이 정상적으로 렌더링된다", () => {
    const wrapper = mount(AvgList, {
      props: {
        careerStats: dummyData,
      },
    });

    expect(wrapper.text()).toContain("Java");
    expect(wrapper.text()).toContain("React");
  });

  it("평균 경력이 소수점 포함하여 표시된다", () => {
    const wrapper = mount(AvgList, {
      props: {
        careerStats: dummyData,
      },
    });

    expect(wrapper.text()).toContain("5.2");
    expect(wrapper.text()).toContain("3.8");
  });

  it("데이터 개수만큼 아이템이 렌더링된다", () => {
    const wrapper = mount(AvgList, {
      props: {
        careerStats: dummyData,
      },
    });

    const items = wrapper.findAll("[data-testid='avg-list-item']");
    expect(items.length).toBe(2);
  });
});
