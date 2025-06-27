import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import DeveloperListView from '@/features/developer/views/DeveloperListView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import * as memberApi from '@/api/member';

vi.mock('@/api/member', () => ({
    fetchDeveloperList: vi.fn(),
    updateMemberStatus: vi.fn(),
}));

// 목 데이터
const mockDevelopers = [
    {
        name: '홍길동',
        position: '백엔드',
        department: '개발팀',
        employeeId: '001',
        grade_code: 'A',
        status: 'AVAILABLE',
        profileImageUrl: 'https://example.com/profile.jpg',
        topTechStackName: 'Java',
        joinedAt: '2020-01-01T00:00:00'
    }
];

// 더미 컴포넌트
const DeveloperDetailStub = {
    template: '<div>개발자 상세 페이지</div>'
};

// 라우터 설정
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'developer-list', component: DeveloperListView },
        { path: '/members/:employeeId', name: 'developer-detail', component: DeveloperDetailStub }
    ]
});

describe('DeveloperListView.vue', () => {
    beforeEach(async () => {
        vi.clearAllMocks();

        memberApi.fetchDeveloperList.mockResolvedValue({
            data: { data: { content: mockDevelopers } }
        });

        router.push('/');
        await router.isReady();
    });

    it('개발자 목록을 렌더링한다', async () => {
        const wrapper = mount(DeveloperListView, {
            global: {
                plugins: [router]
            }
        });

        await flushPromises();
        expect(wrapper.text()).toContain('홍길동');
        expect(wrapper.text()).toContain('Java');
    });

    it('검색어가 있을 때 메시지를 표시한다', async () => {
        const wrapper = mount(DeveloperListView, {
            global: {
                plugins: [router]
            }
        });

        wrapper.vm.searchKeyword = '홍';
        await flushPromises();

        expect(wrapper.text()).toContain('"홍"에 대한 검색 결과입니다');
    });

    it('상태 변경 드롭다운을 열고 상태 변경을 시도한다', async () => {
        memberApi.updateMemberStatus.mockResolvedValue({});

        const wrapper = mount(DeveloperListView, {
            global: {
                plugins: [router]
            }
        });

        await flushPromises();
        await wrapper.find('td:last-child button').trigger('click');
        await wrapper.find('ul li').trigger('click');

        expect(memberApi.updateMemberStatus).toHaveBeenCalledWith('001', expect.any(String));
    });

    it('개발자 row 클릭 시 상세 페이지 이동', async () => {
        const wrapper = mount(DeveloperListView, {
            global: {
                plugins: [router]
            }
        });

        await flushPromises();
        await wrapper.find('tbody tr').trigger('click');

        expect(router.currentRoute.value.name).toBe('developer-list');
    });
});