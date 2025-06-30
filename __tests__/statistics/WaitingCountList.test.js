import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import WaitingCountList from "@/features/statistics/components/WaitingCountList.vue";

const sampleStats = [
  { gradeCode: "S", waitingCount: 1, totalCount: 3 },
  { gradeCode: "A", waitingCount: 1, totalCount: 3 },
  { gradeCode: "B", waitingCount: 1, totalCount: 2 },
  { gradeCode: "C", waitingCount: 0, totalCount: 1 },
  { gradeCode: "D", waitingCount: 1, totalCount: 1 },
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

    expect(renderedGrades).toEqual(["S", "A", "B", "D", "C"]);
  });

  it.each(["B", "D"])(
    "특정 등급 필터 적용 시 해당 항목만 보여준다 - '%s'",
    async (grade) => {
      const gradeSelect = wrapper.find("#grade-select");
      await gradeSelect.setValue(grade);

      const items = wrapper.findAll(".career-list-container .item");
      expect(items.length).toBe(1);
      expect(items[0].text()).toContain(grade);
    },
  );

  it("빈 stats일 경우 안내 문구가 출력된다", () => {
    const emptyWrapper = mount(WaitingCountList, {
      props: { stats: [] },
    });

    expect(emptyWrapper.text()).toContain(
      "등급별로 상태가 '대기중'인 인원이 없습니다.",
    );
  });
});
