describe("등급별 대기 인원 통계 페이지", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/v1/statistics/waiting-count-by-grade", {
      statusCode: 200,
      body: {
        success: true,
        data: [
          { gradeCode: "S", waitingCount: 5 },
          { gradeCode: "A", waitingCount: 3 },
          { gradeCode: "B", waitingCount: 5 },
          { gradeCode: "C", waitingCount: 2 },
          { gradeCode: "D", waitingCount: 7 },
        ],
      },
    }).as("fetchWaitingStats");

    cy.visit("/statistics/grade/waiting-count");
    cy.wait("@fetchWaitingStats");
  });

  it("페이지 진입 시 제목, 차트, 리스트가 렌더링된다", () => {
    cy.contains("등급별 대기 상태").should("exist");
    cy.get("canvas.chart-canvas").should("be.visible");
    cy.get(".career-list-container .item").should("have.length", 5);
  });

  it("정렬 기준을 등급순으로 변경하면 S > A > B > C > D 순으로 나온다", () => {
    cy.get("#sort-select").select("등급순");

    cy.get(".career-list-container .item .content-text:first-child").then(
      (items) => {
        const grades = [...items].map((el) => el.textContent.trim());
        expect(grades).to.deep.equal(["S", "A", "B", "C", "D"]);
      },
    );
  });

  it("정렬 기준을 대기 인원수로 변경하면 인원 내림차순, 등급 보조 정렬된다", () => {
    cy.get("#sort-select").select("대기 상태 인원수");

    cy.get(".career-list-container .item .content-text:first-child").then(
      (items) => {
        const grades = [...items].map((el) => el.textContent.trim());
        expect(grades).to.deep.equal(["D", "S", "B", "A", "C"]);
      },
    );
  });

  it("등급 필터를 'B'로 선택하면 B 등급만 보인다", () => {
    cy.get("#job-select").select("B");
    cy.get(".career-list-container .item").should("have.length", 1);
    cy.get(".career-list-container .item").should("contain.text", "B");
  });

  it("등급 필터를 'D'로 선택하면 D 등급만 보인다", () => {
    cy.get("#job-select").select("D");
    cy.get(".career-list-container .item").should("have.length", 1);
    cy.get(".career-list-container .item").should("contain.text", "D");
  });

  it("등급 필터를 전체 선택하면 모든 등급이 다시 보인다", () => {
    cy.get("#job-select").select("B");
    cy.get("#job-select").select("전체 선택");

    cy.get(".career-list-container .item").should("have.length", 5);
  });

  it("데이터가 없을 경우 안내 문구가 보인다", () => {
    cy.intercept("GET", "/api/v1/statistics/waiting-count-by-grade", {
      statusCode: 200,
      body: {
        success: true,
        data: [],
      },
    }).as("emptyWaitingStats");

    cy.visit("/statistics/grade/waiting-count");
    cy.wait("@emptyWaitingStats");

    cy.contains("등급별 대기 상태 중인 인원이 없습니다.").should("exist");
  });
});
