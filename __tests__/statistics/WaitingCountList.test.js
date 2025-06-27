import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import WaitingCountList from "@/features/statistics/components/WaitingCountList.vue";

const sampleStats = [
  { gradeCode: "S", waitingCount: 5 },
  { gradeCode: "A", waitingCount: 3 },
  { gradeCode: "B", waitingCount: 5 },
  { gradeCode: "C", waitingCount: 2 },
  { gradeCode: "D", waitingCount: 7 },
];

describe("WaitingCountList.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(WaitingCountList, {
      props: { stats: sampleStats },
    });
  });

  it("기본 리스트가 렌더링된다", () => {
    const items = wrapper.findAll(".career-list-container .item");
    expect(items.length).toBe(sampleStats.length);
  });

  it("등급순 정렬 시 S > A > B > C > D 순으로 표시된다", async () => {
    const select = wrapper.find("#sort-select");
    await select.setValue("grade");

    const items = wrapper.findAll(".career-list-container .item");
    const renderedGrades = items.map((item) =>
      item.findAll(".content-text")[0].text(),
    );
    expect(renderedGrades).toEqual(["S", "A", "B", "C", "D"]);
  });

  it("대기 인원수 정렬 시 인원 내림차순, 등급순으로 보조 정렬된다", async () => {
    const select = wrapper.find("#sort-select");
    await select.setValue("waitingCount");

    const items = wrapper.findAll(".career-list-container .item");
    const renderedGrades = items.map((item) =>
      item.findAll(".content-text")[0].text(),
    );

    expect(renderedGrades).toEqual(["D", "S", "B", "A", "C"]);
  });

  it("특정 등급 필터 적용 시 해당 항목만 보여준다 - 'B'", async () => {
    const stackSelect = wrapper.find("#job-select");
    await stackSelect.setValue("B");

    const items = wrapper.findAll(".career-list-container .item");
    expect(items.length).toBe(1);
    expect(items[0].text()).toContain("B");
  });

  it("특정 등급 필터 적용 시 해당 항목만 보여준다 - 'D'", async () => {
    const stackSelect = wrapper.find("#job-select");
    await stackSelect.setValue("D");

    const items = wrapper.findAll(".career-list-container .item");
    expect(items.length).toBe(1);
    expect(items[0].text()).toContain("D");
  });

  it("빈 stats일 경우 안내 문구가 출력된다", () => {
    const emptyWrapper = mount(WaitingCountList, {
      props: { stats: [] },
    });

    expect(emptyWrapper.text()).toContain(
      "등급별 대기 상태 중인 인원이 없습니다.",
    );
  });
});
