import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import JobTechStatList from "@/features/statistics/components/JobList.vue";
import { nextTick } from "vue";

const mockStats = [
  {
    jobName: "프론트엔드",
    memberCount: 12,
    topTechStack1: "Vue",
    topTechStack2: "TS",
  },
  {
    jobName: "백엔드",
    memberCount: 20,
    topTechStack1: "Spring",
    topTechStack2: "JPA",
  },
  {
    jobName: "데브옵스",
    memberCount: 5,
    topTechStack1: "Docker",
    topTechStack2: "K8s",
  },
];

describe("JobTechStatList.vue", () => {
  it("기본 렌더링 시 전체 목록이 보인다", () => {
    const wrapper = mount(JobTechStatList, {
      props: { stats: mockStats },
    });
    expect(wrapper.findAll(".item")).toHaveLength(3);
  });

  it("직무 이름순 정렬 동작", async () => {
    const wrapper = mount(JobTechStatList, {
      props: { stats: mockStats },
    });

    await wrapper.find("#sort-select").setValue("name");
    await nextTick();

    const items = wrapper.findAll(".job").map((el) => el.text());
    expect(items).toEqual(["데브옵스", "백엔드", "프론트엔드"]);
  });

  it("등록 인원순 정렬 동작", async () => {
    const wrapper = mount(JobTechStatList, {
      props: { stats: mockStats },
    });

    await wrapper.find("#sort-select").setValue("position");
    await nextTick();

    const counts = wrapper.findAll(".count").map((el) => el.text());
    expect(counts).toEqual(["20명", "12명", "5명"]);
  });

  it("직무 필터링 동작", async () => {
    const wrapper = mount(JobTechStatList, {
      props: { stats: mockStats },
    });

    await wrapper.find("#job-select").setValue("프론트엔드");
    await nextTick();

    const items = wrapper.findAll(".job");
    expect(items).toHaveLength(1);
    expect(items[0].text()).toBe("프론트엔드");
  });
});
