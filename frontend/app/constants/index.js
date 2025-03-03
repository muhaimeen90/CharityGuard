import {
  createCampaign,
  home,
  logout,
  notifications,
  profile,
} from "../assets/index";

export const navlinks = [
  {
    name: "home",
    imgUrl: home,
    link: "/home",
  },
  {
    name: "campaign",
    imgUrl: createCampaign,
    link: "/create-campaign",
  },
  {
    name: "notifications",
    imgUrl: notifications,
    link: "/notifications",
  },
  {
    name: "profile",
    imgUrl: profile,
    link: "/profile",
  },
  {
    name: "logout",
    imgUrl: logout,
    link: "#", // Using # as we'll handle this with custom logic
    disabled: false, // Changed to false to enable logout
  },
];