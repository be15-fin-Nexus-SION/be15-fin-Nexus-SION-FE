import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import DeveloperListView from "@/features/developer/views/DeveloperListView.vue";
import { createRouter, createWebHistory } from "vue-router";
import * as memberApi from "@/api/member";

vi.mock("@/api/member", () => ({
  fetchDeveloperList: vi.fn(),
  updateMemberStatus: vi.fn(),
}));

const mockDevelopers = [
  {
    name: "홍길동",
    position: "백엔드",
    department: "개발팀",
    employeeId: "001",
    grade_code: "A",
    status: "AVAILABLE",
    profileImageUrl: "https://example.com/profile.jpg",
    topTechStackName: "Java",
    joinedAt: "2020-01-01T00:00:00",
  },
];

const DeveloperDetailStub = {
  template: "<div>개발자 상세 페이지</div>",
};

const routes = [
  { path: "/", name: "developer-list", component: DeveloperListView },
  {
    path: "/members/:employeeId",
    name: "developer-detail",
    component: DeveloperDetailStub,
  },
];

describe("DeveloperListView.vue", () => {
  let router;

  beforeEach(async () => {
    vi.clearAllMocks();

    // 각 테스트마다 fresh router instance 생성
    router = createRouter({
      history: createWebHistory(),
      routes,
    });

    memberApi.fetchDeveloperList.mockResolvedValue({
      data: { data: { content: mockDevelopers } },
    });

    router.push("/");
    await router.isReady();
  });

  const mountWithRouter = async () => {
    const wrapper = mount(DeveloperListView, {
      global: {
        plugins: [router],
      },
      attachTo: document.body, // ← 이게 중요: router DOM 반영
    });
    await flushPromises();
    return wrapper;
  };

  it("개발자 목록을 렌더링한다", async () => {
    const wrapper = await mountWithRouter();
    expect(wrapper.text()).toContain("홍길동");
    expect(wrapper.text()).toContain("Java");
  });

  it("검색어가 있을 때 메시지를 표시한다", async () => {
    const wrapper = await mountWithRouter();
    wrapper.vm.searchKeyword = "홍";
    await flushPromises();

    expect(wrapper.text()).toContain('"홍"에 대한 검색 결과입니다');
  });

  it("상태 변경 드롭다운을 열고 상태 변경을 시도한다", async () => {
    memberApi.updateMemberStatus.mockResolvedValue({});
    const wrapper = await mountWithRouter();

    await wrapper.find("td:last-child button").trigger("click");
    await wrapper.find("ul li").trigger("click");

    expect(memberApi.updateMemberStatus).toHaveBeenCalledWith(
      "001",
      expect.any(String),
    );
  });

  it("개발자 row 클릭 시 상세 페이지 이동", async () => {
    const wrapper = await mountWithRouter();

    await wrapper.find("tbody tr").trigger("click");
    await flushPromises(); // router.push 이후 변경 감지

    // 여기서 확인
    expect(router.currentRoute.value.name).toBe("developer-detail");
    expect(router.currentRoute.value.params.employeeId).toBe("001");
  });
});
