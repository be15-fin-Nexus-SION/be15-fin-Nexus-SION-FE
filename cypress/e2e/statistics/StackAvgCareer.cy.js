describe("기술 스택별 평균 경력 통계 페이지", () => {
  beforeEach(() => {
    cy.visit("/statistics/stack/avg-career"); // 실제 라우터 경로에 맞게 수정
  });

  it("페이지 타이틀과 설명이 보인다", () => {
    cy.contains("기술 스택별 평균 경력 조회");
    cy.contains("개발자들의 평균 경력을 확인할 수");
  });

  it("기술 스택을 선택하면 뱃지와 차트가 나타난다", () => {
    cy.get('input[placeholder="기술스택 검색"]').type("Java");

    // 자동완성 리스트가 뜨는 DOM 구조에 맞게 수정
    cy.get("li.autocomplete-item").contains("Java").click();

    cy.get(".stack-button-list").contains("Java").should("exist");
    cy.get("canvas").should("exist");
  });

  it("필터 초기화 버튼을 누르면 모든 요소가 사라진다", () => {
    cy.get('input[placeholder="기술스택 검색"]').type("React");
    cy.contains("React").click();

    cy.get("button").contains("필터 초기화").click();

    cy.get(".stack-button-list").should("be.empty");
    cy.get(".chart-canvas").should("exist"); // canvas는 남지만 내용은 초기화됨
  });

  it("정렬 기준을 바꾸면 순서가 바뀐다", () => {
    cy.intercept("GET", "/api/v1/statistics/stack/average-career**", {
      statusCode: 200,
      body: {
        data: {
          content: [
            { techStackName: "React", averageCareer: 10 },
            { techStackName: "Java", averageCareer: 2 },
          ],
        },
      },
    });

    cy.get('input[placeholder="기술스택 검색"]').type("Java");
    cy.contains("li.autocomplete-item", "Java").click();

    cy.get('input[placeholder="기술스택 검색"]').type("React");
    cy.contains("li.autocomplete-item", "React").click();

    cy.get("select#sort-select").select("평균 경력순");

    cy.get(".item .techStackName").then((stackNames) => {
      const names = [...stackNames].map((el) => el.innerText.trim());
      expect(names).to.deep.equal(["React", "Java"]);
    });
  });
});
