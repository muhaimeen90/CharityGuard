import {
  createCampaign,
  home,
  logout,
  notifications,
  //payment,
  profile,
  //withdraw,
} from "../assets/index";

export const navlinks = [
  {
    name: "home",
    imgUrl: home,
    link: "/",
  },
  {
    name: "campaign",
    imgUrl: createCampaign,
    link: "/create-campaign",
  },
  // {
  //   name: "payment",
  //   imgUrl: payment,
  //   link: "/",
  //   disabled: true,
  // },
  {
    name: "notifications",
    imgUrl: notifications,
    link: "notifications",
    disabled: true,
  },
  {
    name: "profile",
    imgUrl: profile,
    link: "/profile",
  },
  {
    name: "logout",
    imgUrl: logout,
    link: "/",
    disabled: true,
  },
];
