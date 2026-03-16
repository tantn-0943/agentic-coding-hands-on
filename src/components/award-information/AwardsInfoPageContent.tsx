"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { Award, AwardNavigationItem, KudosPromo } from "@/types/awards";
import { AwardDetailCard } from "@/components/award-information/AwardDetailCard";
import { AwardsKudosPromo } from "@/components/award-information/AwardsKudosPromo";
import { AwardsMenu } from "@/components/award-information/AwardsMenu";

const HEADER_OFFSET = 112;

type Props = {
  awards: Award[];
  menuItems: AwardNavigationItem[];
  kudosPromo: KudosPromo;
};

function isValidSectionId(
  sectionIds: string[],
  targetSectionId: string,
): boolean {
  return sectionIds.includes(targetSectionId);
}

export function AwardsInfoPageContent({
  awards,
  menuItems,
  kudosPromo,
}: Props) {
  const sectionIds = useMemo(
    () => menuItems.map((item) => item.targetSectionId),
    [menuItems],
  );
  const [activeMenuId, setActiveMenuId] = useState(menuItems[0]?.id ?? "");

  const scrollToSection = useCallback(
    (
      targetSectionId: string,
      behavior: ScrollBehavior = "smooth",
      updateHash = true,
    ) => {
      if (!isValidSectionId(sectionIds, targetSectionId)) {
        return;
      }

      const section = document.getElementById(targetSectionId);
      if (!section) {
        return;
      }

      const top =
        section.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top: Math.max(top, 0), behavior });
      setActiveMenuId(targetSectionId);

      if (updateHash) {
        window.history.replaceState(null, "", `#${targetSectionId}`);
      }
    },
    [sectionIds],
  );

  useEffect(() => {
    if (!sectionIds.length) {
      return;
    }

    const hash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (hash && isValidSectionId(sectionIds, hash)) {
      setActiveMenuId(hash);
      requestAnimationFrame(() => {
        scrollToSection(hash, "auto", false);
      });
      return;
    }

    setActiveMenuId(menuItems[0]?.id ?? "");
  }, [menuItems, scrollToSection, sectionIds]);

  useEffect(() => {
    if (!sectionIds.length || typeof IntersectionObserver === "undefined") {
      return;
    }

    const sections = sectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (!visibleEntries.length) {
          return;
        }

        visibleEntries.sort(
          (entryA, entryB) =>
            Math.abs(entryA.boundingClientRect.top) -
            Math.abs(entryB.boundingClientRect.top),
        );

        const nextActiveId = visibleEntries[0]?.target.id;
        if (nextActiveId && isValidSectionId(sectionIds, nextActiveId)) {
          setActiveMenuId(nextActiveId);
        }
      },
      {
        root: null,
        rootMargin: "-18% 0px -55% 0px",
        threshold: [0.2, 0.35, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <>
      <section
        className="relative min-h-[60vh] overflow-hidden bg-[#00101A]"
        aria-label="Awards hero"
      >
        <Image
          src="/images/login-bg.jpg"
          alt=""
          aria-hidden={true}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div
          aria-hidden={true}
          className="absolute inset-0"
          style={{ background: "var(--gradient-overlay-homepage)" }}
        />
        <div className="relative z-[1] mx-auto flex min-h-[60vh] max-w-[1440px] flex-col justify-end gap-6 px-4 py-16 md:px-10 md:py-20 lg:px-36 lg:py-24">
          <Image
            src="/images/root-further-logo.png"
            alt="ROOT FURTHER – SAA 2025"
            width={451}
            height={200}
            priority
            className="w-full max-w-[260px] object-contain md:max-w-[320px] lg:max-w-[451px]"
          />
          <div className="space-y-3 text-white">
            <p className="font-[family-name:var(--font-montserrat)] text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
              Awards Information
            </p>
            <p className="max-w-2xl font-[family-name:var(--font-montserrat)] text-base leading-7 text-white/90 md:text-lg">
              Tra cứu đầy đủ cơ cấu giải thưởng SAA 2025, giá trị từng hạng mục
              và thông tin liên quan để theo dõi chương trình một cách nhanh
              chóng.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#00101A] py-16 text-white md:py-20 lg:py-24">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-4 md:px-10 lg:px-36">
          <header className="flex flex-col items-center gap-4 text-center">
            <p className="font-[family-name:var(--font-montserrat)] text-2xl font-bold leading-8 text-white">
              Sun* Annual Awards 2025
            </p>
            <div className="h-px w-full bg-[#2E3940]" />
            <h1 className="font-[family-name:var(--font-montserrat)] text-[32px] font-bold leading-tight text-[#FFEA9E] md:text-[42px] lg:text-[57px] lg:leading-[64px] lg:tracking-[-0.25px]">
              Hệ thống giải thưởng SAA 2025
            </h1>
          </header>

          <div className="grid gap-8 lg:grid-cols-[178px_minmax(0,1fr)] lg:gap-10">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <AwardsMenu
                items={menuItems}
                activeId={activeMenuId}
                onSelect={scrollToSection}
              />
            </aside>

            <div>
              {awards.map((award) => (
                <AwardDetailCard
                  key={award.id}
                  award={award}
                  sectionId={award.linkSlug}
                />
              ))}
            </div>
          </div>

          <AwardsKudosPromo promo={kudosPromo} />
        </div>
      </section>
    </>
  );
}
