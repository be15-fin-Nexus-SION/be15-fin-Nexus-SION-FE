describe("직무별 참여 통계 페이지", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/v1/statistics/participation").as("fetchStacks");
    cy.visit("/statistics/project/participation");
  });

  it("화면이 정상적으로 로딩된다", () => {
    cy.wait("@fetchStacks"); // 데이터 도착을 기다림
    cy.contains("직무").should("exist");
    cy.get(".item").should("exist");
  });

  it("기본적으로 전체 직무 목록이 보인다", () => {
    cy.wait("@fetchStacks");
    cy.get(".item").should("have.length.greaterThan", 0);
  });

  it("직무 이름순 정렬 시 정렬 결과가 이름순이다", () => {
    cy.wait("@fetchStacks");
    cy.get("#sort-select").select("직무 이름순");

    cy.get(".job").then(($els) => {
      const textArr = [...$els].map((el) => el.textContent.trim());
      const sorted = [...textArr].sort((a, b) => a.localeCompare(b, "ko"));
      expect(textArr).to.deep.equal(sorted);
    });
  });

  it("등록된 인원 수 순 정렬이 작동한다", () => {
    cy.wait("@fetchStacks");
    cy.get("#sort-select").select("등록된 인원 수 순");

    cy.get(".count").then(($els) => {
      const nums = [...$els].map((el) => parseInt(el.textContent));
      const sorted = [...nums].sort((a, b) => b - a);
      expect(nums).to.deep.equal(sorted);
    });
  });

  it("특정 직무 필터링 시 해당 직무만 보여진다", () => {
    cy.wait("@fetchStacks");
    cy.get("#job-select").select("백엔드");

    cy.get(".job").should("have.length", 1);
    cy.get(".job").first().should("contain.text", "백엔드");
  });

  it("전체 선택 시 전체 목록이 다시 보여진다", () => {
    cy.wait("@fetchStacks");
    cy.get("#job-select").select("백엔드");
    cy.get(".item").should("have.length", 1);

    cy.get("#job-select").select("전체 선택");
    cy.get(".item").should("have.length.greaterThan", 1);
  });
});
