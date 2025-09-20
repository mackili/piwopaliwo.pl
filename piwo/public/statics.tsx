export const organization = {
    name: "Piwo Paliwo 2.0",
};

interface MenuItem {
    title: string;
    description?: string;
    id: string;
    order?: number;
    link: string;
}

type AuxiliaryMenuItem = MenuItem;

type MainMenuItem = MenuItem & {
    children?: AuxiliaryMenuItem[];
};

export const menuItems: MainMenuItem[] = [
    { title: "Home", id: "home", order: 0, link: "/" },
    {
        title: "Games",
        description: "Find all games offered on the platform here",
        id: "games",
        order: 10,
        link: "#",
        children: [
            {
                title: "Piwopol",
                description: `PiwoPaliwo's version of the famous economic game`,
                id: "piwopol",
                link: "#",
            },
            {
                title: "Piwopol",
                description: `PiwoPaliwo's version of the famous economic game`,
                id: "piwopol",
                link: "#",
            },
        ],
    },
    {
        title: "Apps",
        id: "apps",
        order: 20,
        link: "#",
        children: [
            {
                title: "Score tracker",
                description: `Track a score for any game with multiple users. Live!`,
                id: "scoreTracker",
                link: "/apps/scoretracker",
            },
        ],
    },
];
