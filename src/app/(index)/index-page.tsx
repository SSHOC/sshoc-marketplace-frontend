"use client";

import { type ReactNode } from "react";

import { FundingNotice } from "@/components/common/FundingNotice";
import { BackgroundImage } from "@/components/home/BackgroundImage";
import { BrowseItems } from "@/components/home/BrowseItems";
import { Hero } from "@/components/home/Hero";
import { HomeScreenLayout } from "@/components/home/HomeScreenLayout";
import { ItemSearchForm } from "@/components/home/ItemSearchForm";
import { ItemSearchFormPanel } from "@/components/home/ItemSearchFormPanel";
import { LastUpdatedItems } from "@/components/home/LastUpdatedItems";
import { PeopleImage } from "@/components/home/PeopleImage";
import { RecommendedItems } from "@/components/home/RecommendedItems";
import { PageMainContent } from "@/lib/core/page/PageMainContent";

export default function IndexPage(): ReactNode {
  return (
    <PageMainContent>
      <HomeScreenLayout>
        <BackgroundImage />
        <PeopleImage />
        <Hero>
          <ItemSearchFormPanel>
            <ItemSearchForm />
          </ItemSearchFormPanel>
        </Hero>
        <BrowseItems />
        <RecommendedItems />
        <LastUpdatedItems />
        <FundingNotice />
      </HomeScreenLayout>
    </PageMainContent>
  );
}
