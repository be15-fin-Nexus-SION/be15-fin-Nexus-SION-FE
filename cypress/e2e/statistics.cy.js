describe("스택 통계 페이지", () => {
  it("기술스택을 추가하고 제거하면 드롭다운 옵션이 반영된다", () => {
    cy.visit("/statistics/stack/member-count");

    // 1. 검색창에 Java 입력
    cy.get("input[placeholder='기술스택 검색']").type("Java");

    // 2. 자동완성에서 Java 클릭
    cy.contains("li", "Java").click();

    // 3. Java 뱃지 존재 확인
    cy.get(".stack-button-list").contains("Java").should("exist");
    cy.get(".selected-stacks").contains("Java").should("exist");

    // 4. Java 뱃지의 X 아이콘 클릭
    cy.get(".selected-stacks")
      .contains("Java")
      .parent() // .tech-text → .tech-badge
      .find("div.cursor-pointer") // X 버튼 div
      .click();

    // 5. Java가 뱃지에서 제거되었는지 확인
    cy.get(".selected-stacks").should("not.contain", "Java");

    // 6. 드롭다운에 Java가 다시 표시되는지 확인
    cy.get("#stack-select option", { timeout: 5000 })
      .should("have.length.at.least", 1)
      .then(($options) => {
        const hasJava = [...$options].some((o) =>
          o.textContent.includes("Java"),
        );
        expect(hasJava).to.be.true;
      });
  });
});
