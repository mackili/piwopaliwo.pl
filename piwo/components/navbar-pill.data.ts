import { TranslationKey } from "@/locales/en";
import { LucideIcon } from "lucide-react";
import {
    BadgeCentIcon,
    BeerIcon,
    EqualApproximatelyIcon,
    Gamepad2Icon,
    HomeIcon,
    NewspaperIcon,
    SailboatIcon,
    TerminalIcon,
    VolleyballIcon,
} from "lucide-react";

export interface MenuItem {
    title?: string;
    description?: TranslationKey;
    id: TranslationKey;
    order?: number;
    link?: string;
    icon: LucideIcon;
    status: "active" | "disabled";
}

export type AuxiliaryMenuItem = MenuItem;

export type MainMenuItem = MenuItem & {
    children?: AuxiliaryMenuItem[];
};

export const menuItems: MainMenuItem[] = [
    {
        id: "NavMenu.home",
        order: 0,
        link: "/",
        status: "active",
        icon: HomeIcon,
        children: [
            {
                description: "NavMenu.blog_description",
                id: "NavMenu.blog",
                icon: NewspaperIcon,
                link: "/blog",
                status: "active",
            },
        ],
    },
    {
        id: "NavMenu.games",
        order: 10,
        status: "disabled",
        icon: Gamepad2Icon,
        children: [
            {
                id: "NavMenu.piwopol",
                icon: BadgeCentIcon,
                // link: "#",
                status: "disabled",
            },
        ],
    },
    {
        id: "NavMenu.apps",
        order: 20,
        description: "NavMenu.apps_description",
        status: "active",
        icon: TerminalIcon,
        children: [
            {
                description: "NavMenu.accountant_description",
                id: "NavMenu.accountant",
                link: "/apps/accountant",
                icon: EqualApproximatelyIcon,
                status: "active",
            },
            {
                description: "NavMenu.scoreTracker_description",
                id: "NavMenu.scoreTracker",
                link: "/apps/scoretracker",
                icon: VolleyballIcon,
                status: "active",
            },
            {
                description: "NavMenu.beerCounter_description",
                id: "NavMenu.beerCounter",
                link: "/apps/beercounter",
                status: "active",
                icon: BeerIcon,
            },
            {
                id: "NavMenu.tripPlanner",
                link: "/apps/trip-planner",
                icon: SailboatIcon,
                description: "NavMenu.tripPlanner_description",
                status: "active",
            },
        ],
    },
] as const;
