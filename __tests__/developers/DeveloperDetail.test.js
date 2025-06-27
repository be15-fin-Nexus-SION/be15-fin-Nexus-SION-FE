// __tests__/DeveloperDetailView.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import DeveloperDetailView from '@/features/developer/views/DeveloperDetailView.vue';
import { createRouter, createWebHistory } from 'vue-router';

// API 모킹
vi.mock('@/api/member', () => ({
    fetchDeveloperDetail: vi.fn(),
    fetchTechStacksByEmployeeId: vi.fn()
}));

import { fetchDeveloperDetail, fetchTechStacksByEmployeeId } from '@/api/member';

// 테스트용 라우터
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/members/:employeeId',
            name: 'developer-detail',
            component: DeveloperDetailView
        }
    ]
});

const mockDeveloper = {
    name: '홍길동',
    employeeId: '001',
    grade: 'A',
    position: '백엔드',
    department: '개발팀',
    birthday: '1990-01-01',
    email: 'hong@test.com',
    joinedAt: '2020-01-01',
    phoneNumber: '010-1234-5678',
    careerYears: 5,
    status: 'IN_PROJECT',
    profileImageUrl: 'https://example.com/profile.jpg'
};

const mockTechStacks = [
    { techStackName: 'Java', score: 90 },
    { techStackName: 'Spring', score: 85 },
    { techStackName: 'MySQL', score: 70 },
    { techStackName: 'JPA', score: 65 },
    { techStackName: 'Redis', score: 60 },
    { techStackName: 'Docker', score: 55 },
    { techStackName: 'Vue', score: 50 },
    { techStackName: 'AWS', score: 45 }
];

describe('DeveloperDetailView.vue', () => {
    beforeEach(async () => {
        vi.clearAllMocks();

        fetchDeveloperDetail.mockResolvedValue({
            data: {
                data: mockDeveloper
            }
        });

        fetchTechStacksByEmployeeId.mockResolvedValue({
            data: {
                data: mockTechStacks
            }
        });

        router.push('/members/001');
        await router.isReady();
    });

    it('개발자 상세 정보를 렌더링한다', async () => {
        const wrapper = mount(DeveloperDetailView, {
            global: {
                plugins: [router]
            }
        });

        await flushPromises();

        expect(wrapper.text()).toContain('홍길동');
        expect(wrapper.text()).toContain('개발팀');
        expect(wrapper.text()).toContain('투입중'); // status 라벨
    });

    it('기술 스택 뱃지를 렌더링한다', async () => {
        const wrapper = mount(DeveloperDetailView, {
            global: { plugins: [router] }
        });

        await flushPromises();

        mockTechStacks.forEach((stack) => {
            expect(wrapper.text()).toContain(stack.techStackName);
        });
    });

    it('RadarChart와 BarChart 컴포넌트가 존재한다', async () => {
        const wrapper = mount(DeveloperDetailView, {
            global: { plugins: [router] }
        });

        await flushPromises();

        const radar = wrapper.findComponent({ name: 'RadarChart' });
        const bar = wrapper.findComponent({ name: 'BarChart' });

        expect(radar.exists()).toBe(true);
        expect(bar.exists()).toBe(true);
    });
});