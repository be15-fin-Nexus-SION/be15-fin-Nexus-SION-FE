/// <reference types="cypress" />

describe('개발자 상세 페이지', () => {
    const employeeId = '001';

    beforeEach(() => {
        // 개발자 상세 정보 mock
        cy.intercept('GET', `/api/v1/members/${employeeId}`, {
            success: true,
            data: {
                employeeId: '001',
                name: '진영',
                profileImageUrl: 'https://cdn.example.com/profile/hong.jpg',
                phoneNumber: '01012345278',
                position: 'Backend',
                department: 'Platform',
                birthday: '1998-09-14',
                joinedAt: '2023-08-01',
                email: 'hog@example.com',
                careerYears: 5,
                salary: 60000000,
                status: 'AVAILABLE',
                grade: 'D',
                role: 'INSIDER'
            },
            errorCode: null,
            message: null,
            timestamp: '2025-06-27T16:21:21.042408'
        }).as('getDeveloperDetail');

        // 기술 스택 점수 mock
        cy.intercept('GET', `/api/v1/members/${employeeId}/tech-stacks`, {
            success: true,
            data: [
                { techStackName: 'test3', score: 12 },
                { techStackName: 'Spring Boot', score: 9 },
                { techStackName: 'test7', score: 6 },
                { techStackName: 'test6', score: 6 },
                { techStackName: 'java', score: 5 },
                { techStackName: 'test1', score: 5 },
                { techStackName: 'test5', score: 5 },
                { techStackName: 'test4', score: 4 },
                { techStackName: 'Spring Boot', score: 4 },
                { techStackName: 'MySQL', score: 4 },
                { techStackName: 'spring', score: 4 },
                { techStackName: 'test2', score: 3 }
            ],
            errorCode: null,
            message: null,
            timestamp: '2025-06-27T16:21:21.042408'
        }).as('getTechStacks');

        cy.visit(`/members/${employeeId}`);
    });

    it('기본 정보가 정상적으로 표시된다', () => {
        cy.wait('@getDeveloperDetail');
        cy.wait('@getTechStacks');

        cy.contains('개발자 상세');
        cy.contains('진영');
        cy.contains('001'); // 사번
        cy.contains('Backend');
        cy.contains('Platform');
        cy.contains('1998-09-14');
        cy.contains('hog@example.com');
        cy.contains('01012345278');
        cy.contains('5년차');
        cy.contains('대기중');
    });

    it('기술 스택과 차트가 정상적으로 표시된다', () => {
        cy.wait('@getDeveloperDetail');
        cy.wait('@getTechStacks');

        cy.get('.flex.flex-wrap').within(() => {
            cy.contains('test3');
            cy.contains('Spring Boot');
            cy.contains('java');
        });

        cy.get('canvas').should('have.length.at.least', 2); // RadarChart + BarChart
    });

    it('삭제 및 수정 버튼이 존재한다', () => {
        cy.wait('@getDeveloperDetail');
        cy.contains('수정').should('be.visible');
        cy.contains('삭제').should('be.visible');
    });

    it('이력 관리 항목이 표시된다', () => {
        cy.wait('@getDeveloperDetail');
        cy.contains('이력 관리');
        cy.contains('프로젝트 이력이 없습니다.');
    });
});