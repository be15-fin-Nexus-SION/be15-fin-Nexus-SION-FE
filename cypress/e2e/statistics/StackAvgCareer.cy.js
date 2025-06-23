describe("기술 스택별 평균 경력 통계 페이지", () => {
  beforeEach(() => {
    cy.visit("/statistics/stack/avg-career"); // 실제 라우터 경로에 맞게 수정
  });

  it("페이지 타이틀과 설명이 보인다", () => {
    cy.contains("기술 스택별 평균 경력 조회");
    cy.contains("개발자들의 평균 경력을 확인할 수");
  });

  it("기술 스택을 선택하면 뱃지와 차트가 나타난다", () => {
    // 자동완성 응답 mocking
    cy.intercept("GET", "/api/v1/statistics/all-tech-stacks", {
      statusCode: 200,
      body: { data: ["Java", "React"] },
    });

    // average-career 요청 mocking
    cy.intercept("GET", "/api/v1/statistics/stack/average-career*", (req) => {
      const stacks = req.query.selectedStacks;
      const isValid = Array.isArray(stacks)
        ? stacks.includes("Java")
        : stacks === "Java";

      if (isValid) {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              content: [
                {
                  techStackName: "Java",
                  averageCareer: 4.2,
                  minCareer: 1,
                  maxCareer: 6,
                  count: 8,
                },
              ],
              currentPage: 0,
              totalPages: 1,
            },
          },
        });
      } else {
        // selectedStacks 없는 초기 요청도 그냥 통과시켜야 테스트가 실패하지 않음
        req.reply({
          statusCode: 200,
          body: {
            data: {
              content: [],
              currentPage: 0,
              totalPages: 1,
            },
          },
        });
      }
    }).as("getAvgCareer");

    // 🔍 스택 선택
    cy.get('input[placeholder="기술스택 검색"]').type("Java");
    cy.get("li.autocomplete-item").contains("Java").click();

    cy.wait("@getAvgCareer");

    cy.get(".stack-button-list").contains("Java").should("exist");
    cy.get("canvas").should("exist");
  });

  it("필터 초기화 버튼을 누르면 모든 요소가 사라진다", () => {
    // 자동완성 API 응답 설정
    cy.intercept("GET", "/api/v1/statistics/all-tech-stacks", {
      statusCode: 200,
      body: { data: ["Java", "React"] },
    });

    // 평균 경력 API 인터셉트 설정
    cy.intercept("GET", "/api/v1/statistics/stack/average-career*", (req) => {
      const stacks = req.query.selectedStacks;
      const isValid = Array.isArray(stacks)
        ? stacks.includes("React")
        : stacks === "React";

      if (isValid) {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              content: [
                {
                  techStackName: "React",
                  averageCareer: 5.1,
                  minCareer: 2,
                  maxCareer: 9,
                  count: 12,
                },
              ],
              currentPage: 0,
              totalPages: 1,
            },
          },
        });
      } else {
        // 초기 빈 요청이나 초기화 후 요청 대응
        req.reply({
          statusCode: 200,
          body: {
            data: {
              content: [],
              currentPage: 0,
              totalPages: 1,
            },
          },
        });
      }
    }).as("getReactData");

    // React 입력 후 선택
    cy.get('input[placeholder="기술스택 검색"]').type("React");
    cy.get("li.autocomplete-item").contains("React").click();

    // 요청 완료 대기
    cy.wait("@getReactData");

    // 필터 초기화 버튼 클릭
    cy.get("button").contains("필터 초기화").click();

    // 결과 확인
    cy.get(".stack-button-list").should("be.empty");
    cy.get(".chart-canvas").should("exist"); // 차트는 존재하지만 데이터는 비어 있음
  });

  it("무한 스크롤 시 다음 페이지 데이터가 추가로 로드된다", () => {
    cy.intercept("GET", "/api/v1/statistics/stack/average-career**", (req) => {
      const page = req.query.page;
      if (page === "0") {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              content: Array.from({ length: 10 }, (_, i) => ({
                techStackName: `Tech${i + 1}`,
                averageCareer: 1,
                minCareer: 0,
                maxCareer: 2,
                count: 5,
              })),
              currentPage: 0,
              totalPages: 2,
            },
          },
        });
      } else {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              content: Array.from({ length: 5 }, (_, i) => ({
                techStackName: `Tech${i + 11}`,
                averageCareer: 2,
                minCareer: 1,
                maxCareer: 3,
                count: 3,
              })),
              currentPage: 1,
              totalPages: 2,
            },
          },
        });
      }
    }).as("getCareerPage");

    cy.get('input[placeholder="기술스택 검색"]').type("Java");
    cy.contains("Java").click();

    cy.get(".career-list-container").scrollTo("bottom");

    cy.wait("@getCareerPage");

    cy.get(".item").should("have.length", 15);
  });
});
