describe("인기 기술 스택 통계 페이지", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/v1/statistics/stack/popular*").as("fetchStacks");
    cy.visit("/statistics/stack/popular");
  });

  Cypress.on("uncaught:exception", (err) => {
    if (err.message.includes("instances")) return false;
  });

  it("초기 페이지 렌더링 시 제목, 차트, 리스트가 보인다", () => {
    cy.contains("기간별 인기 기술 스택").should("exist");
    cy.get("canvas.chart-canvas").should("be.visible");
    cy.get(".career-list-container .item").should("have.length.greaterThan", 0);
  });

  it("기간 필터를 변경하면 차트와 리스트가 갱신된다", () => {
    cy.get("#time-select").should("exist").select("최근 6달");
    cy.wait("@fetchStacks");
    cy.get(".career-list-container .item").should("exist");
  });

  it("Top N 필터를 변경하면 리스트 수가 변경된다", () => {
    cy.get("#top-select").should("exist").select("Top 5");
    cy.wait("@fetchStacks");
    cy.get(".career-list-container .item").should("have.length.lte", 5);

    cy.get("#top-select").should("exist").select("Top 20");
    cy.wait("@fetchStacks");
    cy.get(".career-list-container .item").should("have.length.lte", 20);
  });

  it("필터 초기화 버튼 클릭 시 기본값으로 복귀한다", () => {
    cy.get("#time-select").should("exist").select("최근 1년");
    cy.get("#top-select").should("exist").select("Top 20");
    cy.wait("@fetchStacks");

    cy.contains("필터 초기화").click();
    cy.wait("@fetchStacks");

    cy.get("#time-select").should("have.value", "1m");
    cy.get("#top-select").should("have.value", "5");
  });

  it("정렬 기준을 바꾸면 리스트 순서가 바뀐다", () => {
    cy.get("#sort-select").should("exist").select("기술 스택 이름순");
    cy.wait("@fetchStacks");

    cy.get(".career-list-container .item").then((items) => {
      const stackNames = [...items].map((el) =>
        el.querySelector(".badgeName")?.textContent?.trim(),
      );
      const sorted = [...stackNames].sort((a, b) => a.localeCompare(b));
      expect(stackNames).to.deep.equal(sorted);
    });
  });

  it("데이터가 없을 경우 안내 문구를 표시한다", () => {
    cy.intercept("GET", "/api/v1/statistics/stack/popular*", {
      statusCode: 200,
      body: {
        data: {
          content: [],
        },
      },
    }).as("fetchStacks");

    cy.get("#time-select").should("exist").select("최근 5년");
    cy.get("#top-select").should("exist").select("Top 20");
    cy.wait("@fetchStacks");

    cy.contains(
      "해당 시기에 진행되거나 완료된 프로젝트에 사용된 기술 스택이 없습니다.",
    ).should("exist");
  });
});
