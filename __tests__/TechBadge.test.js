// TechBadge.test.js
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import TechBadge from "@/components/badge/TechBadge.vue";

describe("TechBadge.vue", () => {
  it("label이 정상적으로 렌더링된다", () => {
    const wrapper = mount(TechBadge, {
      props: { label: "Java" },
    });
    expect(wrapper.text()).toContain("Java");
  });
});
